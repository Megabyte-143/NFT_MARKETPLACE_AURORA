import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import Fade from 'react-reveal/Fade'

const All = (props) => {
    return (
      <>
        <Header heading="" click="Create" click2="User"/> 
        <Container>
            <Content>
            <Fade bottom>
                <h1>Discover, Collect and sell extraordinary NFTs</h1>
                <Button>
                  <Explore>
                    <a href="/direct">Explore</a>
                  </Explore>
                  <Create>
                    <a href="/create">Create</a>
                  </Create>
                </Button>
              </Fade>
            </Content>
        </Container>
      </>
    );
}

const Container = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  background-image: linear-gradient(#14321d,#023e8a,#03045e,black);
`;

const Content = styled.div`
    margin-bottom: 10vw;
    width: 100%;
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 80px 40px;
    height: 100%;
    h1 {
      color:white;
      letter-spacing: 3px;
      font-size:40px;
      max-width:50vw;
    }
`
const Button = styled.div`
    display:flex;
    flex-direction: row;
`
const Explore = styled.div`
  padding: 20px;
  font-size: 18px;
  width: 10vw;
  font-weight: bold;
  opacity: 0.5;
  a {
    background-color: antiquewhite;
    padding: 15px 40px;
    border-radius: 10px;
  }
  transition: 0.3s ease-in-out;
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
    transition: 0.3s ease-in-out;
  }
`;
const Create = styled(Explore)``

// const BgImage = styled.div`
//     background-position: top;
//     background-size: cover;
//     background-repeat: no-repeat;
//     height:100%;
//     background-image: url('/images/bgimage.jpeg');
//     top: 0;
//     left: 0;
//     right: 0;
//     z-index: -1;
//     position: absolute;
// `;

export default All
