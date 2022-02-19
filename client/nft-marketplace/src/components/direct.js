import styled from "styled-components";
import Header from "./Header";
import Tokens from "./Tokens";

const nftdata = [
    {
      image: "./images/0.png",
      type: "direct",
      price: "$30,000",
    },
    {
      image: "./images/0 (1).png",
      type: "direct",
      price: "$50,000",
    },
    {
      image: "./images/0 (2).png",
      type: "direct",
      price: "$60,000",
    },
    {
      image: "./images/0 (3).png",
      type: "direct",
      price: "$130,000",
    },
    {
      image: "./images/0 (4).png",
      type: "direct",
      price: "$46,000",
    },
    {
      image: "./images/0 (5).png",
      type: "direct",
      price: "$330,000",
    }
  ];

const direct = () => {
    
  return (
       <>
       <Header heading ="Fixed Price" click="Create" click2="User"/>
        <Container>
          <Tokens nfts={nftdata} hide={true} buy="Buy" high="Price: "/>
        </Container>
       </>
  );
};

export default direct;

const Container = styled.div`
  scroll-behavior: smooth;
  padding: 30px 60px;
   margin-top:48px;
`;

