'use client';

import React, { useState } from 'react';
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
  const [courses, setCourses] = useState([
    {
      code: 'COMP3311',
      name: 'Database Systems',
      term: 'Term 1',
      year: '2024',
      info: [
        { category: 'Create', value: 6 },
        { category: 'Evaluate', value: 4 },
        { category: 'Analyse', value: 2 },
        { category: 'Apply', value: 8 },
        { category: 'Understand', value: 5 },
        { category: 'Remember', value: 7 },
        { category: 'Other', value: 3 },
      ],
    },
    {
      code: 'COMP3331',
      name: 'Computer Networks and Applications',
      term: 'Term 1',
      year: '2024',
      info: [
        { category: 'Create', value: 5 },
        { category: 'Evaluate', value: 3 },
        { category: 'Analyse', value: 6 },
        { category: 'Apply', value: 7 },
        { category: 'Understand', value: 4 },
        { category: 'Remember', value: 9 },
        { category: 'Other', value: 2 },
      ],
    },
  ]);
  const [visitedCourses, setVisitedCourses] = useState([]);
  const [showAnalysisChart, setShowAnalysisChart] = useState(false);

  const handleCourseClick = (course) => {
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
      // Course not visited, add it
      setVisitedCourses([...visitedCourses, course]);
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

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <FontAwesomeIcon icon={faPlus} /> Add Course
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
                    className={`course-item ${
                      visitedCourses.some((vc) => vc.code === course.code)
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleCourseClick(course)}
                  >
                    <td>{course.code}</td>
                    <td className='description'>{course.name}</td>
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
                    <div key={course.code} className='course-details'>
                      <h2>{course.code}</h2>
                      <h3>{course.name}</h3>
                      <p>
                        {course.year} {course.term}
                      </p>
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
