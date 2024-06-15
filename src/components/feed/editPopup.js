import styled from "styled-components";
import Input from "../auth/input";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { queries } from "@testing-library/react";
import { SEE_PHOTO_QUERY } from "./seeUserFeed";

const EDIT_PHOTO_MUTATION = gql`
  mutation editPhoto($id: Int!, $caption: String!) {
    editPhoto(id: $id, caption: $caption) {
      ok
    }
  }
`;

const EditPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  z-index: 1000;
  min-width: 600px;
`;

const EditPopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditInput = styled.input`
  margin-bottom: 10px;
`;

const ConfirmButton = styled.button`
  background-color: green;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function EditPopupComponent({ onConfirm, caption, id }) {
  const [changeCaption, setChangeCaption] = useState(caption);
  const handleCaptionChange = (e) => {
    setChangeCaption(e.target.value);
  };
  const editPhoto = () => {
    editPhotoMutation();

    onConfirm();
  };

  const [editPhotoMutation] = useMutation(EDIT_PHOTO_MUTATION, {
    variables: {
      id,
      caption: changeCaption,
    },
    refetchQueries: [
      {
        query: SEE_PHOTO_QUERY,
        variables: {
          id,
        },
      },
    ],
  });
  return (
    <EditPopup>
      <EditPopupContent>
        <Input value={changeCaption} onChange={handleCaptionChange}></Input>
        <ConfirmButton onClick={editPhoto}>수정</ConfirmButton>
      </EditPopupContent>
    </EditPopup>
  );
}

export default EditPopupComponent;
