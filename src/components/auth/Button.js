import styled from "styled-components";

const Button = styled.input`
  width: 100%;
  border: none;
  border-radius: 3px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  font-weight: 600;
`;

export default Button;
