import React from 'react'
import Link from 'next/link'

const Cotam = () => {
  return (
    <div className="bg-main-bkg pt-12">
      <div className="bg-blue-100 p-8 flex flex-col items-center justify-center">
        <span className="font-semibold text-3xl">What is COTAM and who developed it ?</span>
      </div>

      <div className='p-8 space-y-10'>
        <p>Course Outline Taxonomical Analysis and Mapping (COTAM) is a specialized tool developed to aid in understanding and analyzing the outcomes of various courses. Created by a group of dedicated and passionate students from Scouts Regiment, COTAM is designed to help educators and course administrators evaluate and map course outcomes according to Bloom's taxonomy, facilitating improved course development and assessment.</p>
        <p>This website serves as a general guide to comprehend the outcomes of a course, offering valuable insights and detailed analysis. However, users should be mindful that the information provided by COTAM may change or require corrections over time. It is crucial to verify any specific details with the relevant university authorities to ensure accuracy and reliability.</p>
        <p>While COTAM strives to deliver accurate and helpful information, it cannot be held responsible for any issues or misunderstandings that may arise from its use. Users are encouraged to cross-check details and exercise due diligence before making decisions based on the information provided by the tool.</p>
      </div>

      <div className='p-8'>
        <Link href="/help" className='mt-5 p-2.5 px-10 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700'>Back</Link>
      </div>
    </div>
  )
}

export default Cotam