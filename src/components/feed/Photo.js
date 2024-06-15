//TypeScript를 사용하지 않는 이상 prototypes는 항상 사용해야한다.
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import Avatar from "../Avatar";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";
import CommentMe from "./CommentMe";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

//mutation
const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  border: 1px solid black;
  margin: 0 auto 20px auto;
  border-radius: 10px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
`;

const PhotoFile = styled.img`
  width: 100%;
  max-height: 500px;
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 10px;
  display: block;
`;

function Photo({
  id,
  user,
  caption,
  file,
  isLiked,
  likesNumber,
  totalComments,
  comments,
}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      //만약 props (isLiked, likesNumber) 이 존재하지 않는다면 , readFragment를 사용하면 된다.
      //fragment를 write한다는건, 캐시에서 원하는 특정 오브젝트의 일부분을 수정하는 것.
      cache.writeFragment({
        id: `Photo:${id}`,
        //일부분 : fragment
        fragment: gql`
          fragment BSName on Photo {
            isLiked
            likesNumber
          }
        `,
        data: {
          isLiked: !isLiked,
          likesNumber: isLiked ? likesNumber - 1 : likesNumber + 1,
        },
      });
    }
  };
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user.userName}`}>
          <Avatar lg url={user.avatar} />
        </Link>
        <Link to={`/users/${user.userName}`}>
          <Username>{user.userName}</Username>
        </Link>
      </PhotoHeader>
      <CommentMe caption={caption} />
      {/*
        와 null이 들어와도 string으로 들어오게 설정해놔서
        "null"이라고 문자열로 인식해야지 된다. 이걸 이제 알았네
      */}
      {file !== "null" && <PhotoFile src={file} />}
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                size="lg"
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size="lg" icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon size="lg" icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon size="lg" icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likesNumber === 1 ? "1 likes" : `${likesNumber} likes`}</Likes>
        <Comments
          photoId={id}
          totalComments={totalComments}
          comments={comments}
        />
      </PhotoData>
    </PhotoContainer>
  );
}

//타입을 정의 . Photo.propTypes 프로토타입스할때 앞의 p가 소문자로 정의되어야 한다.
Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string,
  isLiked: PropTypes.bool.isRequired,
  likesNumber: PropTypes.number.isRequired,
  totalComments: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        userName: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      CreateAt: PropTypes.string.isRequired,
    })
  ),
};

export default Photo;
