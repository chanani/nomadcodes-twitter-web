import styled from "styled-components";

const error = {
  "auth/email-already-in-use" : "That email already exists.",
  "auth/weak-password" : "That password not same."
}

export const Wrapper = styled.div`
  height : 100%;
  display : flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;

export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"]{
    cursor: pointer;
    &:hover{
      opacity: 0.8;
    }
  }

  
`;

export const ForgotButton = styled(Input)`
  background-color: black;
  color: white;
  border: 1px solid gray;
  text-align: center;
`;

export const SubmitButton = styled(Input)`
  background-color: rgb(29, 155, 240);
  color: white;
`;


export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a{
    color: #1d9bf0;
  }
`;