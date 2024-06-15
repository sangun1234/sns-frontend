import styled from "styled-components";
import { darkModeVar, isLoggedInVar, logUserIn } from "../apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Seperator from "../components/auth/Seperator";
import Input from "../components/auth/input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import validateEmail from "../certification/emailVaild";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import FormError from "../components/auth/FormError";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const GoogleLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

/* 
  react-hook-form 사용하여 로그인 화면 구현하기
  참고하는 자료가 react-hook-form을 구버전을 사용하기에
  다운그레이드를 했다.
  다운그레이드를 할때 react랑 react-dom을 버전에 맞게 설정해줘야된다.

  react-hook-form을 이용하면 스테이트및 함수를 안사용해도 값을 받아올 수 있다.
  "단 !!!!" input의 name이 존재해야한다.
*/

const Notification = styled.div`
  color: #2ecc71;
  font-weight: 600;
  font-size: 15px;
  margin-top: 10px;
`;

// 백앤드와 연결하기 위한 첫번째 mutation을 만들어보자 !!
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    errors,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: location.state?.email || "",
      password: location.state?.password || "",
    },
  });

  //useMutation의 첫 return value 는 mutation을 활성화 시키는 function 이다.
  //loading은 mutation이 잘 전송됐는지를 확인하는 것.
  //data는 mutation 종료 이후에 data가 있는지 확인
  //called는 mutation이 호출된 건지 여부를 확인 (하지만 이번에는 loading만 사용할 예정 )
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    //mutation이 끝난는지를 알려주는 함수 .
    onCompleted: (data) => {
      //backend에서 result를 ok,error,token이 나오게 했으므로 받아온다.
      const {
        login: { ok, error, token },
      } = data;
      //ok가 false라면 ( 로그인 실패 )
      if (!ok) {
        //error을 내보낸다
        return setError("result", {
          message: error,
        });
      }
      if (token) {
        logUserIn(token);
      }
    },
  });
  const onSubmitValid = (data) => {
    // 여기에 email 이랑 password값이 들어오니까
    // 여기서 진짜 로그인을 수행

    if (loading) {
      //loading중이면 다시 로그인 되지 않도록 return 시킨다.
      return;
    }
    const { email, password } = getValues();
    login({
      //mutation 함수니까 variables가 꼭 필요하겠지 ? 이 경우에는 email과 password이다.
      //email과 password는 useForm안에 있다.
      //getValues : 값을 불러줄 함수
      variables: {
        email,
        password,
      },
    });
  };
  const onSubmitInvalid = (data) => {};

  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faRobot} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
          <Input
            ref={register({
              required: true,
              minLength: {
                value: 5,
                message: "이메일은 5글자 이상이여야 합니다.",
              }, // minLength나 validate 키워드는 내가 관례적으로 만든녀석들이다. 따라서 마음대로 키워드 명을 변경할 수 있다.

              validate: validateEmail, //validateEmail함수를 validate키워드에 전달
            })}
            name="email"
            type="text"
            placeholder="Email"
            onChange={clearLoginError}
          />
          <Input
            ref={register({
              required: true,
              minLength: {
                value: 4,
                message: "비밀번호는 4글자 이상이여야 합니다.",
              },
            })}
            name="password"
            type="password"
            placeholder="Password"
            onChange={clearLoginError}
          />
          {/* 
            loading중이면 버튼의 글씨를 바꾼다.
          */}
          <Button
            type="submit"
            value={loading ? "Loading..." : "Login"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={errors?.result?.message} />
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
