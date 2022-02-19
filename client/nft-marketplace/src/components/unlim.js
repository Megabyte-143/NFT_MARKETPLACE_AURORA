import styled from "styled-components";
import Header from "./Header";
import Tokens from "./Tokens";

const nftdata = [
    {
      image: "./images/0 (12).png",
      type: "unlim",
      price: "$32,000",
    },
    {
      image: "./images/0 (13).png",
      type: "unlim",
      price: "$39,000",
    },
    {
      image: "./images/0 (14).png",
      type: "unlim",
      price: "$96,000",
    },
    {
      image: "./images/0 (15).png",
      type: "unlim",
      price: "$302,000",
    },
    {
      image: "./images/0 (16).png",
      type: "unlim",
      price: "$76,000",
    },
    {
      image: "./images/0 (17).png",
      type: "unlim",
      price: "$761,000",
    },
  ];

const unlim = () => {
    
  return (
    
       <>
       <Header heading ="Unlimited Auction" click="Create" click2="User"/>
        <Container>
          <Tokens nfts={nftdata} buy="Bid" hide="true" high="Highest Bid: "/>
        </Container>
       </>
    
  );
};

export default unlim;

const Container = styled.div`
  scroll-behavior: smooth;
  padding: 30px 60px;
   margin-top:48px;
  /* background-color: beige; */
`;

