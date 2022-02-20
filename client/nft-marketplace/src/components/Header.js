import styled from "styled-components";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom';

let val = "All"
const Header = (props) => {
  const [burgerStatus, setBurgerStatus] = useState(false); 
  return (
    <Title>
      <a href="/">
        <img src="/images/nft-logo.png" alt="logo"></img>
      </a>
      <Create>
        <span id="display" onClick={() => setBurgerStatus(true)} >{props.heading}</span>
        <Link to="/create" id="create">{props.click}</Link>
        <Link to='/user' id="user">{props.click2}</Link>
        <CustomMenu onClick={() => setBurgerStatus(true)} />
      </Create>
      <BurgerNav show={burgerStatus}>
          <CustomWrap>
            <CustomClose onClick={()=> setBurgerStatus(false)}/>
          </CustomWrap>      
        <li><Link to="/direct"><span id="direct" >Fixed Price</span></Link></li>
        <li><Link to="/timed"><span id="timed" >Timed Auction</span></Link></li>
        <li><Link to="/unlim"><span id="unlim" >Unlimited Auction</span></Link></li>
        <li><Link to="/create"><span id="create" >Create NFT</span></Link></li>
      </BurgerNav>
    </Title>
  );
 
};

var MyObject ={
  value: {val}
}
export {MyObject} ;

export default Header;
const Title = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
  position: fixed;
  background-color: antiquewhite;
  justify-content: space-between;
  padding: 0 10px;
  box-shadow: rgb(0 0 0 / 25%) 0px 26px 30px -10px, rgb(0 0 0/40%) 0px 16px 10px -10px ;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  img {
    width: 110px;
    height: 25px;
    padding-right: 30px;
  }
`;

const Create = styled.div`
  display: flex;
  align-items: center;
  a {
    margin-left: 5px;
    color: black;
    letter-spacing: 2px;
    margin-right: 5px;
    padding: 5px 10px;
    :hover {
      background-color: #cdd1d4;
      opacity: 0.5;
      color: black;
      border-radius: 10px;
    }
    .create {
      visibility: ${(props) => (props.value === "1" ? "hidden" : "visible")};
    }
    .user {
      visibility: ${(props) => (props.value === "2" ? "hidden" : "visible")};
    }
  }
  span {
    padding:10px;
    letter-spacing: 2px;
    font-weight: bolder;
    cursor: pointer;
  }
`;

const CustomMenu = styled(MenuIcon)`
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  padding: 5px 10px;
  :hover {
    background-color: #cdd1d4;
    opacity: 0.5;
    color: black;
    border-radius: 10px;
  }
`;
const BurgerNav = styled.div`
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    background-color: white;
    opacity:0.85;
    width:250px;
    z-index: 100;
    scroll-behavior: smooth;
    list-style: none;
    padding:20px;
    display:flex;
    flex-direction: column;
    text-align:start;
    box-shadow: rgb(0 0 0 / 25%) 0px 26px 30px -10px, rgb(0 0 0/40%) 0px 16px 10px -10px ;
    overflow: auto;
    white-space: nowrap;
    transition: transform 0.2s ease-in;
    transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
    li {
        padding:5px 10px;
        margin-left:10px;
        margin-top:5px;
        margin-bottom:5px;
        a{
            font-weight:600;
            font-size:15px;
            font-weight: bolder;

        }
        :hover {
            background-color: whitesmoke;
            color: black;
            font-weight: bolder;
            border-radius: 10px;
        }
    }
`;
const CustomClose = styled(CloseIcon)`
    display: block;
    :hover {
        background-color: whitesmoke;
        border-radius: 100px;
    }
    padding:1px;
    cursor: pointer;
`
const CustomWrap = styled.div`
    display:flex;
    justify-content: flex-end;
`