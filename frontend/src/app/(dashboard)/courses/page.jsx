'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faStar,
  faTrash,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import displayChart from './analysisChart';
import Image from 'next/image';
import CourseReasoning from './reasoning/page';

export default function ListingCourses() {
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('token') || null;
    if (token === null) {
      router.push('/');
      return;
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [visitedCourses, setVisitedCourses] = useState([]);
  const [analysisChart, setAnalysisChart] = useState(false);
  const [breakdown, setBreakdown] = useState(false)
  const [reasoningPopup, setReasoningPopup] = useState(null)
  const port = process.env.NEXT_PUBLIC_PORT_NUM;

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:${port}/api/course/list`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    };

    
    fetchUserCourses();
  }, []);
  
  /**
   * Helper function to help with the search term
   * This is done by shorten their term
   * @param {string} term 
   * @returns {string} term
   */
  const shortenTerm = (term) => {
    if (term.includes('Hexamester')) {
      return term.replace('Hexamester ', 'H');
    }
    if (term.includes('Semester')) {
      return term.replace('Semester ', 'S');
    }
    if (term.includes('Term')) {
      return term.replace('Term ', 'T');
    }
    
    return term;
  };

  const handleShowDetails = async (course) => {
    const shortenedTerm = shortenTerm(course.term);
    try {
      const response = await fetch(
        `http://localhost:${port}/api/course/${course.code}/${course.year}/${shortenedTerm}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  };

  /**
   * When a course is click handle the necessary actions
   * Unselected a course, if previous the course had been selected and
   * remove them from visitedCourses
   * Select a course and fetch details of the course that was selected
   * add them to visitedCourses
   * @param {course} course 
   */
  const handleCourseClick = async (course) => {
    if (
      visitedCourses.some((visitedCourse) => visitedCourse.courseId === course.courseId)
    ) {
      const newVisitedCourses = visitedCourses.filter(
        (visitedCourse) => visitedCourse.courseId !== course.courseId
      );

      setVisitedCourses(newVisitedCourses);

      if (newVisitedCourses.length === 0) {
        setAnalysisChart(false);
        setBreakdown(false)
      }
    } else {
      const fetchedCourse = await handleShowDetails(course);
      if (fetchedCourse) {
        const courseWithOutcomes = {
          courseId: course.courseId,
          title: fetchedCourse.title,
          code: fetchedCourse.code,
          year: fetchedCourse.year,
          term: fetchedCourse.term,
          favorite: course.favorite,
          colour: course.colour,
          outcomes: fetchedCourse.outcomes,
          keywords: fetchedCourse.keywords,
          info: course.info,
        };
        setVisitedCourses([...visitedCourses, courseWithOutcomes]);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFavoriteCourse = async (course) => {
    const endpoint = course.favorite ? 'unfavorite' : 'favorite';
    try {
      await fetch(`http://localhost:${port}/api/course/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseId: course.courseId }),
      });
      // Refresh course list
      const updatedCourses = courses.map((c) =>
        c.courseId === course.courseId ? { ...c, favorite: !c.favorite } : c
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error(
        `Error ${course.favorite ? 'unfavoriting' : 'favoriting'} course:`,
        error
      );
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await fetch(`http://localhost:${port}/api/course/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseId: courseId }),
      });
      // Remove the course from the list
      setCourses(courses.filter((course) => course.courseId !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  /**
   * Handle the search filter for courses base on their:
   * title, code, term, and year.
   * and sort term base on favorite.
   */
  const filteredCourses = courses
    .filter((course) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchTermLower) ||
        course.code.toLowerCase().includes(searchTermLower) ||
        course.term.toLowerCase().includes(searchTermLower) ||
        course.year.toString().includes(searchTermLower)
      );
    })
    .sort((a, b) => b.favorite - a.favorite);

  const getPDF = async () => {
    const courses = visitedCourses.map((c) => c.courseId);
    try {
      const result = await fetch(`http://localhost:${port}/api/course/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courses: courses }),
      });
      const blob = await result.blob();
      const objectURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectURL;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error fetching pdf:', error);
    }
  };

  const showAnalysis = () => {
    // getPDF();
    setAnalysisChart(true);
    setBreakdown(false)
  };

  const hideAnalysis = () => {
    setAnalysisChart(false);
    setBreakdown(false)
  };
  
  const showBreakdown = () => {
    setBreakdown(true)
  }
  
  const hideBreakdown = () => {
    setBreakdown(false)
    showAnalysis()
  }

  const showPopup = (courseId, indexCLO) => {
    setReasoningPopup({ courseId, indexCLO })
  };

  const hidePopup = () => {
    setReasoningPopup(null);
  };

  const highlightKeywords = (outcome, keyword) => {
    const words = outcome.split(' ').map((x) => x.replace(/\W/g, '').toLowerCase())
    const keywords = keyword.map((x) => x.toLowerCase())

    return words.map((word, index) => {
      if (keywords.includes(word)) {
        return <span key={index} className="bg-blue-800 text-white font-bold">{word}</span>;
      } else {
        return <span key={index}> {word} </span>;
      }
    })
  }

  const findCourseFromId = (courseId, visitedCourse) => {
    return visitedCourse.find(course => course.courseId === courseId)
  }

  // console.log(reasoningPopup)

  return (
    <div className='flex h-full w-full'>
      <div className='flex w-full'>
        <div className='flex-1 flex flex-col bg-gray-100 p-5 border-r border-gray-300'>
          <header className='flex items-center p-5 pt-12 justify-center'>
            <input
              type='text'
              className='flex-grow p-2.5 mr-2.5 rounded border border-gray-300 text-black'
              placeholder='Search'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </header>
          <button className='flex items-center justify-center w-full my-2.5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer transition duration-300 hover:bg-blue-700'>
            <FontAwesomeIcon icon={faPlus} />
            <Link href='/search' className='ml-2.5'>Add Course</Link>
          </button>
          {/* Show list of user's courses */}
          <div className='flex flex-col gap-2.5 p-2.5'>
            {filteredCourses.length === 0 ? (
              <div className='flex items-center justify-center h-full'>
                <div className='flex flex-col items-center justify-center text-center'>
                  <h2>Empty, No Courses</h2>
                  <p>Click on the Add Course Button to find courses</p>
                  <p>to add to the list</p>
                </div>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.courseId}
                  onClick={() => handleCourseClick(course)}
                  className={`flex justify-between items-center p-2.5 rounded border border-gray-300 cursor-pointer transition duration-300 ${visitedCourses.some((vc) => vc.courseId === course.courseId) ? 'bg-blue-200' : ''}`}
                >
                  <div className='flex flex-col'>
                    <div className='font-bold'>{course.code}</div>
                    <div>{course.title}</div>
                    <div>{course.term}</div>
                    <div>{course.year}</div>
                  </div>
                  <div className='flex gap-1.5'>
                    <button
                      className='bg-none border-none cursor-pointer text-gray-500 hover:text-black'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteCourse(course);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        className={course.favorite ? 'text-yellow-300' : ''}
                      />
                    </button>
                    <button
                      className='bg-none border-none cursor-pointer text-gray-500 hover:text-black'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.courseId);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className='flex flex-col items-center p-5 w-full pt-20'>
          {!analysisChart ? (
              visitedCourses.length !== 0 ? (
                visitedCourses.map((course, idx) => (
                  <div className='w-full flex flex-wrap gap-5'>
                    <div key={idx} className='bg-gray-200 border border-black rounded p-5 flex-grow min-w-[300px]'>
                      <div className='mb-2.5 border-b-2 border-black'>
                        <h2>{course.code}</h2>
                        <h3>{course.title}</h3>
                        <p>
                          {course.year} {course.term}
                        </p>
                      </div>
                      <h2>Learning Outcomes:</h2>
                      <div className='pl-5'>
                        <ol className='list-decimal'>
                          {course.outcomes.map((outcome, index) => (
                            <li key={index}>{outcome}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <div className='flex flex-col items-center justify-center text-center'>
                    <h2 className='text-main-txt'>Select a course to analyse</h2>
                    <p className='text-main-txt'>Nothing is selected</p>
                  </div>
                </div>
              )
          ) : (
            <> {/* BETTER to display with DIV , and change listing courses flex   */}
              {/* <span className=''>  */}
              {!breakdown ? (
                <>
                  {displayChart(visitedCourses)}
                  <div className='flex gap-5'>
                    <button
                      className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700'
                      onClick={() => hideAnalysis()}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                    </button>
                    <button className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700' onClick={getPDF}>
                      Download PDF
                    </button>
                    <button className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700' onClick={() => showBreakdown()}>
                      <FontAwesomeIcon icon={faArrowRight} /> Break down
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Breakdown courses */}
                    {visitedCourses.length !== 0 ? (
                      visitedCourses.map((course, idx) => (
                        <div className='w-full flex flex-wrap gap-5'>
                          <div key={idx} className='bg-gray-200 border border-black rounded p-5 flex-grow min-w-[300px]'>
                            <div className='mb-2.5 border-b-2 border-black'>
                              <h2>{course.code}</h2>
                              <h3>{course.title}</h3>
                              <p>
                                {course.year} {course.term}
                              </p>
                            </div>
                            <h2>Learning Outcomes:</h2>
                            <div className='pl-5'>
                              <ol className='list-decimal'>
                                {course.outcomes.map((outcome , index) => (
                                  <div className='flex justify-between gap-20 items-center'>
                                    <li key={index}>{highlightKeywords(outcome, course.keywords[index].words)}</li>
                                    <Image src='/assets/icons/details.svg' width={30} height={30} onClick={() => showPopup(course.courseId, index)} alt='details' />
                                  </div>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='flex items-center justify-center h-full'>
                        <div className='flex flex-col items-center justify-center text-center'>
                          <h2 className='text-main-txt'>Select a course to analyse</h2>
                          <p className='text-main-txt'>Nothing is selected</p>
                        </div>
                      </div>
                    )}
                  <div className='flex gap-5'>
                    <button
                      className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700'
                      onClick={() => hideBreakdown()}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                    </button>
                    <button className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700' onClick={{/* Add your download handle */}}>
                      Download PDF
                    </button>
                  </div>
                </>
              )}
              {/* </span> */}
            </>
          )}

          {visitedCourses.length !== 0 && !analysisChart && (
            <button className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700' onClick={() => showAnalysis()}>
            Analyse Course
            </button>
          )}
        </div>
      </div>
      {reasoningPopup && (
        <div className='fixed flex justify-center items-center min-h-screen w-full bg-opacity-50 bg-gray-500'>
          <div className='bg-white p-10 rounded-xl space-y-3 w-[50rem]'>
            <h2 className='font-bold text-lg text-center text-xl'>{findCourseFromId(reasoningPopup.courseId, visitedCourses).outcomes[reasoningPopup.indexCLO]}</h2>
            <hr className='border-2' />
            <p><span className='font-bold'>Category: </span>{findCourseFromId(reasoningPopup.courseId, visitedCourses).keywords[reasoningPopup.indexCLO].category}</p>
            {
              findCourseFromId(reasoningPopup.courseId, visitedCourses).keywords[reasoningPopup.indexCLO].words.length === 0 ? (
                <span></span>
              ) : (
                <p className='font-bold'>Matched Keywords: </p>
              )
            }
            <ul>
              {findCourseFromId(reasoningPopup.courseId, visitedCourses).keywords[reasoningPopup.indexCLO].words.map((word, index) => (
                <li className='list-disc ml-10' key={index}>{word}</li>
              ))}
            </ul>
            <p className='font-bold'>Reasoning:</p>
            <CourseReasoning 
              CLO={findCourseFromId(reasoningPopup.courseId, visitedCourses).outcomes[reasoningPopup.indexCLO]} 
              category={findCourseFromId(reasoningPopup.courseId, visitedCourses).keywords[reasoningPopup.indexCLO].category} 
              keywords={findCourseFromId(reasoningPopup.courseId, visitedCourses).keywords[reasoningPopup.indexCLO].words}
              reasoningPopup={reasoningPopup} />
            <button className='mt-5 p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700' onClick={hidePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
