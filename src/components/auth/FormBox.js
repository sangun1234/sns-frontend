import styled from "styled-components";
import { BaseBox } from "../shared";

const Container = styled(BaseBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //이런식으로 TopBox안에 들어있는 form태그의 스타일을 이렇게 조율할 수 있다.
  padding: 35px 50px 25px 40px;
  //시계방향 : 위 -> 오른쪽 -> 아래 -> 왼쪽 순 패딩
  margin-bottom: 10px;
  form {
    margin-top: ${(props) => props.marginTop ?? "35px"};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /*
      버튼 컴포넌트를 만들었는데, input스타일과 겹쳐서
      제대로 안나오기 때문에 input 컴포넌트도 하나 만들어준다.
    */
    //last-child를 쓰는건 나중에 향후 추가될 가능성이 있기때문에 좋진않음. 따로 컴포넌트 하나를 만들겠음.
  }
`;

function FormBox({ children, marginTop }) {
  return <Container marginTop={marginTop}>{children}</Container>;
}

export default FormBox;
