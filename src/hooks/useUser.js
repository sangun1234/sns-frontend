import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar, logUserOut } from "../apollo";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const ME_QUERY = gql`
  query me {
    me {
      userName
      avatar
    }
  }
`;
function useUser() {
  const history = useHistory();
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  //data가 변경될 때만 useEffect 실행
  useEffect(() => {
    //data라는 객체가 존재하고 그안에 me가 있는지
    //자바스크립트는 undefined, null, false를 거짓으로 생각함
    if (data?.me === null) {
      logUserOut(history); // 백엔드에서 토큰을 확인했을 때 토큰이 제대로 작동하지않으면 로그아웃
    }
  }, [data]);

  return { data };
}

export default useUser;
