'use client';
import React, { useState, useEffect } from 'react';
import './search.css';
//import { useRouter } from 'next/navigation';

const SearchPage = () => {
  let port = 5000;
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('2024');
  const [term, setTerm] = useState('Term 2');
  const [period, setPeriod] = useState('');
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, year, term]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:${port}/api/course/all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourses(data.courses);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = async (courseId) => {
    console.log("addCourse");
    try {
      const response = await fetch(`http://localhost:${port}/api/course/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: "teehee", courseId }),
      });
      if (response.ok) {
        console.log('Course added successfully');
        // Optionally, update the UI to reflect the addition
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const shortenTerm = (term) => {
    return term.replace('Term ', 'T');
  };

  const handleShowDetails = async (course) => {
    console.log("Details show");
    const shortenedTerm = shortenTerm(course.term);
    try {
      const response = await fetch(`http://localhost:${port}/api/course/${course.code}/${course.year}/${shortenedTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedCourse(data[0]);
      console.log('Selected course:', data[0]);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

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
              <option value="Term 3">Term 3</option>
              <option value="Summer">Summer</option>
              {/* Add more terms as needed */}
            </select>
          </div>
        </div>
        <h2>Results :</h2>
        <div className="results">
          {courses.map((course) => (
            <div key={course._id} className="course">
              <span>{course.code}</span>
              <span>{course.title}</span>
              <span>{course.year}</span>
              <span>{course.term}</span>
              <button 
                className="add-button" 
                onClick={() => handleAddCourse(course._id)}
              >
                +
              </button>
              <button className="details-button" onClick={() => handleShowDetails(course)}>Details</button>
            </div>
          ))}
        </div>
      </div>
      {selectedCourse && selectedCourse.outcomes && (
        <div className="modal">
          <div className="modal-content">
            <h2><u>{selectedCourse.title}</u></h2>
            <h3>Outcomes:</h3>
            <ol>
              {selectedCourse.outcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ol>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
