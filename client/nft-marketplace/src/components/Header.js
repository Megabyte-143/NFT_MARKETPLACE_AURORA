import styled from "styled-components";
import React from "react";
import { Link } from 'react-router-dom';

let val = "All"
const Header = (props) => {
  return (
    <Title>
      <a href="/">
        <img src="/images/nft-logo.png" alt="logo"></img>
      </a>
      <Create>
        <Link to="/create" id="create">{props.click}</Link>
        <Link to='/user' id="user">{props.click2}</Link>
      </Create>
    </Title>
  );

};

var MyObject = {
  value: { val }
}
export { MyObject };

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
