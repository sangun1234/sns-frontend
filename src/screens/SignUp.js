import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import FormBox from "../components/auth/FormBox";
import { FatLink } from "../components/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import routes from "../routes";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Seperator from "../components/auth/Seperator";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form/dist/index.ie11";
import validateEmail from "../certification/emailVaild";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const GoogleSignup = styled.div`
  margin-top: 14px;
  width: 100%;
  color: white;
  border: none;
  border-radius: 3px;
  background-color: ${(props) => props.theme.accent};
  text-align: center;
  padding: 8px 0px;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $userName: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

const SignUp = () => {
  //url주소를 변경할 때 사용하는 hook
  const history = useHistory();
  const onCompleted = (data) => {
    const { email, password } = getValues();
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return;
    }
    history.push(routes.home, {
      message: "계정 생성 완료. 로그인 하세요.",
      email,
      password,
    });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, watch, formState, errors, getValues } =
    useForm({
      mode: "onChange",
    });

  console.log(watch());
  console.log(formState.isValid);
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    const { firstName, lastName, userName, email, password } = getValues();

    createAccount({
      variables: {
        firstName,
        lastName,
        userName,
        email,
        password,
      },
    });
  };

  return (
    <AuthLayout>
      <Helmet>
        <title>Signup</title>
      </Helmet>
      <FormBox marginTop={"14px"}>
        <HeaderContainer>
          <FontAwesomeIcon icon={faRobot} size="3x" />
          <Subtitle>
            Sign Up to see Photos from your friends with CHAT-GPT.
          </Subtitle>
          <GoogleSignup>
            <FontAwesomeIcon icon={faGoogle} style={{ color: "#FFD43B" }} />
            <span>Get Start With Google</span>
          </GoogleSignup>
        </HeaderContainer>
        <Seperator margin="14px 0px 0px 0px" />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            ref={register({
              required: true,
            })}
            name="firstName"
            type="text"
            placeholder="FirstName"
          />
          <Input
            ref={register({})}
            name="lastName"
            type="text"
            placeholder="LastName"
          />
          <Input
            ref={register({
              required: true,
              minLength: {
                value: 5,
                message: "이메일은 5글자 이상이여야 합니다.",
              },
              validate: validateEmail,
            })}
            name="email"
            type="text"
            placeholder="Email"
          />
          <Input
            ref={register({
              required: true,
              minLength: {
                value: 5,
                message: "username은 5글자 이상이여야 함.",
              },
            })}
            name="userName"
            type="text"
            placeholder="UserName"
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
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox
        cta={"Have an account?"}
        linkTest={"Log in"}
        link={routes.home}
      />
    </AuthLayout>
  );
};

export default SignUp;
