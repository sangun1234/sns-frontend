import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
} from "@apollo/client";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
const TOKEN = "token";

//로그인 했는지 여부 묻기.
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const tokenVar = makeVar("");
//로그인 함수
export const logUserIn = (token) => {
  //로컬 스토리지에 받아온 토큰을 저장한다.
  localStorage.setItem(TOKEN, token);
  tokenVar(token);
  //로그인 여부를 true로 바꾼다. (사실 위에도 설정 해놔서 의미가 있는진 모르겠음. 그래도 확실히 하기 위해서 설정함.)
  isLoggedInVar(true);
};

//로그아웃 함수
export const logUserOut = (history) => {
  //로컬스토리지의 토큰을 삭제한다.
  localStorage.removeItem(TOKEN);
  tokenVar(null);
  //페이지 기록을 없앤다.
  history.replace();
  //새로고침한다.
  window.location.reload();
};

export const darkModeVar = makeVar(false);

const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});
const token = localStorage.getItem(TOKEN);
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    options: {
      connectionParams: {
        token: token,
      },
    },
  })
);
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN);
  return {
    headers: {
      ...headers,
      //http헤더에 토큰 넣기
      token: token,
    },
  };
});
//ws와 http를 같이 쓰기 위한
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    console.log(definition);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);
export const client = new ApolloClient({
  connectToDevTools: true,
  //uri 등록
  link: splitLink,
  //캐시는 한번 갔다온거 기억해서 같은 정보 가져오도록 하지 않는 것 .
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        //고유 식별자 부여
        keyFields: (obj) => `User:${obj.userName}`,
      },
    },
  }),
});

/*updating apollo cache
  어떻게 업데이트 하냐를 배워본다. 

  1.간접적 방법 : 쿼리 하나를 더 호출한다.
  쿼리 자체를 한번더 리페칭하는거기 때문에 별로다.
  그래서, 매우 작은 쿼리라면 refetchQueries를 사용한다.

  2.fragment 를 사용하는 방법.
*/
