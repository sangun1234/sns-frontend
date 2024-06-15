import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

//로그인.js에서 우리가 계속 사용해야 할 것들을
//theme에 넣어서 계속 사용할 수 있게 한다.
export const lightTheme = {
  fontColor: "#2c2c2c",
  bgColor: "white",
  //뭐를 제일 많이 썼었지 ? 싶은것들을 집어 넣으면된다.
  accent: "#0095f6",
  borderColor: "#000000",
};
//rgb(219, 219, 219)
export const darkTheme = {
  fontColor: "lightGray",
  bgColor: "#2c2c2c",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      //input타입의 브라우저의 모든 기본세팅을 없애는 것.
      all:unset;
    }
    *{
      box-sizing: border-box;
    }
    body {
        background-color: ${(props) => props.theme.bgColor};
        color:rgb(38,38,38);
    }
    a {
      text-decoration: none;
      color: inherit;
    }
`;
