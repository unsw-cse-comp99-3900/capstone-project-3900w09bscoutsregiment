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
      <div className="login_background z-10">
        <div className="min-h-screen flex justify-center items-center ">
          <form
            name="publish-form"
            id="form"
            className="justify-center mx-auto w-2/5 space-y-2 p-14 rounded-2xl bg-secondary-bkg shadow-2xl"
          >
            <div>
              <h2 className="block text-primary-theme-lb text-[4rem] font-bold my-4">
                Update Email
              </h2>
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
            <div className="items-center justify-between">
              <button
                id="submit"
                className="bg-primary-theme-lb hover:bg-blue-700 text-white text-lg font-bold w-full italic py-2 mt-3 px-4 pb-3: rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUpdateEmail}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
