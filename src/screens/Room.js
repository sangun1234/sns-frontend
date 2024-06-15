import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  VoiceCallButton,
  TypingIndicator,
  VideoCallButton,
  EllipsisButton,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        id
        userName
        avatar
      }
      read
    }
  }
`;
export const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query SeeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          userName
          avatar
        }
        read
      }
    }
  }
`;

function Room({ id, otherUser }) {
  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: { id },
  });

  const [sendMessageMutation] = useMutation(SEND_MESSAGE_MUTATION);
  const { data: userData } = useUser();
  const myUserName = userData?.me?.userName;
  let roomId = data?.seeRoom?.id;
  const client = useApolloClient();
  const messages = data?.seeRoom?.messages ?? [];

  const subscribeToNewMessages = () => {
    subscribeToMore({
      document: ROOM_UPDATES,
      variables: {
        id: roomId,
      },
      updateQuery,
    });
  };

  useEffect(() => {
    subscribeToNewMessages();
  }, []);

  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;
    console.log(`updateQuery 실행되는지 확인. ${message}`);
    if (message?.id) {
      const messageFragment = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              userName
              avatar
            }
            read
          }
        `,
        data: message,
      });
      client.cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const handleSend = (input) => {
    sendMessageMutation({
      variables: {
        payload: input,
        roomId,
      },

      update: (cache, result) => {
        const {
          data: {
            sendMessage: { ok, id },
          },
        } = result;

        if (ok && userData) {
          const { message } = input;

          const messageObj = {
            id,
            payload: message,
            user: {
              userName: userData.me.userName,
              avatar: userData.me.avatar,
            },
            read: true,
            __typename: "Message",
          };
          const messageFragment = cache.writeFragment({
            fragment: gql`
              fragment NewMessage on Message {
                id
                payload
                user {
                  id
                  userName
                  avatar
                }
                read
              }
            `,
            data: messageObj,
          });
          cache.modify({
            id: `Room:${roomId}`,
            fields: {
              messages(prev) {
                return [...prev, messageFragment];
              },
            },
          });
        }
      },
    });
  };

  if (loading) return <div>Loading...</div>;
  console.log(data?.seeRoom?.messages);
  return (
    <ChatContainer>
      {otherUser && (
        <ConversationHeader>
          <ConversationHeader.Back />
          <Avatar src={otherUser.avatar} />
          <ConversationHeader.Content
            info="Active 10 mins ago"
            userName={otherUser.userName}
          />
          <ConversationHeader.Actions>
            <VoiceCallButton />
            <VideoCallButton />
            <EllipsisButton orientation="vertical" />
          </ConversationHeader.Actions>
        </ConversationHeader>
      )}

      <MessageList
        typingIndicator={<TypingIndicator content="Zoe is typing" />}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            model={{
              direction:
                message.user.userName === myUserName ? "outgoing" : "incoming",
              message: message.payload,
              position: "single",
              sender: message.user.userName,
              sentTime: "15 mins ago",
            }}
          >
            <Avatar
              name={message.user.userName}
              src={
                message.user.avatar ||
                "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              }
            />
          </Message>
        ))}
      </MessageList>

      <MessageInput placeholder="Type message here" onSend={handleSend} />
    </ChatContainer>
  );
}

export default Room;
