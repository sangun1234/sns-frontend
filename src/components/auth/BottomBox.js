import styled from "styled-components";
import { BaseBox } from "../shared";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

//WhiteBox를 Extend(상속) 시키는 것 . ( 복사 )
const SBottomBox = styled(BaseBox)`
  padding: 10px 0px;
  //상하 여백 10px, 좌우 여백 0px
  text-align: center;
  padding: 35px 50px 35px 40px;
  a {
    margin-left: 5px;
    font-weight: 600;
    color: ${(props) => props.theme.accent};
  }
`;

function BottomBox({ cta, link, linkTest }) {
  return (
    <SBottomBox>
      <span>{cta}</span>
      <Link to={link}>{linkTest}</Link>
    </SBottomBox>
  );
}

export default BottomBox;
