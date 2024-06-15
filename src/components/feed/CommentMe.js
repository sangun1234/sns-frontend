import styled from "styled-components";
import { FatText } from "../shared";

const CommentContainer = styled.div`
  margin-bottom: 10px;
`;

const Caption = styled(FatText)`
  padding: 15px;
  margin-bottom: 10px;
  align-items: center;
`;
function CommentMe({ caption }) {
  return (
    <CommentContainer>
      <Caption>{caption}</Caption>
    </CommentContainer>
  );
}

export default CommentMe;
