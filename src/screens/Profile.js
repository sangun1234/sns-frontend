import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  Link,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { PHOTO_FRAGMENT } from "../fragment";
import styled from "styled-components";
import { FatText } from "../components/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/auth/Button";
import useUser from "../hooks/useUser";
import SeeUserFeed from "../components/feed/seeUserFeed";
import { useState } from "react";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userName: String!) {
    followUser(userName: $userName) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userName: String!) {
    UnfollowUser(userName: $userName) {
      ok
    }
  }
`;

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($userName: String) {
    seeProfile(userName: $userName) {
      id
      userName
      totalFollowing
      totalFollowers
      photos {
        ...PhotoFragment
      }
      lastName
      isMe
      isFollowing
      firstName
      bio
      avatar
      email
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Header = styled.div`
  display: flex; //옆으로
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;
const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;
const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
  border: 1px solid black;
`;
const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;
const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;
const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  cursor: pointer;
`;

const Container = styled.div``;

function Profile() {
  // path의 이름을 받아올 수 있다. 여러가지
  //const location = useLocation();
  //파라미터 가져오기 (username)
  const { userName } = useParams();

  const [id, setId] = useState(0);
  const [modal, setModal] = useState(false);
  const { data: userData } = useUser();
  const client = useApolloClient();
  const history = useHistory();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      userName,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        UnfollowUser: { ok },
      },
    } = result;

    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    const { me } = userData;
    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [UnfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    //수동적으로 고쳐야 할 때
    update: unfollowUserUpdate,
  });
  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    const { me } = userData;
    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    //쿼리가 잘 실행되었을때 ~
    onCompleted: followUserCompleted,
  });
  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return (
        <ProfileBtn
          onClick={() => {
            history.push({
              pathname: `/users/${userData?.me?.userName}/edit`,
              state: {
                userName: data?.seeProfile?.userName,
                firstName: data?.seeProfile?.firstName,
                lastName: data?.seeProfile?.lastName,
                bio: data?.seeProfile?.bio,
                avatar: data?.seeProfile?.avatar,
                email: data?.seeProfile?.email,
              },
            });
          }}
        >
          회원 수정
        </ProfileBtn>
      );
    }
    if (isFollowing) {
      return <ProfileBtn onClick={UnfollowUser}>언팔로우</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUser}>팔로우</ProfileBtn>;
    }
  };

  const closeModal = () => setModal(false);
  return (
    <Container>
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.userName}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => {
          return photo.file !== "null" ? (
            <Photo
              key={photo.id}
              bg={photo.file}
              onClick={() => {
                setId(photo.id);
                setModal(true);
              }}
            >
              <Icons>
                <Icon>
                  <FontAwesomeIcon icon={faHeart} />
                  {photo.likesNumber}
                </Icon>
                <Icon>
                  <FontAwesomeIcon icon={faComment} />
                  {photo.totalComments}
                </Icon>
              </Icons>
            </Photo>
          ) : (
            <Photo
              key={photo.id}
              bg="/img/nofile.png"
              onClick={() => {
                setId(photo.id);
                setModal(true);
              }}
            >
              <Icons>
                <Icon>
                  <FontAwesomeIcon icon={faHeart} />
                  {photo.likesNumber}
                </Icon>
                <Icon>
                  <FontAwesomeIcon icon={faComment} />
                  {photo.totalComments}
                </Icon>
              </Icons>
            </Photo>
          );
        })}
      </Grid>
      {modal === true ? <SeeUserFeed id={id} closeModal={closeModal} /> : null}
    </Container>
  );
}

export default Profile;
