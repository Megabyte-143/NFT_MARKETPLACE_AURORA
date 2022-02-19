import styled from "styled-components";
import Header from "./Header";
import Tokens from "./Tokens";

const nftdata = [
    {
      image: "./images/0 (6).png",
      type: "timed",
      price: "$33,000",
    },
    {
      image: "./images/0 (7).png",
      type: "timed",
      price: "$27,000",
    },
    {
      image: "./images/0 (8).png",
      type: "timed",
      price: "$805,000",
    },
    {
      image: "./images/0 (9).png",
      type: "timed",
      price: "$230,000",
    },
    {
      image: "./images/0 (10).png",
      type: "timed",
      price: "$78,000",
    },
    {
      image: "./images/0 (11).png",
      type: "timed",
      price: "$121,000",
    }
  ];

  const timed = () => {
    
    return (
      
         <>
         <Header heading ="Timed Auction" click="Create" click2="User"/>
          <Container>
            <Tokens nfts={nftdata} buy="Bid" hide="true" high="Highest Bid: "/>
          </Container>
         </>
      
    );
  };
  
  export default timed;
  
  const Container = styled.div`
    scroll-behavior: smooth;
    padding: 30px 60px;
     margin-top:48px;
    /* background-color: beige; */
  `;
  