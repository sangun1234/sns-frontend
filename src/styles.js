import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  fontColor: "#2c2c2c",
  bgColor: "lightGray",
};

export const darkTheme = {
  fontColor: "lightGray",
  bgColor: "#2c2c2c",
};

/* 
    지금까지 배운거는 클래스 하나에만 적용되는 다크모드였다.
    이제는 전체 !! 요소에 다크모드를 적용할 수 있는 글로벌모드를
    배워보고자 한다.

    createGlobalStyle를 활용한다.

    createGlobalStyle을 사용할 때, css만 달랑 써놓으면 안된다.
    body 안에 들어가는 걸로 직접 써야된다.

    이런식으로 prop을 가져올 수 있는 것이다 
*/
export const GlobalStyles = createGlobalStyle`
    ${reset}
    body {
        background-color: ${(props) => props.theme.bgColor};
    }
`;
