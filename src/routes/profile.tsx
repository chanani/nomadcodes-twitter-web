import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet";
import { ITweet } from "../components/timeline";
import { Error } from "../components/auth-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 30px 0 0 0;
  height: 100vh;
  @media only screen and (max-width: 500px) {
    padding: 20px 15px 0 15px;
  }
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 150px;
  border-radius: 50%;
  background-color: #1d9bf0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
    height: 50px;
  }
`;
const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
const EditNameTextField = styled.textarea`
  border: 2px solid white;
  padding: 12px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  text-align: center;
  width: 50%;
  height: 70px;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const EditNameButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [newName, setNewName] = useState("");
  const [isEdit, setEditing] = useState(false);
  const [errorEditName, setErrorEditName] = useState("");

  const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      return;
    }
    const { files } = e.target;
    if (!files || files.length !== 1) {
      return;
    }
    const file = files[0];
    const locationRef = ref(storage, `avatars/${user.uid}`);
    const result = await uploadBytes(locationRef, file);
    const avatarUrl = await getDownloadURL(result.ref);
    setAvatar(avatarUrl);
    await updateProfile(user, {
      photoURL: avatarUrl,
    });
  };
  const fetchTweets = async () => {
    if (!user) {
      return;
    }
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });
    setTweets(tweets);
  };
  const onClickEditName = () => {
    setEditing(true);
  };
  const onClickApplyName = async () => {
    setErrorEditName("");
    if (!user) {
      return;
    }
    if (newName === "") {
      setErrorEditName("Can't change to empty name.");
      return;
    }
    await updateProfile(user, {
      displayName: newName,
    });
    setEditing(false);
  };
  const onChangeEditNameField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setNewName(value);
  };
  useEffect(() => {
    fetchTweets();
    if (user && user.displayName) {
      setNewName(user.displayName);
    }
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImage src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onChangeAvatar}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {isEdit ? (
        <>
          <EditNameTextField onChange={onChangeEditNameField} value={newName} />
          <EditNameButton onClick={onClickApplyName}>Apply</EditNameButton>
          {errorEditName !== "" ? <Error>{errorEditName}</Error> : null}
        </>
      ) : (
        <>
          <Name>{user?.displayName ?? "Anonymous"}</Name>
          <EditNameButton onClick={onClickEditName}>Edit</EditNameButton>
        </>
      )}
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}