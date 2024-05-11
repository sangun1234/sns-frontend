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

const SignUp = () => {
  return (
    <AuthLayout>
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
