import styled, { css } from "styled-components";
import { darkModeVar, isLoggedInVar } from "../apollo";
import { useState } from "react";

/* 
  styled-component의 살짝 심화 ? 

  ThemeProvider을사용하여 다크모드를 설정하는 방법을 배웠다.
  
  app.js에서 정의한 fontColor, bgColor을 props로 그대로 동원함.
*/
const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div``;

const Login = () => {
  return (
    <Container>
      <Title>Login</Title>
      <button onClick={() => darkModeVar(true)}>to Dark</button>
      <button onClick={() => darkModeVar(false)}>to light</button>
    </Container>
  );
};

export default Login;
