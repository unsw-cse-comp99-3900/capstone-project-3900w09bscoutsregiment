import React from 'react'
import Link from 'next/link'

const BloomsTaxonomy = () => {
  return (
    <div className="bg-main-bkg pt-12">
      <div className="bg-blue-100 p-8 flex flex-col items-center justify-center">
        <span className="font-semibold text-3xl">What is bloom's taxonomy and how will it help us ?</span>
      </div>

      <div className='p-8 space-y-10'>
        <p>Bloom's Taxonomy is a hierarchical framework developed by educational psychologist Benjamin Bloom and his colleagues in the 1950s. It categorizes learning objectives into different levels of complexity and specificity, which helps educators design and assess educational activities and outcomes. The taxonomy is divided into three domains: Cognitive (knowledge-based), Affective (emotion-based), and Psychomotor (action-based), though the Cognitive domain is the most widely used and includes six levels: Remember, Understand, Apply, Analyze, Evaluate, and Create.</p>
        <p>Bloom's Taxonomy helps educators and course administrators by providing a structured approach to developing and assessing learning outcomes. By aligning course objectives with the different levels of the taxonomy, educators can ensure that their courses promote higher-order thinking skills and comprehensive understanding. This alignment also aids in creating more effective assessments, as educators can design questions and tasks that accurately measure students' progress through the various levels of learning.</p>
        <p>In the context of our app, integrating Bloom's Taxonomy into the analysis of course outcomes offers several benefits. It allows for a systematic evaluation of whether a course covers a broad spectrum of cognitive skills, from basic knowledge recall to advanced critical thinking and creativity. By mapping course outcomes to Bloom's Taxonomy, educators can identify gaps or areas for improvement, ensuring that their courses foster well-rounded and deep learning experiences for students. This ultimately leads to better course design and more effective teaching strategies.</p>
      </div>

      <div className='p-8'>
        <Link href="/help" className='mt-5 p-2.5 px-10 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700'>Back</Link>
      </div>
    </div>
  )
}

export default BloomsTaxonomy