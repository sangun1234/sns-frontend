import { HashRouter as Router, Redirect } from "react-router-dom";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";

//오늘 공부할 주제 : reactive variables
/* 
  아폴로 클라이언트에도 포함되어 있어.
  이게뭐냐 ? reactive variable는 기본적으로 반응하고 변하는 베리어블이다.
  예를 들어서 sns에서는 다크모드 / 로그인 여부 등이 있다.

  이런 리엑티브 베리어블을 리엑트 컴포넌트 내에서 사용하고 싶다면,
  우리는 hook을 사용해야한다.

*/

function App() {
  // useReactiveVar으로 isLoggedInVar이라는 reactive variable가져오기 .(훅)
  // 우리가 원하는 어느 컴포넌트에서도 isLoggedInVar을 바꿀 수 있다.
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact>
            {isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
