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
  // Ensure stay logged in
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
  // const [courses, setCourses] = useState([
  //   {
  //     code: 'COMP3311',
  //     name: 'Database Systems',
  //     term: 'Term 1',
  //     year: '2024',
  //     info: [
  //       { category: 'Create', value: 6 },
  //       { category: 'Evaluate', value: 4 },
  //       { category: 'Analyse', value: 2 },
  //       { category: 'Apply', value: 8 },
  //       { category: 'Understand', value: 5 },
  //       { category: 'Remember', value: 7 },
  //       { category: 'Other', value: 3 },
  //     ],
  //   },
  //   {
  //     code: 'COMP3331',
  //     name: 'Computer Networks and Applications',
  //     term: 'Term 1',
  //     year: '2024',
  //     info: [
  //       { category: 'Create', value: 5 },
  //       { category: 'Evaluate', value: 3 },
  //       { category: 'Analyse', value: 6 },
  //       { category: 'Apply', value: 7 },
  //       { category: 'Understand', value: 4 },
  //       { category: 'Remember', value: 9 },
  //       { category: 'Other', value: 2 },
  //     ],
  //   },
  // ]);
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

  /*
  There is something wrong in this part, TODO: TO be fix later
  */
  const handleCourseClick = async (course) => {
    console.log(course);
    if (
      visitedCourses.some((visitedCourse) => visitedCourse.code === course.code)
    ) {
      // Course already visited, remove it
      setVisitedCourses(
        visitedCourses.filter(
          (visitedCourse) => visitedCourse.code !== course.code
        )
      );
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
    if (
      !visitedCourses.some(
        (visitedCourse) => visitedCourse.code === course.code
      )
    ) {
      setVisitedCourses([...visitedCourses, course]);
    }
  };

  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter((course) => course.code !== courseCode));
  };

  const filteredCourses = courses.filter((course) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchTermLower) ||
      course.code.toLowerCase().includes(searchTermLower) ||
      course.term.toLowerCase().includes(searchTermLower) ||
      course.year.toString().includes(searchTermLower)
    );
  });

  const showAnalysis = () => {
    setShowAnalysisChart(true);
  };

  const hideAnalysis = () => {
    setShowAnalysisChart(false);
  };

  const displayChart = () => {
    if (visitedCourses.length === 1) {
      return (
        <div style={{ width: '100%', height: '300px', marginTop: '5em' }}>
          <ResponsiveContainer>
            <BarChart width={700} height={300} data={visitedCourses[0].info}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='category' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='value'
                fill='#8884d8'
                name={visitedCourses[0].code}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (visitedCourses.length > 1) {
      const colors = ['#8884d8', '#82ca9d', '#ffc658'];

      const data = [];
      const categories = [
        'Create',
        'Evaluate',
        'Analyse',
        'Apply',
        'Understand',
        'Remember',
        'Other',
      ];

      categories.forEach((category) => {
        const obj = { category };
        visitedCourses.forEach((course) => {
          obj[course.code] =
            course.info.find((c) => c.category === category)?.value || 0;
        });
        data.push(obj);
      });

      return (
        <div style={{ width: '100%', height: '300px', marginTop: '5em' }}>
          <ResponsiveContainer>
            <BarChart width={800} height={300} data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='category' />
              <YAxis />
              <Tooltip />
              <Legend />

              {visitedCourses.map((course, idx) => (
                <Bar
                  key={course.code}
                  dataKey={course.code}
                  fill={colors[idx]}
                  stackId='a'
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return null;
  };

  return (
    <>
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
                {filteredCourses.map((course) => (
                  <tr
                    key={course.code}
                    onClick={() => handleCourseClick(course)}
                    className={`course-item ${
                      visitedCourses.length !== 0 &&
                      visitedCourses.some((vc) => vc.code === course.code)
                        ? 'selected'
                        : ''
                    }`}
                  >
                    <td>{course.code}</td>
                    <td className='description'>{course.title}</td>
                    <td className='description'>{course.term}</td>
                    <td className='description'>{course.year}</td>
                    <td>
                      <button
                        className='action-button'
                        onClick={() => handleSaveCourse(course)}
                      >
                        <FontAwesomeIcon icon={faStar} />
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='analysis'>
            {!showAnalysisChart ? (
              <div className='course-details-container'>
                {visitedCourses.length !== 0 ? (
                  visitedCourses.map((course) => (
                    <div key={course._id} className='course-details'>
                      <thead>
                        <tr>
                          <h2>{course.code}</h2>
                          <h3>{course.title}</h3>
                          <p>
                            {course.year} {course.term}
                          </p>
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
            ) : (
              <>
                {displayChart()}
                <button className='analysis-button' onClick={hideAnalysis}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                </button>
              </>
            )}
            {visitedCourses.length !== 0 && !showAnalysisChart && (
              <button
                className='analysis-button'
                onClick={() => showAnalysis()}
              >
                Analyse Course
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
