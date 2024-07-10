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
    console.log("something")
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
        setCourses(data);
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    };

    fetchUserCourses();
  }, []);

  const handleCourseClick = (course) => {
    if (visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)) {
      // Course already visited, remove it
      setVisitedCourses(visitedCourses.filter((visitedCourse) => visitedCourse.code !== course.code));
    } else {
      // Course not visited, add it
      setVisitedCourses([...visitedCourses, course]);
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
                  className={`course-item ${visitedCourses.some(vc => vc.code === course.code) ? 'selected' : ''}`}
                  onClick={() => handleCourseClick(course)}
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
                    <div key={course.code} className="course-details">
                      <h2>{course.code}</h2>
                      <h3>{course.title}</h3>
                      <p>{course.year} {course.term}</p>
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
