import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { signInSchema } from "../schemas/schemas";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import { GrMail } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import logo from "../assets/IFrame.png"
import "../styles/Form.css"

const SignInForm = () => {
  const { SignIn } = useContext(GlobalMethodsContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // functions
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (values, actions) => {
    const res = await SignIn(values);

    if (res.status === 200) {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
      actions.resetForm();
    } else {
      toast.error("Wrong email or password !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit,
  });

  return (
    <>
      <main class="main">
        <div className="container">
          <div class="form-container">
            <img className="logo" src={logo} alt="" />
            <form class="form" onSubmit={handleSubmit} autoComplete="off">
              <div className="input-container">
                <GrMail size={20} className="icon" />
                <input
                  value={values.email}
                  onChange={handleChange}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? "input-error" : ""}
                />
              </div>
              {errors.email && touched.email && (
                <p className="error">{errors.email}</p>
              )}

              <div className="input-container">
                <RiLockPasswordLine size={22} className="icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? "input-error" : ""
                  }
                />
                {showPassword ? (
                  <BsFillEyeFill
                    size={20}
                    className="icon-right"
                    color="rgb(4, 22, 88)"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <BsFillEyeSlashFill
                    size={20}
                    className="icon-right"
                    color="rgb(4, 22, 88)"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              {errors.password && touched.password && (
                <p className="error">{errors.password}</p>
              )}

              <button disabled={isSubmitting} type="submit" class="button">
                Login
              </button>
              <ToastContainer />

              <div className="form-info">
                Don't have an account?{" "}
                <Link to="/signup" className="link">
                  Signup
                </Link>{" "}
                instead.
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignInForm;