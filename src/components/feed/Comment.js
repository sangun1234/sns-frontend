import styled from "styled-components";
import { FatText } from "../shared";
import sanitizeHtml from "sanitize-html";
import { gql, useMutation } from "@apollo/client";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  mark {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DeleteButton = styled.span`
  float: right;
  cursor: pointer;
`;

//현재 해시태그가 제대로 나오고 있지 않음. 일단 패스
function Comment({ author, payload, id, isMine, photoId }) {
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      //캐시에서 삭제
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          totalComments(prev) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  const replacedPayload = payload.replace(/#[\w]+/g, "<mark>$&</mark>");
  const cleanedPayload = sanitizeHtml(replacedPayload, {
    allowedTags: ["mark"],
    allowedAttributes: {},
  });
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      {/* dangerouslySEtInnerHTML : 텍스트가 아니라 html로 해석될 수 있도록 해주는 것. */}
      <CommentCaption
        dangerouslySetInnerHTML={{
          __html: cleanedPayload,
        }}
      />
      {isMine ? (
        <DeleteButton>
          <FontAwesomeIcon
            icon={faMinus}
            beat
            size="xl"
            style={{ color: "#ef0b0b", paddingBottom: 2 }}
            onClick={onDeleteClick}
          />
        </DeleteButton>
      ) : null}
    </CommentContainer>
  );
}

export default Comment;
