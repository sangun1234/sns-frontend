import styled from "styled-components";

const SSeparator = styled.div`
  margin: ${(props) => props.margin ?? "20px 0px 30px 0px"};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  div {
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.borderColor};
  }
  span {
    margin: 0px 10px;
    font-weight: 600;
    color: #8e8e8e;
  }
`;
function Seperator({ margin }) {
  return (
    <SSeparator margin={margin}>
      <div></div>
      <span>Or</span>
      <div></div>
    </SSeparator>
  );
}

export default Seperator;
