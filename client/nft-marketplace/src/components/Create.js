import Header from "./Header";
import styled from "styled-components";
import React from "react";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../abi/NFT.json";
import NFTMarket from "../abi/NFTMarket.json";


const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");


const Create = (props) => {
  const [index, setIndex] = useState(1);
  const [showCalendar, setShowCalender] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ name: '', description: '', price: '', royalty: '' });

  async function onFileChange(e) {
    //selecting the first file, which is uploaded
    const file = e.target.files[0];
    try {
      //uploading it to ipfs
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      //creating the url to fetch the uploaded file
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create a new creatificate.
   */
  async function createCertificate() {
    //getting name, description from the formInput dictionary
    const { name, description, price, royalty } = formInput;

    //If any of them is not present then it will not create the Item
    if (!name || !description || !fileUrl || !price || !royalty) return;

    const data = JSON.stringify({
      name, description, image: fileUrl, price, index, royalty
    });

    try {
      //uploading the certificate to ipfs
      const added = await client.add(data);
      //creating url to fetch the uploaded certificate
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(url)
      //listing the certificate or marking it as sale
      putItem(url);
    } catch (error) {
      console.log("Error in Uploading File:", error);
    }
  }

  /**
     * Creating the NFT and Making it to sale. Calling the web 3.0 contracts here.
     * @param {string} url ipfs url where certificate is uploaded
     */
  async function putItem(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let { royalty, price } = formInput;

    //NFT Contract
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    //minting the certificate
    let transaction = await contract.createToken(url);
    //waiting for the minting transaction to finish

    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber(); //Token Id Of the NFT
    console.log(tokenId)

    //NFT Market Contract
    contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer);

    //fetching listing price from the contract
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    // const priceC = ethers.utils.parseUnits(price.toString(), 'ether');

    //listing the certificate. 
    transaction = await contract.createMarketItem(
      nftAddress,
      tokenId,
      parseInt(price),
      royalty,
      index.toString(),
      { value: listingPrice }
    );
    //waiting for the transaction to complete
    await transaction.wait();
    console.log("completed")

    //navigate back to home page

  }

  function calendar() {
    var starting = document.getElementById("starting")
    var selectedValue = starting.options[starting.selectedIndex].value;
    if (selectedValue === "pick") {
      setShowCalender(true);
    } else setShowCalender(false);
  }
  function calendar2() {
    var expiration = document.getElementById("expiration")
    var selectedValue = expiration.options[expiration.selectedIndex].value;
    if (selectedValue === "pick") {
      setShowCalender(true);
    } else setShowCalender(false);
  }

  function indexing(i) {
    setIndex(i);
  }
  return (
    <>
      <BodyContainer>
        <Calendarcontainer>
          <CalContent>
            <Cal show={showCalendar}>
              <Calendar id="calendar-edit" />
            </Cal>
          </CalContent>
        </Calendarcontainer>
      </BodyContainer>
      <Header heading="" click="Create" click2="User" value="1" />
      <Container>
        <Section>
          <h1>Create your own NFT</h1>
        </Section>
        <Upload>
          <span id="upload">Upload file</span>
        </Upload>
        <Preview>
          <input type="file" id="file" onChange={onFileChange} />
          <label htmlFor="file">Upload a file</label>
        </Preview>
        <PutOn>
          <span id="putOn">Put on marketplace</span>
          <p>Enter price to allow users to instantly purchase your NFT</p>
        </PutOn>
        <Content>
          <Wrap onClick={() => indexing(0)} border={index === 0}>
            <img src="./images/fixed.svg" alt="" />
            <span>Fixed Price</span>
          </Wrap>
          <Wrap onClick={() => indexing(1)} border={index === 1}>
            <img id="open" src="./images/open.svg" alt="" />
            <span>Open for bids</span>
          </Wrap>
          <Wrap onClick={() => indexing(2)} border={index === 2}>
            <img src="./images/timed.svg" alt="" />
            <span>Time Auction</span>
          </Wrap>
        </Content>
        <Fixed id="fixed" show={index === 0}>
          <Price>
            <span>Price</span>
            <input type="number" id="number" placeholder="Enter price for one piece"
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}></input>
          </Price>
        </Fixed>
        <Opened id="fixed" show={index === 1}>
          <Price>
            <span>Minimum Price</span>
            <input type="number" id="number" placeholder="Enter minimum price" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}></input>
          </Price>
        </Opened>
        <Time id="fixed" show={index === 2}>
          <Price>
            <span>Minimum Bid</span>
            <input type="number" id="number" placeholder="Enter minimum bid" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}></input>
            <span id="service">Bids below this amount won't be allowed</span>
          </Price>
          <Date>
            <Starting>
              <span>Starting Date</span>
              <div>
                <select id="starting" onChange={() => calendar()} >
                  <option value="Right" >Right after listing</option>
                  <option value="pick" id="calendar">Pick specific date</option>
                </select>
              </div>
            </Starting>
            <Expiration>
              <span>Expiration Date</span>
              <div>
                <select id="expiration" onChange={() => calendar2()}>
                  <option value="1 day" >1 day</option>
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="pick" id="calendar">Pick specific date</option>
                </select>
              </div>
            </Expiration>
          </Date>
        </Time>
        <Details id="fixed" show={index === 2}>
          <span>Royalty</span>
          <input type="text" id="text" placeholder='e. g. "Must be Greater than 5%' onChange={e => updateFormInput({ ...formInput, royalty: e.target.value })}></input>

          <span>Name</span>
          <input type="text" id="text" placeholder='e. g. "Redeemable T-shirt with Logo' onChange={e => updateFormInput({ ...formInput, name: e.target.value })}></input>
          <span id="describe">Description</span>
          <input type="text" id="text" placeholder='e. g. "After purchasing you will be able to get the real T-shirt ' onChange={e => updateFormInput({ ...formInput, description: e.target.value })}></input>
          <span id="service">With preserved line-breaks</span>
        </Details>
        <Button>
          <button onClick={createCertificate} >Create Item</button>
        </Button>
      </Container>

    </>
  );
};
export default Create;

