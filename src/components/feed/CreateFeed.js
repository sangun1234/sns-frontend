import styled from "styled-components";
import Avatar from "../Avatar";
import Button from "../auth/Button";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "../../routes";
import { FEED_QUERY } from "../../screens/Home"; // Home 컴포넌트에서 FEED_QUERY를 가져옵니다.
import { useRef } from "react";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload, $caption: String!) {
    uploadPhoto(file: $file, caption: $caption) {
      isMine
    }
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  display: flex;
  height: 500px;
`;

const WriteFile = styled.div`
  height: 100%;
  width: 50%;
  border: solid 2px black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WriteForm = styled.div`
  height: 100%;
  width: 100%;
  border: solid 1px black;
  border-radius: 5px;
  z-index: 9999; /* 모달을 화면의 가장 위쪽에 표시하기 위해 z-index 값을 설정합니다. */
`;

const AvatarForm = styled.div`
  padding: 16px;
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const UserName = styled.h3`
  font-size: 17px;
  margin-left: 10px;
  font-weight: 600;
`;

const WriteArea = styled(AvatarForm)`
  height: 300px;
`;

const WriteText = styled.textarea`
  width: 100%;
  height: 100%;
`;
{
  /* <CloseButton onClick={onClose}>닫기</CloseButton>
        <h2>글쓰기</h2>
        여기에 글쓰기 폼이나 내용을 추가하세요 */
}
const CloseButton = styled.button``;
function CreateFeed({ onClose, data }) {
  const closeButtonRef = useRef(null);
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

  const [uploadPhoto, { loading }] = useMutation(UPLOAD_PHOTO_MUTATION, {
    onCompleted: (data) => {
      const {
        uploadPhoto: { isMine },
      } = data;

      if (!isMine) {
        // 업로드에 실패한 경우를 처리합니다.
        return;
      }

      //이 부분에 자동으로 팝업이 닫히게 설정
      closeButtonRef.current.click();
    },
    refetchQueries: [{ query: FEED_QUERY }],
  });
  const onSubmit = async (data) => {
    if (loading) {
      return;
    }
    const { caption } = data;

    try {
      await uploadPhoto({
        variables: {
          caption,
        },
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };
  return (
    <PopupOverlay>
      <PopupContainer onSubmit={handleSubmit(onSubmit)}>
        <WriteForm>
          <AvatarForm>
            <Avatar url={data?.me?.avatar} />
            <UserName>{data?.me?.userName}</UserName>
            <CloseButton onClick={onClose} ref={closeButtonRef}>
              닫기
            </CloseButton>
          </AvatarForm>

          <WriteArea>
            <WriteText
              ref={register({ required: true })}
              name="caption"
              placeholder="문구를 입력하세요"
            ></WriteText>
          </WriteArea>
          <Button
            type="submit"
            value={loading ? "Loading..." : "등록"}
            disabled={!formState.isValid || loading}
          />
        </WriteForm>
      </PopupContainer>
    </PopupOverlay>
  );
}

export default CreateFeed;
