"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  let port = process.env.NEXT_PUBLIC_PORT_NUM;

  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if (token !== null) {
      const expiryTime = jwtDecode(token).exp;
      const currentTime = Date.now() / 1000;

      if (expiryTime < currentTime) {
        localStorage.removeItem("token");
        toast.error("Session expired, please log in again");
        router.push("/login");
      } else {
        router.push("/courses");
      }
      return;
    }
  }, []);

  // backend stuff
  const login = async () => {
    const response = await fetch(`http://localhost:${port}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      toast.success("User signed in successfully", {
        position: "bottom-center",
        pauseOnHover: false,
      });
      setTimeout(() => {
        router.push("/courses");
      }, 1500);
    } else {
      console.error(data.message);
      toast.error("Login details are incorrect, please try again", {
        position: "bottom-center",
        pauseOnHover: false,
      });
    }
  };

  /**
   *
   * Main Background color is handled on globals.css on '@apply'->body directive
   */
  return (
    <div className="">
      <div className="login_background z-10">
        <div className="min-h-screen flex justify-center items-center ">
          <form
            name="publish-form"
            id="form"
            className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
          >
            <div>
              <h2 className="block text-primary-theme-lb text-[4rem] font-bold my-4">
                Log In
              </h2>
              <input
                name="email-address"
                className="input_text"
                id="email-address"
                type="text"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                // multiple
              />
            </div>

            {/* password */}
            <div className="mb-6">
              <input
                name="password"
                className="input_text"
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            {/* submit */}
            <div className="items-center justify-between">
              <button
                id="login-submit-btn"
                className="bg-primary-theme-lb hover:bg-blue-700 text-white text-lg font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={login}
              >
                Log in
              </button>
              <div className="p-5">
                <hr className="custom-login-hr "></hr>
              </div>
            </div>
            {/* other login options */}
            <div className="flex items-center justify-evenly">
              <OAuth></OAuth>
            </div>
            {/* forgot password */}
            <div className="pt-8 flex items-center justify-center">
              <Link
                href="/forgotPassword"
                style={{
                  textDecoration: "underline",
                  color: "#1d4ed8",
                }}
              >
                Forgot your password?
              </Link>
            </div>
            {/* sign up */}
            <div className="flex items-center justify-center gap-2">
              <p className="text-main-txt"> Don't have an account yet?</p>
              <Link
                href="/register"
                style={{
                  textDecoration: "underline",
                  color: "#1d4ed8",
                }}
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
