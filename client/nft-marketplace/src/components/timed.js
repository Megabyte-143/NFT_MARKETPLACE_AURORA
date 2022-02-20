import styled from "styled-components";
import Header from "./Header";
import Tokens from "./Tokens";
import axios from "axios";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { nftAddress, nftMarketAddress } from "../config.js"

import NFT from "../abi/NFT.json"
import NFTMarket from "../abi/NFTMarket.json"

// const nftdata = [
//     {
//       image: "./images/0 (6).png",
//       type: "timed",
//       price: "$33,000",
//     },
//     {
//       image: "./images/0 (7).png",
//       type: "timed",
//       price: "$27,000",
//     },
//     {
//       image: "./images/0 (8).png",
//       type: "timed",
//       price: "$805,000",
//     },
//     {
//       image: "./images/0 (9).png",
//       type: "timed",
//       price: "$230,000",
//     },
//     {
//       image: "./images/0 (10).png",
//       type: "timed",
//       price: "$78,000",
//     },
//     {
//       image: "./images/0 (11).png",
//       type: "timed",
//       price: "$121,000",
//     }
//   ];

const Timed = () => {

  const [nftdata, setNftData] = useState([]);

  const [nfts, setNfts] = useState([]);
  // const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    //start loading the nfts when webpage loads
    loadNFTs();

  }, []);


  async function loadNFTs() {

    // For the Mumbai Testnet
    const provider = new ethers.providers.JsonRpcProvider();

    // For the LocalHost
    // const provider = new ethers.providers.JsonRpcProvider();

    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, provider);

    //fetching the certificates from the market contracts
    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(data.map(async i => {
      //getting the ipfs url of each certificate item
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      //fetching the ipfs url, which will return a meta json
      const meta = await axios.get(tokenUri);

      let item = {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        auction: i.auction,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        price: meta.data.price,
      };
      return item;

    }));
    setNftData(items);

    const nfts = nftdata.filter((item) => {
      if (parseInt(item.auction, 16) === 2) {
        return item;
      }
    })
    setNfts(nfts);
  }

  return (

    <>
      <Header heading="Timed Auction" click="Create" click2="User" />
      <Container>
        <Tokens nfts={nfts} buy="Bid" hide="true" high="Highest Bid: " />
      </Container>
    </>

  );
};

export default Timed;

const Container = styled.div`
    scroll-behavior: smooth;
    padding: 30px 60px;
     margin-top:48px;
    /* background-color: beige; */
  `;
