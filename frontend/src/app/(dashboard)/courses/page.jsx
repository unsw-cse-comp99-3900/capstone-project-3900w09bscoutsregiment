"use client";

import React, { useState, useEffect } from 'react';
import './listingCourses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faStar, faTrash, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
//import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ListingCourses() {
  // Ensure stay logged in
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [visitedCourses, setVisitedCourses] = useState([]);
  const port = 5000;
  
  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await fetch(`http://localhost:${port}/api/course/list`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user courses');
        }
        const data = await response.json();
        console.log('course list', data);
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
      const response = await fetch(`http://localhost:${port}/api/course/${course.code}/${course.year}/${shortenedTerm}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data[0])
      return data[0];
    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  };

  /*
  There is something wrong in this part, TODO: TO be fix later
  */
  const handleCourseClick = async (course) => {
    console.log(course);
    if (visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)) {
      // Course already visited, remove it
      setVisitedCourses(visitedCourses.filter((visitedCourse) => visitedCourse.code !== course.code));
    } else {
      // Course not visited, fetch and add it
      const fetchedCourse = await handleShowDetails(course);
      if (fetchedCourse) {
        const courseWithOutcomes = {
          courseId: fetchedCourse._id,
          title: fetchedCourse.title,
          code: fetchedCourse.code,
          year: fetchedCourse.year,
          term: fetchedCourse.term,
          favorite: course.favorite,
          colour: course.colour, // default value or replace with actual value if available
          outcomes: fetchedCourse.outcomes,
        };
        setVisitedCourses([...visitedCourses, courseWithOutcomes]);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSaveCourse = (course) => {
    if (!visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)) {
      setVisitedCourses([...visitedCourses, course]);
    }
  };

  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter(course => course.code !== courseCode));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.year.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="app">
        <div className="content">
          <div className="course-list">
            <header className="header">
              <input
                type="text"
                className='input-search'
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </header>
            <button className="add-course-button">
              <FontAwesomeIcon icon={faPlus} />
              <Link href="/search">Add Course</Link>
            </button>
            <table className='courses'>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Term</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => (
                  <tr 
                  key={course.code}
                  onClick={() => handleCourseClick(course)}
                  className={`course-item ${visitedCourses.length !== 0 && visitedCourses.some(vc => vc.code === course.code) ? 'selected' : ''}`}
                  >
                    <td>{course.code}</td>
                    <td className='description'>{course.title}</td>
                    <td className='description'>{course.term}</td>
                    <td className='description'>{course.year}</td>
                    <td>
                      <button className="action-button" onClick={() => handleSaveCourse(course)}>
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                      <button className="action-button" onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.code); }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="analysis">
            <div className="course-details-container">
              {visitedCourses.length !== 0? (

                visitedCourses.map((course) => (
                    <div key={course._id} className="course-details">
                      <thead>
                        <tr>
                          <h2>{course.code}</h2>
                          <h3>{course.title}</h3>
                          <p>{course.year} {course.term}</p>
                        </tr>
                      </thead>
                      <tbody>
                      <ol>
                        {course.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ol>
                      </tbody>
                    </div>
                  ))
                ) : (
                  <div className='normal-details'>
                    <h2>Select a course to analyse</h2>
                    <p>Nothing is selected</p>
                  </div>
              )}
            </div>
            {visitedCourses.length !== 0 && (
                <button className="analysis-button">
                  Analyse Course
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
