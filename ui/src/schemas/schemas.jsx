import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string().min(4).required("Name is a required field"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .min(5)
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});

export const updateUserSchema = yup.object().shape({
  name: yup.string().min(4).required("Name is a required field"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});
