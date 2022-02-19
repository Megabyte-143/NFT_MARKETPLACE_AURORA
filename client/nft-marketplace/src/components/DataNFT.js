import styled from "styled-components";
import All from "./Tokens";
import direct from "./direct";
import timed from "./timed";
import unlim from "./unlim";
import {MyObject} from "./Header"
import Tokens from "./Tokens";

const fixedNft = [];
const unlimitedNFT = [];
const timeNFT = []; 
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
  },
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
  },
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
function directNft() {
  nftdata.forEach((nft) => {
    if (nft.type === "direct") {
      fixedNft.push(nft);
    }
  });
  return fixedNft;
}
function timedNft() {
  nftdata.forEach((nft) => {
    if (nft.type === "timed") {
      timeNFT.push(nft);
    }
  });
  return timeNFT;
}
function unlimNft() {
  nftdata.forEach((nft) => {
    if (nft.type === "unlim") {
      unlimitedNFT.push(nft);
    }
  });
  return unlimitedNFT;
}

function Home() {
  // let val = MyObject.value;
  console.log(MyObject.value)
   if (MyObject.value === "direct") {
    directNft();
    return (
      <Container>
        <direct nfts={fixedNft} />
      </Container>
    );
  } else if(MyObject.value === "timed") {
    timedNft();
    return (
      <Container>
        <timed nfts={timeNFT} />
      </Container>
    );
  } else if(MyObject.value === "unlim") {
    unlimNft();
    return (
      <Container>
        <unlim nfts={unlimitedNFT} />
      </Container>
    );
  } else {
    return (
      <Container>
        <All nfts={nftdata} />
      </Container>
    );
  }
}

export default All;

const Container = styled.div`
  scroll-behavior: smooth;
`;
