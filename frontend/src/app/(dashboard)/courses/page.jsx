'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faStar,
  faTrash,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import displayChart from './analysisChart';

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
  const port = 5000;

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

  const shortenTerm = (term) => {
    if (!term.includes('Term')) {
      return term;
    }
    return term.replace('Term ', 'T');
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

  const handleCourseClick = async (course) => {
    if (
      visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)
    ) {
      const newVisitedCourses = visitedCourses.filter(
        (visitedCourse) => visitedCourse.code !== course.code
      );

      setVisitedCourses(newVisitedCourses);

      if (newVisitedCourses.length === 0) {
        setAnalysisChart(false);
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
        c.code === course.code ? { ...c, favorite: !c.favorite } : c
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

  const showAnalysis = () => {
    setAnalysisChart(true);
  };

  const hideAnalysis = () => {
    setAnalysisChart(false);
  };

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
          <button className='flex items-center justify-center w-full my-2.5 p-2.5 bg-blue-700 text-white border-none rounded cursor-pointer transition duration-300 hover:bg-blue-600'>
            <FontAwesomeIcon icon={faPlus} />
            <Link href='/search' className='ml-2.5'>Add Course</Link>
          </button>
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
                  key={course.code}
                  onClick={() => handleCourseClick(course)}
                  className={`flex justify-between items-center p-2.5 rounded border border-gray-300 cursor-pointer transition duration-300 ${visitedCourses.some((vc) => vc.code === course.code) ? 'bg-blue-200' : ''}`}
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
                {displayChart(visitedCourses)}
                <button
                  className='mt-5 p-2.5 bg-blue-700 text-white border-none rounded cursor-pointer'
                  onClick={() => hideAnalysis()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                </button>
              {/* </span> */}
            </>
          )}

          {visitedCourses.length !== 0 && !analysisChart && (
            <button className='mt-5 p-2.5 bg-blue-700 text-white border-none rounded cursor-pointer' onClick={() => showAnalysis()}>
            Analyse Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
