import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import validateEmail from "../certification/emailVaild";
import Button from "../components/auth/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "../routes";
import { SEE_PROFILE_QUERY } from "./Profile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $userName: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
    }
  }
`;

const EditContainer = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const EditText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const EditAvatar = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputField = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  font-size: 16px;
`;

const Avatar = styled.img`
  height: 160px;
  width: 160px;
  border-radius: 50%;

  background-color: #2c2c2c;
`;

const P = styled.p`
  margin-bottom: 10px;
  font-weight: 600;
`;

function Edit() {
  const {
    register,
    handleSubmit,
    watch,
    formState,
    errors,
    getValues,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const location = useLocation();
  const state = location.state;
  const history = useHistory();

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    refetchQueries: [
      {
        query: SEE_PROFILE_QUERY,
        variables: {
          userName: getValues().userName,
        },
      },
    ],
    onCompleted: async (data) => {
      const {
        editProfile: { ok },
      } = data;

      if (!ok) {
        return;
      }
      const { userName } = getValues();
      history.push(`/users/${userName}`);
    },
  });
  const onSubmit = (data) => {
    //이로서 firstName, lastName, userName, bio, password, gmail을 받음 .
    if (loading) {
      return;
    }
    const { firstName, lastName, userName, email, password, bio } = data;
    editProfile({
      variables: {
        firstName,
        lastName,
        userName,
        email,
        password: password === "" ? null : password,
        bio,
      },
    });
  };
  console.log(formState.isValid);
  // 비밀번호 필드 감시
  const password = watch("password");

  if (password && !formState.errors.password) {
    register("password", {
      required: true,
      minLength: {
        value: 4,
        message: "비밀번호는 4글자 이상이여야 합니다.",
      },
    });
  } else if (!password && formState.errors.password) {
    clearErrors("password");
  }
  return (
    <EditContainer>
      <EditText>프로필 편집</EditText>
      <EditAvatar>
        <Avatar src={state?.avatar} />
      </EditAvatar>
      <EditForm onSubmit={handleSubmit(onSubmit)}>
        <P>firstName</P>
        <InputField
          type="text"
          placeholder="이름"
          defaultValue={state?.firstName}
          name="firstName"
          ref={register}
        />
        <P>lastName</P>
        <InputField
          type="text"
          placeholder="성"
          defaultValue={state?.lastName}
          name="lastName"
          ref={register}
        />
        <P>userName(5글자 이상)</P>
        <InputField
          name="userName"
          ref={register({
            required: true,
            minLength: {
              value: 5,
              message: "username은 5글자 이상이여야 함.",
            },
          })}
          type="text"
          placeholder="사용자 이름"
          defaultValue={state?.userName}
        />
        <P>bio</P>
        <InputField
          type="text"
          placeholder="소개를 작성하세요 ..."
          defaultValue={state?.bio}
          name="bio"
          ref={register}
        />
        <P>이메일(5글자 이상)</P>
        <InputField
          type="text"
          placeholder="email"
          defaultValue={state?.email}
          name="email"
          ref={register({
            required: true,
            minLength: {
              value: 5,
              message: "이메일은 5글자 이상이여야 합니다.",
            },
            validate: validateEmail,
          })}
        />
        <P>비밀번호</P>
        <InputField
          type="password"
          placeholder="비밀번호는 변경 시에만 입력하세요."
          name="password"
          ref={register}
        />
        <Button
          type="submit"
          value={loading ? "Loading..." : "수정"}
          disabled={!formState.isValid || loading}
        />
      </EditForm>
    </EditContainer>
  );
}

export default Edit;
