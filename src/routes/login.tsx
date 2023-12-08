import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Form, Error, Input, Switcher, Title, Wrapper, ForgotButton } from "../components/auth-components";
import GithubButton from "../components/github-btn";



export default function Login(){
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {target : {name, value}} = e;
    if (name === "email") {
      setEmail(value);
    }else if (name === "password"){
      setPassword(value);
    }
  };
  const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if(isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch(e){
      if(e instanceof FirebaseError){
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const forgotPassword = async () => {
    try {
      sendPasswordResetEmail(auth,email);
      //navigate("/");
      // await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <Title>Log Into ẍ</Title>
      <Form onSubmit={onSubmit}>
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
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      
      <Input as={ForgotButton} type="submit" value={isLoading ? "Loading..." : "Forgot your password?"} onClick={forgotPassword}/>
      
      <Switcher>
        Don't have and account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};