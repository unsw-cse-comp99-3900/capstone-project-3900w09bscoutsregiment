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
      col: [
        { category: 'Create', value: 60 },
        { category: 'Evaluate', value: 40 },
        { category: 'Analyse', value: 20 },
        { category: 'Apply', value: 80 },
        { category: 'Understand', value: 50 },
        { category: 'Remember', value: 70 },
        { category: 'Other', value: 30 },
      ],
    },
    {
      code: 'COMP3331',
      name: 'Computer Networks and Applications',
      term: 'Term 1',
      year: '2024',
      col: [
        { category: 'Create', value: 50 },
        { category: 'Evaluate', value: 30 },
        { category: 'Analyse', value: 60 },
        { category: 'Apply', value: 70 },
        { category: 'Understand', value: 40 },
        { category: 'Remember', value: 90 },
        { category: 'Other', value: 20 },
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

  const displayChart = () => {
    if (visitedCourses.length === 1) {
      return (
        <ResponsiveContainer>
          <BarChart width={700} height={300} data={visitedCourses[0].col}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='category' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='value' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (visitedCourses.length > 1) {
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
            course.col.find((c) => c.category === category)?.value || 0;
        });
        console.log(obj);
        data.push(obj);
      });

      return (
        <ResponsiveContainer>
          <BarChart width={800} height={300} data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='category' />
            <YAxis />
            <Tooltip />
            <Legend />
            {visitedCourses.map((course) => (
              <Bar key={course.code} dataKey={course.code} fill='#8884d8' />
            ))}
          </BarChart>
        </ResponsiveContainer>
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
              displayChart()
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
