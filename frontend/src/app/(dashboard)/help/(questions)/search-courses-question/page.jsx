import React from 'react'
import Link from 'next/link'

const SearchCourses = () => {
  return (
    <div className="bg-main-bkg pt-12">
      <div className="bg-blue-100 p-8 flex flex-col items-center justify-center">
        <span className="font-semibold text-3xl">How do I search all the courses ?</span>
      </div>

      <div className='p-8 space-y-10'>
        <p>To search for courses using our app, first ensure you are registered and logged in. Upon logging in, you will be automatically directed to the /courses page. This page lists all the courses you have previously saved, providing you with a convenient starting point to review and manage your existing selections. From here, you can navigate through your saved courses and access detailed analysis, including course outcomes mapped to Bloom's taxonomy.</p>
        <p>If you wish to add more courses to your list, simply click the "Add Courses" button. This feature enables you to apply various filters to narrow down the courses according to your specific needs and preferences. The filters can be based on different parameters, such as course category, university, or level of study, ensuring that you find the most relevant courses for your analysis. Once you identify a course of interest, you can easily add it to your list by clicking the "+" icon next to the course name.</p>
        <p>The search functionality is designed to streamline your course selection process. By offering a comprehensive search bar and a user-friendly interface, our app helps you quickly locate and add courses to your list. This enables you to focus on analyzing the course outcomes and their alignment with Bloom's taxonomy, ultimately assisting you in developing and enhancing your courses efficiently and effectively.</p>
      </div>

      <div className='p-8'>
        <Link href="/help" className='mt-5 p-2.5 px-10 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700'>Back</Link>
      </div>
    </div>
  )
}

export default SearchCourses