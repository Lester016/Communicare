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

const LoginContainer = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  display: "flex",
  padding: 1,
  
  [theme.breakpoints.down('md')]: {
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(180deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%)",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(90deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%)",
  
  [theme.breakpoints.down('md')]: {
    flex: 0,
    background: "none",
  },
}));

const Logo = styled(`img`)(({ theme }) => ({
  width: "65%",

  [theme.breakpoints.down('md')]: {
    width: "200px",
    marginTop: "32px",
    marginBottom: "32px",
  }
}))

const LoginFormContainer = styled(Box)(({ theme }) => ({
  width: "700px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.down('md')]: {
    width: "100%",
  }
}))

const StyledForm = styled(Form)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",

  borderRadius: "25px",
  margin: "0px 5%",
  padding: "5%",

  "& > *": {
    margin: "10px !important",
  }
}))

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "700",
}))

const StyledButton = styled(Button) (({ theme }) => ({
  backgroundColor: "#6667AB",

  "&:hover": {
    backgroundColor: "#4e4f85",
  }
}))

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#22bb72",
  fontWeight: "700",
}))

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
            <Header variant="h4">Login</Header>

            <TextField type="email" name="email" label="Email" />
            <ErrorMessage name="email" component="div" />

            <TextField type="password" name="password" label="Password" />
            <ErrorMessage name="password" component="div" />

            <p style={{ marginTop: 15, color: "red" }}>{error ? error : null}</p>

            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "#6667AB" }} />
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