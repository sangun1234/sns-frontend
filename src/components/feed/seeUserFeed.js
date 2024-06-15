import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../../fragment";
import Comments from "./Comments";
import {
  faHeart as SolidHeart,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import CommentMe from "./CommentMe";
import { FatText } from "../shared";
import Avatar from "../Avatar";
import { useState } from "react";
import { SEE_PROFILE_QUERY } from "../../screens/Profile";
import useUser from "../../hooks/useUser";
import EditPopupComponent from "./editPopup";

const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
    }
  }
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

export const SEE_PHOTO_QUERY = gql`
  query seePhoto($id: Int) {
    seePhoto(id: $id) {
      ...PhotoFragment
      user {
        userName
        avatar
      }
      caption

      createAt

      isMine

      comments {
        ...CommentFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const FeedContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
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
  max-height: 300px;
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

const UserFix = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 10px;
  top: 50px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

function SeeUserFeed({ id, closeModal }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const { data } = useQuery(SEE_PHOTO_QUERY, {
    variables: {
      id,
    },
  });

  const user = data?.seePhoto?.user;
  const caption = data?.seePhoto?.caption;
  const isLiked = data?.seePhoto?.isLiked;
  const likesNumber = data?.seePhoto?.likesNumber;
  const totalComments = data?.seePhoto?.totalComments;
  const file = data?.seePhoto?.file;
  const isMine = data?.seePhoto?.isMine;
  const { data: meData } = useUser();

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      cache.writeFragment({
        id: `Photo:${id}`,
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
  const [deletePhotoMutation] = useMutation(DELETE_PHOTO_MUTATION, {
    variables: {
      id,
    },
    refetchQueries: [
      {
        query: SEE_PROFILE_QUERY,
        variables: {
          userName: meData?.me?.userName,
        },
      },
    ],
  });
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleEdit = () => {
    setEditPopupVisible(!editPopupVisible);
    setDropdownVisible(false);
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("Delete clicked");
    setDropdownVisible(false);

    deletePhotoMutation();

    closeModal();
  };

  return (
    <FeedContainer>
      <UserFix>
        <button onClick={closeModal}>닫기</button>
        {isMine && (
          <>
            <FontAwesomeIcon icon={faList} onClick={toggleDropdown} />
            {dropdownVisible && (
              <DropdownMenu>
                <DropdownItem onClick={handleEdit}>수정하기</DropdownItem>
                <DropdownItem onClick={handleDelete}>삭제하기</DropdownItem>
              </DropdownMenu>
            )}
          </>
        )}
      </UserFix>

      {editPopupVisible && (
        <EditPopupComponent
          onConfirm={() => {
            // Handle edit confirmation logic
            // For example, send edit request to the server
            console.log("Edit confirmed");
            // Close edit popup
            setEditPopupVisible(false);
          }}
          caption={caption}
          id={id}
        />
      )}

      <PhotoHeader>
        <Link to={`/users/${user?.userName}`}>
          <Avatar lg url={user?.avatar} />
        </Link>
        <Link to={`/users/${user?.userName}`}>
          <Username>{user?.userName}</Username>
        </Link>
      </PhotoHeader>
      <CommentMe caption={caption} />
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
          comments={data?.seePhoto?.comments}
        />
      </PhotoData>
    </FeedContainer>
  );
}

export default SeeUserFeed;
