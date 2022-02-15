// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//Security Package to avoid continuous request of buying and selling
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TimedAuction is ReentrancyGuard {
    // static
    address payable public owner;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public bidIncrement;

    // state
    bool public canceled;
    uint256 public highestBindingBid;
    address payable public highestBidder;
    mapping(address => uint256) public fundsByBidder;
    bool ownerHasWithdrawn;

    event LogBid(
        address bidder,
        uint256 bid,
        address highestBidder,
        uint256 highestBid,
        uint256 highestBindingBid
    );

    event LogWithdrawal(
        address withdrawer,
        address withdrawalAcc,
        uint256 amount
    );

    event LogCanceled();

    constructor(
        address payable _owner,
        uint256 _bidIncrement,
        uint256 _startTime,
        uint256 _endTime
    ) {
        if ((_endTime - _startTime) < 60) revert("Time must be atleast 1 min");

        owner = _owner;
        bidIncrement = _bidIncrement;
        startTime = block.timestamp + _startTime;
        endTime = block.timestamp + _endTime;
    }

    // It will return the HIGHEST BID.
    function getHighestBid() public view returns (uint256) {
        return fundsByBidder[highestBidder];
    }

    // Comparision Function
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        if (a < b) return a;
        return b;
    }

    // Bid Placing Function
    function placeBid()
        public
        payable
        onlyAfterStart
        onlyBeforeEnd
        onlyNotOwner
        onlyNotCanceled
        minimunValue
        nonReentrant
    {
        // Increase the amount of bid if any.
        uint256 newBid = fundsByBidder[msg.sender] + msg.value;

        // If the New Bid is less than the Highest Binding Bid, the message will return.
        if (newBid <= highestBindingBid)
            revert("Bid Must be greater than Highest Binding Bid");

        // Get the Highest Bid.
        uint256 highestBid = fundsByBidder[highestBidder];

        // Set the new bid of the user.
        fundsByBidder[msg.sender] = newBid;

        if (newBid <= highestBid) {
            // If the new bid is less than the highest bid then we will assign the Highest Binding Bid.

            highestBindingBid = min(newBid + bidIncrement, highestBid);
        } else {
            // If the new bid is the new Highest Bid

            if (msg.sender != highestBidder) {
                // If the bidder is not the previous Highest Bidder
                highestBidder = payable(msg.sender);

                // Assigning new Highest Binding Bid
                highestBindingBid = min(newBid, highestBid + bidIncrement);
            }

            // Assigning new Highest Bid
            highestBid = newBid;
        }
        emit LogBid(
            msg.sender,
            newBid,
            highestBidder,
            highestBid,
            highestBindingBid
        );
    }

    // Auction cancelling Function
    function cancelAuction() public onlyOwner onlyBeforeEnd onlyNotCanceled {
        canceled = true;
        emit LogCanceled();
    }

    // Withdrawing Function
    function withdraw() public payable onlyEndedOrCanceled {
        // Withdrawal Account
        address withdrawalAcc;
        // Amount to be withdrawal
        uint256 withdrawalAmount;

        if (canceled) {
            // If the Auction was canceled, then the amount will be return at once.

            withdrawalAcc = msg.sender;
            withdrawalAmount = fundsByBidder[withdrawalAcc];
        } else {
            // If the Auction is Completed.

            if (msg.sender == owner) {
                // If the user is the owner of the contract.

                withdrawalAcc = highestBidder;

                // Will only receive the highest binding bid.
                withdrawalAmount = highestBindingBid;

                // Owner has Withdrawn will be true
                ownerHasWithdrawn = true;
            } else if (msg.sender == highestBidder) {
                // If the user is the highest bidder
                withdrawalAcc = highestBidder;

                if (ownerHasWithdrawn) {
                    // If the owner has already withdrawn, then the remaining funds will be return to the user[highest bidder or winner].
                    withdrawalAmount = fundsByBidder[highestBidder];
                } else {
                    // If the owner has not withdrawn yet, then the withdrawal amount will be the remaining amount.
                    withdrawalAmount =
                        fundsByBidder[highestBidder] -
                        highestBindingBid;
                }
            } else {
                // If the user is neither Owner or Highest Bidder(Winner), their funds will be return at once.
                withdrawalAcc = msg.sender;
                withdrawalAmount = fundsByBidder[withdrawalAcc];
            }
        }

        // If the user have no amount left.
        require(withdrawalAmount != 0, "No Amount Left to Withdraw");

        // Funds will be deducted from the map.
        fundsByBidder[withdrawalAcc] -= withdrawalAmount;

        require(
            !payable(msg.sender).send(withdrawalAmount),
            "Some Error Occured"
        );

        emit LogWithdrawal(msg.sender, withdrawalAcc, withdrawalAmount);
    }

    modifier onlyOwner() {
        require(msg.sender != owner, "The User Must be Owner");
        _;
    }

    modifier onlyNotOwner() {
        require(msg.sender == owner, "The user must not be the Owner");
        _;
    }

    modifier onlyAfterStart() {
        require(block.timestamp < startTime, "Auction not Started Yet");
        _;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp > endTime, "Auction is Ended");
        _;
    }

    modifier onlyNotCanceled() {
        require(canceled, "Auction is canceled");
        _;
    }

    modifier onlyEndedOrCanceled() {
        require(
            block.timestamp < endTime && !canceled,
            "The Auction is not Ended or Canceled yet."
        );
        _;
    }

    modifier minimunValue() {
        require(msg.value != 0, "Bid Must be Greator than 0");
        _;
    }
}
