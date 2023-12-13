import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import EditTweetDialog from "./edit-tweet-dialog";
import { useState } from "react";

const Wrapper = styled.div<{ imageActive: boolean }>`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid;
  border-color: white;
  border-radius: 15px;
`;
const Overlay = styled.div<{ imageActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(
    0,
    0,
    0,
    0.57
  ); /* 추가: 배경을 흰색으로 설정하고 투명도를 조절합니다. */
  z-index: ${(props) =>
    props.imageActive
      ? 1
      : -1}; /* 추가: imageActive 상태에 따라 z-index를 설정하여 활성/비활성 상태를 관리합니다. */
`;
const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-left: 5px;
  cursor: pointer;
`;

const BigImageBox = styled.div`
  width: 100%;
  height: 400px;
  z-index: 1;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  top: 30vh;
  @media only screen and (max-width: 500px) {
    width: 100%;
    height: 70vw;
  }
`;

const BigImage = styled.img`
  width: 400px;
  height: 400px;

  justify-content: center;
  @media only screen and (max-width: 500px) {
    width: 70vw;
    height: 70vw;
  }
`;

export default function Tweet(tweetProps: ITweet) {
  const [edit, setEdit] = useState(false);
  const { username, photo, tweet, userId, id } = tweetProps;
  const [image, setImage] = useState(false);
  const user = auth.currentUser;
  const onDelete = async () => {
    if (user?.uid !== userId) {
      return;
    }
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok) {
      return;
    }
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onEdit = async () => {
    setEdit(true);
  };
  const onCloseEdit = () => {
    setEdit(false);
  };
  const onImage = () => {
    setImage(!image);
  };
  return (
    <Wrapper imageActive={image}>
      {image && <Overlay imageActive={image} />}
      <Column>
        {image ? (
          <BigImageBox>
            <BigImage src={photo} onClick={onImage} />
          </BigImageBox>
        ) : null}
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <>
            <DeleteButton onClick={onDelete}>delete</DeleteButton>
            <EditButton onClick={onEdit}>edit</EditButton>
          </>
        ) : null}
      </Column>
      {edit ? (
        <EditTweetDialog onClose={onCloseEdit} tweet={tweetProps} />
      ) : null}
      <Column>{photo ? <Photo src={photo} onClick={onImage} /> : null}</Column>
    </Wrapper>
  );
}
