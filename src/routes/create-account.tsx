import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components"
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form, Error, Input, Switcher, Title, Wrapper, SubmitButton } from "../components/auth-components";
import GithubButton from "../components/github-btn";


export default function CreateAccount(){
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {target : {name, value}} = e;
    if(name === "name"){
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    }else if (name === "password"){
      setPassword(value);
    }
  };
  const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if(isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName : name,
      });
      navigate("/");
    } catch(e){
      if(e instanceof FirebaseError){
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <Wrapper>
      <Title>Join ẍ</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          type="text"
          placeholder="Name"
          onChange={onChange}
          required
        />
        <Input
          name="email"
          value={email}
          type="email"
          placeholder="Email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          type="password"
          placeholder="Password"
          onChange={onChange}
          required
        />
        <Input as={SubmitButton} type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?{" "}
        <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton/>
    </Wrapper>
  );
};