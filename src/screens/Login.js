import styled, { css } from "styled-components";
import { darkModeVar, isLoggedInVar } from "../apollo";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  //이렇게 줬을 시 전체화면을 차지한다고 생각하면 됨 .
  justify-content: center;
  // flex-item 가로방향으로 센터로 정렬
  align-items: center;
  // flex-item 세로방향으로 센터로 정렬
  flex-direction: column;
  // flex-item이 세로방향으로 쌓이게 됨. 위->아래
`;
//styled-components를 사용하는 방법 !

const WhiteBox = styled.div`
  background-color: white;
  border: 1px solid rgb(219, 219, 219);
  border-radius: 5px;
  width: 100%;
`;

const TopBox = styled(WhiteBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //이런식으로 TopBox안에 들어있는 form태그의 스타일을 이렇게 조율할 수 있다.
  padding: 35px 50px 25px 40px;
  //시계방향 : 위 -> 오른쪽 -> 아래 -> 왼쪽 순 패딩
  margin-bottom: 10px;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    input {
      width: 100%;
      border-radius: 3px;
      padding: 7px;
      background-color: #fafafa;
      border: 0.5px solid rgb(219, 219, 219);
      margin-top: 5px;
      // 내가 원한 크기로 딱 맞게 설정해주는거 !!
      box-sizing: border-box;

      //여기서 &란 나의 부모 (여기서는 input)의 placeholder값 !!
      &::placeholder {
        font-size: 12px;
      }
      //마지막 친구 -> 마지막에 있는 버튼을 의미
      &:last-child {
        border: none;
        margin-top: 12px;
        background-color: #0095f6;
        color: white;
        text-align: center;
        padding: 8px 0px;

        font-weight: 600;
      }
    }
  }
`;
//WhiteBox를 Extend(상속) 시키는 것 . ( 복사 )

const ButtonBox = styled(WhiteBox)`
  padding: 10px 0px;
  //상하 여백 10px, 좌우 여백 0px
  text-align: center;
  padding: 35px 50px 35px 40px;
  a {
    font-weight: 600;
    color: #0095f6;
  }
`;
const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

const Separator = styled.div`
  margin: 20px 0px 30px 0px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  div {
    width: 100%;
    height: 1px;
    background-color: rgb(219, 219, 219);
  }
  span {
    margin: 0px 10px;
    font-weight: 600;
    color: #8e8e8e;
  }
`;

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
const Login = () => {
  return (
    <Container>
      <Wrapper>
        <TopBox>
          <div>
            <FontAwesomeIcon icon={faInstagram} size="3x" />
          </div>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="submit" placeholder="login" value="login" />
          </form>
          <Separator>
            <div></div>
            <span>Or</span>
            <div></div>
          </Separator>
          <FacebookLogin>
            <FontAwesomeIcon icon={faGoogle} style={{ color: "#74C0FC" }} />
            <span>Log in with Google</span>
          </FacebookLogin>
        </TopBox>
        <ButtonBox>
          <span>Don't have an account?</span> <a href="#">Sign up</a>
        </ButtonBox>
      </Wrapper>
    </Container>
  );
};

export default Login;
