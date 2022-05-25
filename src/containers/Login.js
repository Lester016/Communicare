import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

import TextField from "../components/TextField";
import Button from "../components/Button";
import Typography from "../components/Typography";

const LoginContainer = styled(Box)`
  height: 100vh;
  width: 100vw;
  display: flex;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%);
  }
`

const LogoContainer = styled(Box)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%);

  @media only screen and (max-width: 800px) {
    flex: 0;
    background: none;
  }
`

const Logo = styled('img')`
  width: 65%;

  @media only screen and (max-width: 800px) {
    width: 200px;
    margin-top: 64px;
    margin-bottom: 64px;
  }
`

const LoginFormContainer = styled(Box)`
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`

const StyledForm = styled(Form)`
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  
  border-radius: 25px;
  margin: 0px 10%;
  padding: 5% 5%;

  & > * {
    margin: 10px !important;
  }
`

const Header = styled(Typography)`
  font-weight: 700;
`

const StyledButton = styled(Button)`
  background-color: #6667AB;

  &:hover {
    background-color: #4e4f85;
  }
`

const StyledLink = styled(Link)`
  color: #22BB72;
  font-weight: 700;
`

const Login = ({ login, error, loading }) => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  return (
    <LoginContainer>
      <LogoContainer>
        <Logo src={require("../assets/logo.png")} />
      </LogoContainer>

      <LoginFormContainer>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            login(values.email, values.password);
          }}
        >
          <StyledForm>
            <Header variant="h3">Login</Header>

            <TextField type="email" name="email" label="Email" />
            <ErrorMessage name="email" component="div" />

            <TextField type="password" name="password" label="Password" />
            <ErrorMessage name="password" component="div" />

            <p style={{ marginTop: 15, color: "red" }}>{error ? error : null}</p>

            {loading ? (
              <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <CircularProgress sx={{color: "#6667AB"}}/>
              </Box>) :
              <StyledButton type="submit">Sign in</StyledButton>
            }

            <Typography>Don't have an account? <StyledLink href="/auth/register">Sign up</StyledLink></Typography>
          </StyledForm>
        </Formik>
      </LoginFormContainer>
    </LoginContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => {
      dispatch(actions.login(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
