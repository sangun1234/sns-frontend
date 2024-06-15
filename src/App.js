import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, darkTheme, lightTheme } from "./styles";
import SignUp from "./screens/SignUp";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Message from "./screens/Message";
import Profile from "./screens/Profile";
import Edit from "./screens/Edit";

function App() {
  //로그인이 되어있는지
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  //다크모드 인지(아직 제대로 구현하지 않음 .)
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path={routes.home} exact>
                {isLoggedIn ? (
                  <Layout>
                    <Home />
                  </Layout>
                ) : (
                  <Login />
                )}
              </Route>
              {!isLoggedIn ? (
                <Route path={routes.signUp}>
                  <SignUp />
                </Route>
              ) : null}
              {/* :를 붙여주면 알규먼트로 인식 */}
              <Route path={`/users/:userName`} exact>
                <Layout>
                  <Profile />
                </Layout>
              </Route>
              <Route path={`/users/:userName/edit`} exact>
                <Layout>
                  <Edit />
                </Layout>
              </Route>
              <Route path={`/message`}>
                <Layout>
                  <Message />
                </Layout>
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