const BodyContainer = styled.div`
  display: flex;
  position:relative;
  align-items: center;
  justify-content: center;
  background-blend-mode:overlay;
  `
const Calendarcontainer = styled.div`
  position: absolute;
  
  `
const CalContent = styled.div`
  margin-top: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  `
const Container = styled.div`
  scroll-behavior: smooth;
  position:relative;
  margin-top: 60px;
  margin-left: 25vw;
  margin-right: 25vw;
  margin-bottom: 30px;
  justify-content: center;
`;
const Section = styled.div`
  padding: 15px;
  align-items: center;
  display: flex;
  flex-direction: column;
  letter-spacing: 2px;
  color: #ff9900;
  font-weight: bolder;
`;
const Upload = styled.div`
  font-weight: bolder;
  align-items: center;
  padding-bottom: 20px;
  `;
const Preview = styled.div`
background-color: #f0c78f;
opacity:0.5;
  border: 2px solid grey;
  border-radius: 10px;
  border-style: dashed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  input {
    padding-top: 10vh;
    padding-bottom: 10vh;
    overflow: hidden;
    height: 0.1px;
    width: 0.1px;
    opacity: 0;
  }
  label {
    border: 1px solid orange;
    background-color: #e68a00;
    border-radius: 20px;
    padding: 5px 10px;
    opacity: 0.8;
    color: black;
    &:hover {
      border-color: transparent;
      background-color: #e68a00;
      transform: scale(1.05);
      opacity: 1;
    }
  }
`;
const PutOn = styled.div`
  font-weight: bolder;
  padding-top: 20px;
  align-items: center;
  p {
    font-weight: lighter;
    font-size: small;
  }
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: 25px;
  /* gap: 25px; */
  margin: 0 24vw;
  width:auto;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Wrap = styled.div`
  background-color: black;
  padding: 2vh 2vw;
  border-radius: 10px;
  display: flex;
  flex-direction:row;
  margin-bottom: 20px;
  cursor: pointer;
  height: 10vh;
  width:10vw;
  opacity:${(props) => (props.border ? "1" : "0.8")};
  align-items: center;
  justify-content: center;
  border: 3px solid black;
  border-color: ${(props) => (props.border ? "#ff9900" : "black")};
  position: relative;
  img {
    image-resolution: calc(30px 30px);
    inset: 0px;
    display: block;
    object-fit: cover;
    opacity: 1;
    position: relative;
    width: 100%;
    z-index: 1;
    top: 0;
  }
  &:hover {
    border-color: #ff9900;
    opacity:1;
  }
  span {
    color: white;
    line-height: 1.4;
    letter-spacing: 2px;
    font-size: 13px;
    font-weight: bold;
  }
`;
const Fixed = styled.div`
  position: relative;
  width: 48vw;
  background-color: antiquewhite;
  opacity: 0.85;
  padding: 15px;
  vertical-align: inherit;
  border-radius: 10px;
  transition: transform;
  display: ${(props) => (props.show ? "block" : "none")};
  `;
const Opened = styled(Fixed)``;
const Time = styled(Fixed)``;

const Price = styled.div`
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  input {
    outline-style: none;
    padding: 10px;
    padding-left: 5px;
    background:transparent;
    border: none;
    border-bottom: 2px solid #737373;
  }
  #service {
    padding-top: 10px;
    font-weight: lighter;
    font-size: small;
  }
  #rate {
    font-weight: bold;
  }
  `;
const Details = styled(Price)`
    margin-top: 20px;
    #describe {
        padding-top:20px;
    }
`
const Button = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    margin: 10px 0px;
    padding: 5px 10px;
    button {
        background-color: #ff9900;
        border: none;
        opacity:0.75;
        padding: 10px 20px;
        font-weight: bolder;
        letter-spacing: 2px;
        border-radius: 20px;
        &:hover {
            border-color: transparent;
            background-color: #ff9900;
            transform: scale(1.05);
            opacity: 1;
        }
    }
`
const Date = styled(Price)`
    display: flex;
    flex-direction: row;
    padding-top:10px;
    `

const Starting = styled.div`
    width:25vw;
    span {
        font-weight: bolder;
    }
    div {
        padding:10px;
    }

    #starting {
        padding: 10px;
        padding-left:0px;
        border-style:none;
        background-color: antiquewhite;
        border-bottom: 2px solid #737373;
        outline-style:none;
        width:21vw;
    }
    option {
        background-color: blue;
    }
`
const Expiration = styled(Starting)`
  #expiration {
        padding: 10px;
        padding-left:0px;
        border-style:none;
        background-color: antiquewhite;
        border-bottom: 2px solid #737373;
        outline-style:none;
        width:21vw;
    }
`
const Cal = styled.div`
    z-index:10;
    position:fixed;
    display: ${(props) => (props.show ? "flex" : "none")};
    .react-calendar {
      background-color: antiquewhite;
      border-radius: 10px;
      opacity:0.8;
      padding:20px;
      border: 5px solid #ff9900;
      box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0/73%) 0px 16px 10px -10px;
      &:hover {
        background-color: antiquewhite;
        opacity: 0.8;
        transform:scale(1.05);
      }
    }
    button {
      font-weight: bolder;
    }
`