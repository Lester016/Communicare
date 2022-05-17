import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = ({ loading, error }) => {
  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required().label("Email"),
    password: Yup.string().required().label("Password"),
    confirmPassword: Yup.string()
      .required()
      .label("Confirm password")
      .oneOf([Yup.ref("password"), null], "Password doesn't match"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        console.log(values.email, values.password);
      }}
    >
      <Form>
        <h1>Register</h1>
        <Field type="email" name="email" />
        <ErrorMessage name="email" component="div" />

        <Field type={"password"} name="password" />
        <ErrorMessage name="password" component="div" />

        <Field type={"password"} name="confirmPassword" />
        <ErrorMessage name="confirmPassword" component="div" />

        <p style={{ marginTop: 15, color: "red" }}>{error ? error : null}</p>

        {loading ? <h1>loading...</h1> : <button>Sign in</button>}
      </Form>
    </Formik>
  );
};

export default Register;
