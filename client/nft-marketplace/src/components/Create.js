import Header from "./Header";
import styled from "styled-components";
import React from "react";
import { useState } from "react";
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
  const [fileUrl, setFileUrl] = useState(null);
  const [fileImg, setFileImg] = useState();
  const [formInput, updateFormInput] = useState({ name: '', description: '', price: '', seller_name: '', seller_phn_num: '', pro_add: '', pro_size: '', pro_type: '', pro_desc: '' });

  async function onFileChange(e) {
    //selecting the first file, which is uploaded
    const file = e.target.files[0];
    try {
      setFileImg(URL.createObjectURL(e.target.files[0]));

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
    const { name, description, price, seller_name, seller_phn_num, pro_add, pro_desc, pro_size, pro_type } = formInput;

    //If any of them is not present then it will not create the Item
    if (!name || !description || !fileUrl || !price || !seller_name || !seller_phn_num || !pro_add || !pro_desc || !pro_size || !pro_type) return;

    const data = JSON.stringify({
      name, description, image: fileUrl, price, seller_name, seller_phn_num, pro_add, pro_desc, pro_size, pro_type
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

    let { price } = formInput;

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
    console.log(contract)
    //fetching listing price from the contract
    let listingPrice = await contract.getListingPrice();
    // listingPrice = listingPrice.toString();
    console.log(listingPrice)
    // listingPrice = convert(listingPrice, 'ether', 'wei');
    // console.log(listingPrice)
    // const priceC = ethers.utils.parseUnits(price.toString(), 'ether');

    //listing the certificate. 
    transaction = await contract.createMarketItem(
      nftAddress,
      tokenId,
      ethers.utils.parseEther(price),
      { value: listingPrice }
    );
    //waiting for the transaction to complete
    await transaction.wait();
    console.log("completed")

    //navigate back to home page
    
  }

  return (
    <>
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
          <img id='FileImg' src={fileImg} />
          <label htmlFor="file">Upload a file</label>
        </Preview>
        <PutOn>
          <span id="putOn">Put on marketplace</span>
          <p>Enter price to allow users to instantly purchase your NFT</p>
        </PutOn>
        <Price>
          <span>Price</span>
          <input
            type="number"
            id="number"
            placeholder="Enter price for one piece"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          ></input>
        </Price>
        <Details id="fixed" show={index === 2}>
          <span>Name</span>
          <input
            type="text"
            id="text"
            placeholder='e. g. "Redeemable T-shirt with Logo'
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          ></input>
          <span id="describe">Description</span>
          <input
            type="text"
            id="text"
            placeholder='e. g. "After purchasing you will be able to get the real T-shirt '
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          ></input>
          <span id="service">With preserved line-breaks</span>
          <span id="seller">Seller Details</span>
          <Seller>
            <span>
              Name :
              <input
                type="text"
                id="text"
                onChange={(e) =>
                  updateFormInput({ ...formInput, seller_name: e.target.value })
                }
              ></input>
            </span>
            <span>
              Contact No. :
              <input
                type="number"
                id="number"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    seller_phn_num: e.target.value,
                  })
                }
              ></input>
            </span>
          </Seller>
          <span id="seller">Real-Estate Details</span>
          <span id='address'>
            Address :
          </span>
          <input
            type="text"
            id="text"
            onChange={(e) =>
              updateFormInput({ ...formInput, pro_add: e.target.value })
            }
          ></input>
          <Seller>
            <span>
              Size :
              <input
                type="number"
                id="number"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    pro_size: e.target.value,
                  })
                }
              ></input>
            </span>
            <span>
              Type :
              <input
                type="text"
                id="text"
                onChange={(e) =>
                  updateFormInput({ ...formInput, pro_type: e.target.value })
                }
              ></input>
            </span>
          </Seller>
          <span id='description'>
            Description :
          </span>
          <input
            type="text"
            id="text"
            onChange={(e) =>
              updateFormInput({
                ...formInput,
                pro_desc: e.target.value,
              })
            }
          ></input>
        </Details>
        <Button>
          <button onClick={createCertificate}>Create Item</button>
        </Button>
      </Container>
    </>
  );
};
export default Create;


const Container = styled.div`
  scroll-behavior: smooth;
  color:white;
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
  background-color: rgb(229, 229, 229, 0.2);
  border: 2px solid grey;
  border-radius: 10px;
  padding:20px;
  border-style: dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    max-height: 50vh;
    justify-content: center;
    display: flex;
    border-radius: 5px;
  }
  input {
    overflow: hidden;
    height: 0.1px;
    width: 0.1px;
    opacity: 0;
  }
  label {
    border: 1px solid white;
    margin: 20px;
    background-color: #e5e5e5;
    border-radius: 20px;
    padding: 5px 10px;
    opacity: 0.5;
    color: black;
    &:hover {
      border-color: transparent;
      background-color: white;
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


const Price = styled.div`
  font-weight: bolder;
  display: flex;
  flex-direction: column;
  input {
    outline-style: none;
    padding: 10px;
    padding-left: 5px;
    background:transparent;
    color:white;
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
    #seller {
      margin-top: 20px;
      margin-bottom: 5px;
      font-size: 20px;
    }
    #address,#description {
      padding-top: 10px;
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
const Seller = styled.div`
  display: flex;
  align-items: center;
  span {
    width: 100%;
    padding:10px 0px;
    overflow: hidden;
  }
  input {
    width:60%;
  }

`
