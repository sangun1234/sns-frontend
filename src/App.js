import { HashRouter as Router, Redirect } from "react-router-dom";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./styles";

/*
  오늘 공부할 주제 : styled component
  styledComponent는 리엑트에서 css를 다루기 가장 좋은 방법이라 할 수 있다


  자, 다크모드 설정을 위해서는 ThemeProvider을 사용해야돼 .

 */

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* 글로벌스타일이 themeprovider안에 들어가 있기때문에 !!
      글로벌스타일에서 theme에 접근할 수 있다.
      */}
      <GlobalStyles />
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
    </ThemeProvider>
  );
}

export default App;
