import { gql, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../fragment";
import styled from "styled-components";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from "react";
import useUser from "../hooks/useUser";

// const SEE_ROOMS_QUERY = gql`
//   query seeRooms {
//     seeRooms {
//       ...RoomParts
//       messages {
//         id
//         payload
//         user {
//           userName
//         }
//       }
//     }
//   }
//   ${ROOM_FRAGMENT}
// `;

// const getMessageComponent = (data) => {
//   return data.map((item, index) => {
//     const isIncoming = item.user.userName !== userData?.me?.userName;
//     const avatar = isIncoming
//       ? otherUserAvatars.find((avatar) => avatar)
//       : null;

//     return (
//       <Message
//         key={index}
//         model={{
//           message: item.payload,
//           direction: isIncoming ? "incoming" : "outgoing",
//         }}
//       >
//         {avatar ? <Avatar src={avatar} name={item.user.userName} /> : null}
//       </Message>
//     );
//   });
// };

export default function Rooms() {
  // const { data, loading, error } = useQuery(SEE_ROOMS_QUERY);
  // const { data: userData } = useUser();
  // const [messages, setMessages] = useState([]);
  // const { me } = userData;

  // console.log(me.userName);
  // useEffect(() => {
  //   if (!loading && data) {
  //     const currentUser = userData?.me?.userName;
  //     const otherUserAvatars = data?.seeRooms.flatMap((room) =>
  //       room.users
  //         .filter((user) => user.userName !== currentUser)
  //         .map((user) => user.avatar)
  //     );
  //     const roomMessages = data.seeRooms[0].messages;
  //     setMessages(roomMessages);
  //     // Update messages state with avatars
  //   }
  // }, [loading, data, userData]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const handleSend = (input) => {
  //   let newMessage = {
  //     model: {
  //       message: input,
  //       direction: "outgoing",
  //     },
  //   };

  //   setMessages([...messages, newMessage]);
  // };

  // return (
  //   <div>
  //     <div style={{ position: "relative", height: "500px" }}>
  //       <MainContainer>
  //         <ChatContainer>
  //           <MessageList>{getMessageComponent(messages)}</MessageList>
  //           <MessageInput placeholder="Type message here" onSend={handleSend} />
  //         </ChatContainer>
  //       </MainContainer>
  //     </div>
  //   </div>
  // );
  return "hi";
}
