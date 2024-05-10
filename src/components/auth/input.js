import styled from "styled-components";

const SInput = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  border: 0.5px solid ${(props) => props.theme.borderColor};
  margin-top: 5px;
  // 내가 원한 크기로 딱 맞게 설정해주는거 !!
  box-sizing: border-box;

  //여기서 &란 나의 부모 (여기서는 input)의 placeholder값 !!
  &::placeholder {
    font-size: 12px;
    font-weight: 600;
  }
`;

function input(props) {
  return <SInput {...props} />;
}

export default input;
