import styled from "styled-components";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { nftAddress, nftMarketAddress } from "../config.js"
import NFTMarket from "../abi/NFTMarket.json"

const Tokens = (props) => {


  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer);
    console.log(nft.tokenId);
console.log(nft.price);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    console.log(price)
    // console.log(parseInt(price,16));
    // const price = 1;
    const transaction = await contract.createMarketSale(
      nftAddress,
      5,
      { value: price });
    await transaction.wait();
    
  }


  return (
    <Container >
      <Wrap>
        {
          props.nfts.map((nft, i) => (
            <Content key={i}>
              <img src={nft.image} />
              <Inside>
                <div>
                  <span className="infinite">{props.high}</span>
                  <span className="price">{nft.price} </span>
                </div>
                <button className="buy" onClick={()=>buyNFT(nft)}>{props.buy}</button>
              </Inside>
            </Content>
          ))}
      </Wrap>
    </Container>
  );
};

export default Tokens;

const Container = styled.div`
  scroll-behavior: smooth;
`;
const Wrap = styled.div`
  display: grid;
  grid-gap: 100px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 50px 50px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Content = styled.div`
  padding-top: 95%;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0/73%) 0px 16px 10px -10px;
  cursor: pointer;
  position: relative;
  align-items: center;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border:10px solid rgba(249, 249, 249, 0.1);
  img {
    inset: 0px;
    display: block;
    position: absolute;
    align-items: center;
    justify-content: center;
    opacity: 1;
    width: 100%;
    transition: opacity 500ms ease-in-out 0s;
    z-index: 1;
    top: 0;
  }
  &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.01);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;
const Inside = styled.div`
  display: flex;
  padding:5px;
  justify-content: space-between;
  align-items: center;
  /* width: 100%; */
  .buy {
    background-color: bisque;
    padding: 5px 10px;
    border-radius: 5px;
    &:hover {
      background-color: #ff8000;
    }
  }
  span {
    font-size:15px;
  }

`;
