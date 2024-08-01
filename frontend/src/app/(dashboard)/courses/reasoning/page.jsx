"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const CourseReasoning = ({ CLO, category, keywords, reasoningPopup }) => {
  // Ensure stay logged in
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if (token === null) {
      router.push("/");
      return;
    } else {
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

  const [reasoning, setReasoning] = React.useState("");

  // backend stuff
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const generateReasoning = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Explain why is the keywords "${keywords.join(
              ", "
            )}" in "${CLO}" is included as "${category}" in Bloom's Taxonomy in 60 words`,
          },
        ],
      });
      setReasoning(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching course reasoning:", error);
    }
  };

  React.useEffect(() => {
    if (reasoningPopup) {
      generateReasoning();
    }
  }, [reasoningPopup]);

  return (
    <div className="ml-10">{reasoningPopup && <span>{reasoning}</span>}</div>
  );
};

export default CourseReasoning;
