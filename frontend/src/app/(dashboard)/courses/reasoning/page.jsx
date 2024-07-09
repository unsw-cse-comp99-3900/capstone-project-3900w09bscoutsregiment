'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai';

const CourseReasoning = () => {
  const CLO = "Apply C programming language to solve simple decision, looping, array, and linked list problems programmatically"
  const taxLvl = "Applying"
  
  // Ensure stay logged in
  const router = useRouter();
  const token = window.localStorage.getItem('token') || null
  if (token === null) {
    router.push('/');
    return
  }

  // backend stuff
  const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

  const courseReasoning = async () => {
    // const tools = [
    //   {
    //     "type": "function",
    //     "function": {
    //       "name": "get_current_weather",
    //       "description": "Get the current weather in a given location",
    //       "parameters": {
    //         "type": "object",
    //         "properties": {
    //           "location": {
    //             "type": "string",
    //             "description": "The city and state, e.g. San Francisco, CA",
    //           },
    //           "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
    //         },
    //         "required": ["location"],
    //       },
    //     }
    //   }
    // ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: `Explain why is ${CLO} is included as ${taxLvl} in Bloom's Taxonomy` }],
      // tools: tools,
      // tool_choice: "auto",
    });  
    console.log(completion)
  }

  return (
    <div className='min-h-screen bg-blue-100 flex justify-center items-center pt-12'>
        <button onClick={courseReasoning}>Click me</button>
    </div>
  )
}

export default CourseReasoning