'use client';

import React, { useState, useEffect } from 'react';
import './listingCourses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faStar,
  faTrash,
  faUser,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faPlus, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
  const [showAnalysisChart, setShowAnalysisChart] = useState(false);
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
      console.log(data[0]);
      return data[0];
    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  };

  const handleCourseClick = async (course) => {
    console.log(course);
    if (
      visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)
    ) {
      setVisitedCourses(
        visitedCourses.filter(
          (visitedCourse) => visitedCourse.code !== course.code
        )
      );
    } else {
      const fetchedCourse = await handleShowDetails(course);
      if (fetchedCourse) {
        const courseWithOutcomes = {
          courseId: fetchedCourse.courseId,
          title: fetchedCourse.title,
          code: fetchedCourse.code,
          year: fetchedCourse.year,
          term: fetchedCourse.term,
          favorite: course.favorite,
          colour: course.colour,
          outcomes: fetchedCourse.outcomes,
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

  const handleDeleteCourse = async (courseCode) => {
    try {
      await fetch(`http://localhost:${port}/api/course/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseId: courseCode }),
      });
      // Remove the course from the list
      setCourses(courses.filter((course) => course.code !== courseCode));
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

  return (
    <div className='app'>
      <div className='content'>
        <div className='course-list'>
          <header className='header'>
            <input
              type='text'
              className='input-search'
              placeholder='Search'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </header>
          <button className='add-course-button'>
            <FontAwesomeIcon icon={faPlus} />
            <Link href='/search'>Add Course</Link>
          </button>
          <div className='courses'>
            {filteredCourses.map((course) => (
              <div
                key={course.code}
                onClick={() => handleCourseClick(course)}
                className={`course-item ${
                  visitedCourses.some((vc) => vc.code === course.code)
                    ? 'selected'
                    : ''
                }`}
              >
                <div className='course-info'>
                  <div className='course-code'>{course.code}</div>
                  <div className='course-title'>{course.title}</div>
                  <div className='course-term'>{course.term}</div>
                  <div className='course-year'>{course.year}</div>
                </div>
                <div className='course-actions'>
                  <button
                    className='action-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteCourse(course);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={course.favorite ? 'favorite' : ''}
                    />
                  </button>
                  <button
                    className='action-button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.code);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='analysis'>
          <div className='course-details-container'>
            {visitedCourses.length !== 0 ? (
              visitedCourses.map((course) => (
                <div key={course.courseId} className='course-details'>
                  <div className='course-header'>
                    <h2>{course.code}</h2>
                    <h3>{course.title}</h3>
                    <p>
                      {course.year} {course.term}
                    </p>
                  </div>
                  <h2>Learning Outcomes:</h2>
                  <div className='course-outcomes'>
                    <ol>
                      {course.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))
            ) : (
              <div className='centered-container'>
                <div className='normal-details'>
                  <h2>Select a course to analyse</h2>
                  <p>Nothing is selected</p>
                </div>
              </div>
            )}
          </div>
          {visitedCourses.length !== 0 && (
            <button className='analysis-button'>Analyse Course</button>
          )}
        </div>
      </div>
    </div>
  );
}
