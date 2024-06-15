import styled from "styled-components";
import Room, { SEND_MESSAGE_MUTATION } from "./Room";
import Rooms from "./Rooms";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  VoiceCallButton,
  TypingIndicator,
  MessageSeparator,
  VideoCallButton,
  EllipsisButton,
} from "@chatscope/chat-ui-kit-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../fragment";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { faLocation, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SEE_FOLLOWING = gql`
  query seeFollowing($userName: String!) {
    seeFollowing(userName: $userName) {
      ok
      following {
        userName
        id
        avatar
      }
    }
  }
`;

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
      messages {
        id
        payload
        user {
          id
          userName
          avatar
        }
      }
    }
  }
  ${ROOM_FRAGMENT}
`;

const AddUser = styled.div`
  float: left;
  padding: 15px;
`;

function Messages() {
  const { data: myData } = useUser();
  const { data: followerData } = useQuery(SEE_FOLLOWING, {
    variables: {
      userName: myData?.me?.userName,
    },
  });
  const [id, setId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const changeId = (data) => {
    setId(data);
  };
  const { data, loading, error } = useQuery(SEE_ROOMS_QUERY);
  const { data: userData } = useUser();
  const myUserName = userData?.me?.userName;

  const [createRoom] = useMutation(SEND_MESSAGE_MUTATION);
  let otherUser = null;
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <MainContainer
      responsive
      style={{
        height: "600px",
      }}
    >
      {showPopup && (
        <Sidebar position="left">
          <ConversationList>
            {followerData?.seeFollowing?.following.map((follower) => {
              return (
                <Conversation
                  onClick={() => {
                    createRoom({
                      variables: {
                        payload: "대화를 보냈습니다 !!",
                        userId: follower.id,
                      },
                      refetchQueries: [{ query: SEE_ROOMS_QUERY }],
                    });
                    setShowPopup(!showPopup);
                  }}
                  key={follower.id} // 키 추가
                  name={follower?.userName || "Unknown User"}
                >
                  <Avatar
                    name={follower?.userName || "Unknown User"} // 상대방의 이름
                    src={
                      follower?.avatar ||
                      "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                    } // 상대방의 아바타, 없으면 기본 이미지
                    status="available"
                  />
                </Conversation>
              );
            })}
          </ConversationList>
        </Sidebar>
      )}
      <Sidebar position="left">
        <Search placeholder="Search..." />
        <AddUser>
          <FontAwesomeIcon icon={faPlus} size="2x" onClick={togglePopup} />
        </AddUser>

        <ConversationList>
          {data?.seeRooms?.map((room) => {
            otherUser = room.users.find((user) => user.userName !== myUserName);
            const lastMessage = room.messages?.[room.messages.length - 1];
            return (
              <Conversation
                onClick={() => changeId(room.id)}
                key={room.id} // 키 추가
                info={lastMessage?.payload} // lastMessage가 존재하는지 확인
                lastSenderName={lastMessage?.user?.userName || "No message"} // lastMessage와 user가 존재하는지 확인
                name={otherUser?.userName || "Unknown User"} // otherUser의 userName, 없으면 "Unknown User"
              >
                <Avatar
                  name={otherUser?.userName || "Unknown User"} // 상대방의 이름
                  src={
                    otherUser?.avatar ||
                    "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                  } // 상대방의 아바타, 없으면 기본 이미지
                  status="available"
                />
              </Conversation>
            );
          })}
        </ConversationList>
      </Sidebar>

      {id && <Room id={id} otherUser={otherUser} />}
    </MainContainer>
  );
}

export default Messages;
