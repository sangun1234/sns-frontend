import styled, { css } from "styled-components";
import { isLoggedInVar } from "../apollo";
import { useState } from "react";

/* 
  styled-component는 요물이다.
  이놈들은 컴포넌트이기에 "props"를 받는다 .. 
  prop을 사용하는 방식은 두가지
  값을 prop에 따라 설정해주거나,

  prop을 가지고 애초에새로운css를 만들거나 .
*/
const Title = styled.h1`
  //사용방식 1번째
  color: ${(props) => (props.potato ? "palevioletred" : "beige")};
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  //사용방식 2번째
  ${(props) =>
    props.potato
      ? css`
          font-size: 49px;
        `
      : css`
          text-decoration: underline;
        `}
`;

const Container = styled.div`
  background-color: tomato;
`;

const TogglePotato = styled.button`
  color: red;
`;

const Login = () => {
  const [potato, setPotato] = useState(false);
  const togglePotato = () => setPotato((current) => !current);
  // 토글 포테이토를 호출하면 set포테이토의 값을 반대로 전환
  return (
    <Container>
      <Title potato={potato}>Login</Title>
      <TogglePotato onClick={togglePotato}>togglePotato</TogglePotato>
    </Container>
  );
};
export default Login;
