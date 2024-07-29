"use client";
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    let port = process.env.NEXT_PUBLIC_PORT_NUM;


    const handleResetPassword = async () => {
        if (
            oldPassword === "" ||
            newPassword === "" ||
            confirmPassword === ""
        ) {
            toast.error("You have to input all fields", {
                position: "bottom-right",
                pauseOnHover: false,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password is not the same as confirm password", {
                position: "bottom-right",
                pauseOnHover: false,
            });
        } else {
            const res = await fetch(
                `http://localhost:${port}/api/profile/update/resetpassword`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        oldPassword,
                        newPassword,
                    }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const data = await res.json();
            if (res.status === 200) {
                toast.success(data.message, {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
            } else {
                toast.error(data.message, {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
            }
        }
    };
    return (
        <div>
            <div className="login_background">
                <div className="min-h-screen flex justify-center items-center">
                    {/* start of form */}
                    <form
                        name="publish-form"
                        id="form"
                        className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
                    >
                        <div className="mb-2">
                            <label
                                className="block text-primary-theme-lb text-[3rem] font-bold my-4"
                                htmlFor="password"
                            >
                                Reset Password
                            </label>
                        </div>

                        {/* password */}
                        <div className="mb-2">
                            <input
                                name="old-password"
                                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
                                id="old-password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                name="new-password"
                                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 placeholder-blue-400 my-0"
                                id="new-password"
                                type="password"
                                placeholder="New password"
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                            />
                        </div>

                        {/* confirm password */}
                        <div className="mb-6">
                            <input
                                name="confirm-password"
                                className="shadow appearance-none border border-500 rounded w-full py-2 px-2 my-0 placeholder-blue-400"
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                            />
                        </div>

                        {/* submit */}
                        <div className="flex items-center justify-between pb-2">
                            <button
                                id="submit"
                                className="bg-primary-theme-lb hover:bg-blue-700 text-white font-bold w-full italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleResetPassword}
                            >
                                Reset
                            </button>
                        </div>
                        <div className="flex items-center justify-center relative top-52 text-main-txt">
                            Return to &nbsp;
                            <Link
                                href="/"
                                className="text-primary-theme-lb underline"
                            >
                                Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
