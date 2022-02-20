// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Security Package to avoid continuous request of buying and selling
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./NFT.sol";
import "./TimedAuction.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether; // Here ether is denoting the MATIC

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address payable creator;
        address payable highestBidder;
        uint256 price;
        uint256 bidPrice;
        uint256 royalty;
        uint256 auction;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        address creator,
        address highestBidder,
        uint256 price,
        uint256 bidPrice,
        uint256 royalty,
        uint256 auction,
        bool sold
    );

    event ProductListed(uint256 indexed itemId);

    modifier onlyItemOwner(uint256 id) {
        require(
            idToMarketItem[id].owner == msg.sender,
            "Only product owner can do this operation"
        );
        _;
    }

    // Get the Listing Price on the Platform
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Get the Highest Bidding Price
    function getHighestBid(uint256 itemId) public view returns (uint256) {
        return (idToMarketItem[itemId].bidPrice);
    }

    //Function to create an Market Item
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 royalty,
        uint256 auction
    ) public payable nonReentrant {
        //Conditions for creating the Item.
        require(price > 0, "Price must be at least 1 WEI");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        require(
            royalty >= 0 && royalty <= 50,
            "Royalty should be between 0 and 50%"
        );

        payable(owner).transfer(msg.value);

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)), // When new NFT is created its ownership add is set to 0.
            payable(msg.sender),
            payable(msg.sender),
            price,
            price,
            royalty,
            auction,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        //Trigger the Event
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            msg.sender,
            msg.sender,
            price,
            price,
            royalty,
            auction,
            false
        );
    }

    //Function to sale the NFT
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        require(
            idToMarketItem[itemId].auction == 0,
            "Item listed for auction cannot buy directly"
        );
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking value in order to Purchase"
        );

        //Will transfer the MATIC to the seller address.
        uint256 priceToSeller = (msg.value / 100) *
            (100 - idToMarketItem[itemId].royalty);
        uint256 priceToCreator = (msg.value / 100) *
            idToMarketItem[itemId].royalty;
        idToMarketItem[itemId].seller.transfer(priceToSeller);
        idToMarketItem[itemId].creator.transfer(priceToCreator);

        //Will transfer the ownership from the owner of this contract to the Buyer.
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        //Set the local value of the owner to the Buyer(msg.sender).
        idToMarketItem[itemId].owner = payable(msg.sender);

        //Set this NFT as sold.
        idToMarketItem[itemId].sold = true;
        _itemSold.increment();

        payable(owner).transfer(listingPrice);
    }

    //Function to place bid on Unlimited Timed NFT
    function unlimitedBid(uint256 itemId) public payable nonReentrant {
        require(
            idToMarketItem[itemId].auction == 1,
            "Item not listed for unlimited auction, buy it directly from Market Place"
        );
        require(
            idToMarketItem[itemId].seller != msg.sender,
            "Owner cannot place bids"
        );
        uint256 bidPrice = idToMarketItem[itemId].bidPrice;

        require(msg.value > bidPrice, "Bid should be higher than current bid");

        if (
            idToMarketItem[itemId].highestBidder ==
            idToMarketItem[itemId].creator
        ) {
            idToMarketItem[itemId].bidPrice = msg.value;
            idToMarketItem[itemId].highestBidder = payable(msg.sender);
        } else {
            idToMarketItem[itemId].highestBidder.transfer(bidPrice);
            idToMarketItem[itemId].bidPrice = msg.value;
            idToMarketItem[itemId].highestBidder = payable(msg.sender);
        }
    }

    //Function to close the Unlimited Auction NFT
    function closeAuction(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        require(
            idToMarketItem[itemId].auction == 1,
            "Item not listed for unlimited auction"
        );
        require(
            idToMarketItem[itemId].highestBidder ==
                idToMarketItem[itemId].creator,
            "No bids placed on item"
        );
        require(
            idToMarketItem[itemId].seller == msg.sender,
            "Not the owner so cannot close bid"
        );
        uint256 bidPrice = idToMarketItem[itemId].bidPrice;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        //Will transfer the MATIC to the seller address.
        uint256 priceToSeller = (bidPrice / 100) *
            (100 - idToMarketItem[itemId].royalty);
        uint256 priceToCreator = (bidPrice / 100) *
            idToMarketItem[itemId].royalty;
        idToMarketItem[itemId].seller.transfer(priceToSeller);
        idToMarketItem[itemId].creator.transfer(priceToCreator);

        //Will transfer the ownership from the owner of this contract to the Buyer.
        IERC721(nftContract).transferFrom(
            address(this),
            idToMarketItem[itemId].highestBidder,
            tokenId
        );

        //Set the local value of the owner to the Buyer(msg.sender).
        idToMarketItem[itemId].owner = idToMarketItem[itemId].highestBidder;

        //Set this NFT as sold.
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].auction = 0;
        _itemSold.increment();

        payable(owner).transfer(listingPrice);
    }

    function timedBid(
        uint256 _bidIncrement,
        uint256 _startTime,
        uint256 _endTime,
        address _nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        require(
            idToMarketItem[itemId].auction == 2,
            "Item not listed for timed auction, buy it directly from Market Place"
        );
        require(
            idToMarketItem[itemId].seller != msg.sender,
            "Owner cannot place bids"
        );
        TimedAuction timedContract = TimedAuction(
            payable(idToMarketItem[itemId].seller)
        );

        uint256 bidPrice = timedContract.getHighestBid();

        require(msg.value > bidPrice, "Bid should be higher than current bid");
    }

    function reListItem(
        address nftContract,
        uint256 itemId,
        uint256 price
    ) public payable nonReentrant onlyItemOwner(itemId) {
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(price > 0, "Price must be at least 1 WEI");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        //instantiate a NFT contract object with the matching type
        NFT tokenContract = NFT(nftContract);
        //call the custom transfer token method
        tokenContract.transferToken(msg.sender, address(this), tokenId);

        address payable oldOwner = idToMarketItem[itemId].owner;
        idToMarketItem[itemId].owner = payable(address(0));
        idToMarketItem[itemId].seller = oldOwner;
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].sold = false;
        _itemSold.decrement();

        emit ProductListed(itemId);
    }

    //List of NFTs Avaiable to Buy
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //List of NFTs owned by the User
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //List of NFTs created by a user
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
