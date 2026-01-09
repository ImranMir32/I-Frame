import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { userSchema } from "../schemas/schemas";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrMail } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiSolidUser } from "react-icons/bi";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { GlobalMethodsContext } from "../Context/GlobalMethodsContext";
import logo from "../assets/IFrame.png"
import "../styles/Form.css"

const SignupForm = () => {
  const { SignUp } = useContext(GlobalMethodsContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  // fuctions
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevShowPassword2) => !prevShowPassword2);
  };

  const onSubmit = async (values, actions) => {
    const { confirmPassword, ...signupData } = values;
    const res = await SignUp(signupData);
    if (res === 201) {
      navigate("/");
    } else if (res.status === 400) {
      toast.warning(`${res.data}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.warning(`Network response was not ok`, {
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: userSchema,
    onSubmit,
  });

  return (
    <>
      <main class="main">
        <div className="container">
          <div class="form-container-2">
            <img className="logo" src={logo} alt="" />
            <form class="form" onSubmit={handleSubmit} autoComplete="off">
              {/* name */}
              <div className="input-container">
                <BiSolidUser size={20} className="icon" />
                <input
                  value={values.name}
                  onChange={handleChange}
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  onBlur={handleBlur}
                  className={errors.name && touched.name ? "input-error" : ""}
                />
              </div>
              {errors.name && touched.name && (
                <p className="error">{errors.name}</p>
              )}

              {/* email */}
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

              {/* password */}
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

              {/* password */}
              <div className="input-container">
                <RiLockPasswordLine size={22} className="icon" />
                <input
                  id="confirmPassword"
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Enter confirm password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "input-error"
                      : ""
                  }
                />
                {showPassword2 ? (
                  <BsFillEyeFill
                    size={20}
                    className="icon-right"
                    color="rgb(4, 22, 88)"
                    onClick={togglePasswordVisibility2}
                  />
                ) : (
                  <BsFillEyeSlashFill
                    size={20}
                    className="icon-right"
                    color="rgb(4, 22, 88)"
                    onClick={togglePasswordVisibility2}
                  />
                )}
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}

              {/* button */}
              <button disabled={isSubmitting} type="submit" class="button">
                Sign up
              </button>
              <ToastContainer />

              {/* login  */}
              <div className="form-info">
                Already have an account?{" "}
                <Link to="/" className="link">
                  Login
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

export default SignupForm;