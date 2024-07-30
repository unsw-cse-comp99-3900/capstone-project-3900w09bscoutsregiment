"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    let port = process.env.NEXT_PUBLIC_PORT_NUM;

    /**
     * Keeps track of whether the email form is in focus or not
     * @param {*} event
     * if the form is empty or is not a valid email when its out of focus, updates the state of EmailError to true, otherwise false
     */
    const handleEmailBlur = (event) => {
        if (event.target.validity.typeMismatch || event.target.value === "") {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    /**
     * Keeps track of the changes inside the email form
     * @param {*} event
     * if the current value inside the email form is valid, updates the state of EmailError to false
     */
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (event.target.validity.valid) {
            setEmailError(false);
        }
    };

    /**
     * Keeps track of whether the password form is in focus or not
     * @param {*} event
     * if the password form is empty when its out of focus, updates the state of PasswordError to true, otherwise false
     */
    const handlePasswordBlur = (event) => {
        if (event.target.value === "") {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    /**
     * Keeps track of the changes inside the password form
     * @param {*} event
     * if the current value inside the password form is valid (not empty), updates the state of PasswordError to false
     */
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value !== "") {
            setPasswordError(false);
        }
    };

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
        const response = await fetch(
            `http://localhost:${port}/api/auth/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            }
        );
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            toast.success("User signed in successfully", {
                position: "bottom-center",
                pauseOnHover: false,
            });
            setTimeout(() => {
                router.push("/courses");
            }, 800);
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
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                value={email}
                                // multiple
                            />
                            {emailError && (
                                <p
                                    role="alert"
                                    className="text-red-600 font-bold"
                                >
                                    Please make sure you've entered an{" "}
                                    <em>email address</em>
                                </p>
                            )}
                        </div>

                        {/* password */}
                        <div className="mb-6">
                            <input
                                name="password"
                                className="input_text"
                                id="password"
                                type="password"
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                            />
                            {passwordError && (
                                <p
                                    role="alert"
                                    className="text-red-600 font-bold"
                                >
                                    Please make sure you've entered a{" "}
                                    <em>password</em>
                                </p>
                            )}
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
                            {/* <OAuth></OAuth> */}
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
                            <p className="text-main-txt">
                                {" "}
                                Don't have an account yet?
                            </p>
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
