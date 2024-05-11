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
import { useState } from "react";
import validateEmail from "../certification/emailVaild";

const GoogleLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

/* git hub에 등록하기 위한 코드
  기본적으로 이 코드는 react에서 표준적으로 input값을 받을 때
  사용하는 코드이다. useState를 사용하면서 블라블라.
  하지만 이 코드는 석 좋지 않은 코드이다.
  일단 한 input에 state를 두개나 사용하고 있다.
  만약 내가 아이디 이메일 비밀번호 등등 여러가지 인풋이
  추가 될 경우에는 정말 useState를 많이 만들어야 될 수도 있다.


*/
const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const onEmailChange = (event) => {
    setEmailError("");
    setEmail(event.target.value);
  };
  const handleSubmit = (event) => {
    //페이지가 새로고침되게 하지 않게 하기위한 코드
    event.preventDefault();
    if (email === "") {
      setEmailError("비어있음.");
    } else if (!validateEmail(email)) {
      setEmailError("올바르지 않은 이메일 형식");
    }
    console.log(email === "" && validateEmail(email));
  };
  return (
    //AuthLayout으로 컴포넌트들을 저장했으니 대체 가능 .
    <AuthLayout>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faRobot} size="3x" />
        </div>
        <form onSubmit={handleSubmit}>
          {emailError}
          <Input
            value={email}
            onChange={onEmailChange}
            type="text"
            placeholder="Email"
          />
          <Input type="password" placeholder="Password" />
          <Button type="submit" value="login" disabled={email === ""} />
        </form>
        <Seperator />
        <GoogleLogin>
          <FontAwesomeIcon icon={faGoogle} style={{ color: "#FFD43B" }} />{" "}
          <span>Log in with Google</span>
        </GoogleLogin>
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
