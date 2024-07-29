"use client"; // needed for useState to work
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ChangeEmail() {
    const [oldEmail, setOldEmail] = React.useState("");
    const [newEmail, setNewEmail] = React.useState("");

  let port = process.env.NEXT_PUBLIC_PORT_NUM;

    const handleUpdateEmail = async () => {
        if (oldEmail === "" || newEmail === "") {
            toast.error("You have to input both old and new emails", {
                position: "bottom-right",
                pauseOnHover: false,
            });
            return;
        }

        const response = await fetch(
            `http://localhost:${port}/api/profile/update/email`,
            {
                method: "PUT",
                body: JSON.stringify({
                    oldEmail,
                    newEmail,
                }),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        const data = await response.json();
        if (response.status === 200) {
            toast.success(data.message, {
                position: "bottom-right",
                pauseOnHover: false,
            });
        } else {
            toast.error(data.message, {
                position: "bottom-right",
                pauseOnHover: false,
            });
        }
    };

    return (
        <div>
            <div
                id="top-content"
                className="text-white w-full bg-primary-theme-db flex justify-start gap-4 px-4 py-4"
            >
                <img src="Cotam-logo.png" alt="" className="rounded-md" />
                <Link
                    href="/"
                    className="text-white"
                    style={{ fontSize: "2rem" }}
                >
                    COTAM
                </Link>
            </div>

            <div className="login-background">
                <form
                    name="publish-form"
                    id="form"
                    className=" w-1/3 justify-center mx-auto pt-3" // POSTIION MUST BE ABOSLUTE
                >
                    <div className="mb-5 relative top-32">
                        <label className="block text-white text-[4rem] font-bold mb-5">
                            Update Email
                        </label>
                        <input
                            name="old-email-address"
                            className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
                            id="email-address"
                            type="text"
                            placeholder="Enter your old email address"
                            onChange={(e) => {
                                setOldEmail(e.target.value);
                            }}
                        />

                        <input
                            name="new-email-address"
                            className="shadow appearance-none border rounded w-full py-3 px-2 text-gray-700 placeholder-blue-400 leading-tight focus:outline-none focus:shadow-outline"
                            id="email-address"
                            type="text"
                            placeholder="Enter your new email address"
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                            }}
                        />
                    </div>

                    {/* Send email */}
                    <div className="items-center justify-between relative top-32">
                        <button
                            id="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-1/3 italic py-2 px-4 pb-3: rounded focus:outline-none focus:shadow-outline mb-5"
                            type="button"
                            onClick={handleUpdateEmail}
                        >
                            Submit
                        </button>
                    </div>
                    <div className="flex items-center justify-center relative top-52">
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
    );
}
