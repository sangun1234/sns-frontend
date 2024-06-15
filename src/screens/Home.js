import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import { Helmet } from "react-helmet-async";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logUserOut } from "../apollo";
import styled from "styled-components";

export const FEED_QUERY = gql`
  query SeeFeed {
    seeFeed {
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

const LogoutContainer = styled.div`
  float: right;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: 3px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
`;
function Home() {
  const { data } = useQuery(FEED_QUERY);
  const history = useHistory();
  console.log(data?.seeFeed);
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <LogoutContainer>
        <Button onClick={() => logUserOut(history)}>로그아웃</Button>
      </LogoutContainer>
      {data?.seeFeed?.map((photo) => (
        <Photo
          key={photo.id}
          id={photo.id}
          user={photo.user}
          caption={photo.caption}
          file={photo.file || null} //포토파일이 null이면 null전달
          isLiked={photo.isLiked}
          likesNumber={photo.likesNumber}
          totalComments={photo.totalComments}
          comments={photo.comments}
          //만약 포토의 모든 프로퍼티가 같다면, {...photo}로 보낼 수 있다.
        />
      ))}
    </div>
  );
}

export default Home;
