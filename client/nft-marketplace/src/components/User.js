import styled from "styled-components";
import Header from "./Header";
import Tokens from "./Tokens";
import { useState } from "react";

const nftdataowned = [
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

const nftdatacreate = [
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
  
const User = () => {
  const [index,setIndex] = useState(1);
  function indexing(i) {
      setIndex(i);
  }
  return (
       <>
       <Header heading ="" click2="User" click="Create" value="2"/>
       <Container>
            <Content>
                <Owned onClick = {()=>indexing(1)} color={index === 1}>
                    <span>Owned NFTs</span>
                </Owned>
                <Created onClick = {()=>indexing(2)} color={index === 2}>
                    <span>Created NFTs</span>
                </Created>
            </Content>
            <PageOwn show={index === 1}>
                <Tokens nfts={nftdataowned} hide={false} high="Price: " buy=""></Tokens>
            </PageOwn>
            <PageCreate show={index === 2}>
                <Tokens nfts={nftdatacreate} hide={false} high="Price: " buy=""></Tokens>
            </PageCreate>
       </Container>
       </>
  );
};

export default User;

const Container = styled.div`
   scroll-behavior: smooth;
   padding: 30px 60px;
   margin-top:40px;
`
const Owned = styled.div`
    span {
        padding:10px;
        cursor:pointer;
    }
    margin:15px 10px;
    font-size:15px;
    font-weight: bold;
    letter-spacing: 2px;
    padding:10px;
    background-color: ${(props) => (props.color ? "#ffb84d" : "antiquewhite")};
    border-radius: 10px;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0/73%) 0px 16px 10px -10px;
    cursor: pointer;
    /* position: relative; */
    align-items: center;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
    &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
  }
`
const Created = styled(Owned)`
    background-color: ${(props) => (props.color ? "#ffb84d" : "antiquewhite")};
`
const Content = styled.div`
    display:flex;
    flex-direction: row;
    margin-bottom: 20px;
`
const PageOwn = styled.div`
    position: absolute;
    width:90vw;
    visibility: ${(props) => (props.show ? "visible" : "hidden")};
`
const PageCreate = styled(PageOwn)``