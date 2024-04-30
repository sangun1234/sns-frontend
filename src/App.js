import { HashRouter as Router, Redirect } from "react-router-dom";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { useState } from "react";
//라우터 선언.
// 브라우저라우터 : html5의 히스토리 api사용
//해쉬라우터: url 사용

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      <Router>
        <Switch>
          {/* 스위치는 한번에 딱 하나의 route만 랜더링 시킴.
          얘를 안쓰면 route가 다 중복되서 보여진다.
          하지만 이럴경우 path가 / 인녀석만 출력이 되기때문에
          exact를 써줘야된다. url이 정확히 맞는지 확인하는 것.
          */}
          <Route path="/" exact>
            {isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              // 이거처럼 prop을 계속 아래로 보내는 행위는 좋지 않다고 한다.
              //따라서 apolloClient로 로컬 state를 가져오도록 할거임.
              <Login setIsLoggedIn={setIsLoggedIn} />
            )}
          </Route>
          <Route>
            <NotFound />
            {/* 뭔 이상한거를 url에써서 들어올라하면 오류라고 알려주는 문구 */}
            {/* 맨 마지막에 와야되는 것이 중요하다. */}

            {/* <Redirect to="/" /> */}
            {/* 이런 방식으로도 사용 가능하다. 리다이렉트로 홈으로 보내는 것이다. */}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
