import styled from "styled-components";

const SAvatar = styled.div`
  width: ${(props) => (props.lg ? "35px" : "32px")};
  height: ${(props) => (props.lg ? "35px" : "32px")};
  border-radius: 50%; // 원
  background-color: #2c2c2c;
  overflow: hidden; //넘는거 안보이게
`;

const Img = styled.img`
  max-width: 100%;
`;

function Avatar({ url = "", lg = false }) {
  return <SAvatar lg={lg}>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
}

export default Avatar;
