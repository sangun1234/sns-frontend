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

const SignUp = () => {
  return (
    <AuthLayout>
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faRobot} size="3x" />
          <Subtitle>
            Sign Up to see Photos from your friends with CHAT-GPT.
          </Subtitle>
          <Button type="submit" value="Get started with Google" />
        </HeaderContainer>
        <Seperator />
        <form>
          <Input type="text" placeholder="Name" />
          <Input type="text" placeholder="Email" />
          <Input type="text" placeholder="UserName" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" value="Sign up" />
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
