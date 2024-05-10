import styled from "styled-components";
import { darkModeVar, isLoggedInVar } from "../apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEarthAsia, faRobot } from "@fortawesome/free-solid-svg-icons";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Seperator from "../components/auth/Seperator";
import Input from "../components/auth/input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
const Login = () => {
  return (
    //AuthLayout으로 컴포넌트들을 저장했으니 대체 가능 .
    <AuthLayout>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faRobot} size="3x" />
        </div>
        <form>
          <Input type="text" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" value="login" />
        </form>
        <Seperator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faGoogle} style={{ color: "#74C0FC" }} />
          <span>Log in with Google</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta={"Don't have an account?"}
        link={routes.signUp}
        linkTest={"Sign-up"}
      />
    </AuthLayout>
  );
};

export default Login;
