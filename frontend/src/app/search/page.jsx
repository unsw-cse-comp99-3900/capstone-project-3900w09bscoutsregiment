'use client';
import React, { useState } from 'react';
import './searchPage.css';
import { useRouter } from 'next/navigation';

const SearchPage = () => {
  // Ensure stay logged in
  const router = useRouter();
  const token = window.localStorage.getItem('token') || null
  if (token === null) {
    router.push('/');
    return
  }


  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('2024');
  const [term, setTerm] = useState('Term 2');
  const [period, setPeriod] = useState('');

  const [courses, setCourses] = useState([
    { code: 'COMP3311', title: 'Database Systems', term: 'Term 1', year: '2024', outcomes: [] },
    { code: 'COMP3331', title: 'Computer Networks and Applications', term: 'Term 1', year: '2024' , outcomes: [] },
    { code: 'COMP9417', title: 'Machine learning and data mining', term: 'Term 1', year: '2024' , outcomes: [] },
    { code: 'COMP1511', title: 'Programming fundamentals', term: 'Term 1', year: '2024' , outcomes: [] }
  ]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleSearch = () => {
    // Add logic to search for courses based on searchTerm, year, term, and period
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.term.toLowerCase().includes(term.toLowerCase()) ||
    course.year.toLowerCase().includes(year.toLowerCase())
  );
  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Search Course Outline</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Searching Using Course Name / Code"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filters">
          <div className="filter">
            <label>Year</label>
            <select value={year} onChange={handleYearChange}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              {/* Add more years as needed */}
            </select>
          </div>
          <div className="filter">
            <label>Term</label>
            <select value={term} onChange={handleTermChange}>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              {/* Add more terms as needed */}
            </select>
          </div>
        </div>
        <h2>Results :</h2>
        <div className="courses">
          {filteredCourses.map((course, index) => (
            <div key={index} className="course">
              <span>{course.code}</span>
              <span>{course.title}</span>
              <span>{course.year}</span>
              <span>{course.term}</span>
              <button className="add-button">+</button>
              <button className="details-button">Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
