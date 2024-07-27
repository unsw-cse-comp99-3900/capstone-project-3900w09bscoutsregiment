'use client';
import React, { useState, useEffect } from 'react';
import '../../globals.css';
import './search.css';
import { toast } from 'react-toastify';

const SearchPage = () => {
  let port = 5000;
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('2024');
  const [term, setTerm] = useState('Term 2');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10); // Number of courses per page
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, year, term, courses]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:${port}/api/course/all`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourses(data); // Assuming data is an array of courses
      setFilteredCourses(data); // Ensure filteredCourses is updated as an array
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      filtered = filtered.filter(
        (course) =>
          course.title.match(searchRegex) || course.code.match(searchRegex)
      );
    }

    if (year) {
      filtered = filtered.filter((course) => course.year.toString() === year);
    }

    if (term) {
      filtered = filtered.filter((course) => course.term === term);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to the first page whenever filters change
  };

  const handleAddCourse = async (courseId) => {
    console.log('addCourse');
    try {
      const response = await fetch(`http://localhost:${port}/api/course/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: 'teehee', courseId }),
      });
      if (response.ok) {
        console.log('Course added successfully');
        toast.success('Course added successfully', {
          position: 'bottom-center',
          pauseOnHover: false,
        });
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDirectPageChange = (event) => {
    let page = parseInt(event.target.value, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    } else if (page > Math.ceil(filteredCourses.length / coursesPerPage)) {
      page = Math.ceil(filteredCourses.length / coursesPerPage);
    }
    setCurrentPage(page);
  };

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
      setSelectedCourse(data[0]);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  // Get current courses for the page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    Math.min(indexOfLastCourse, filteredCourses.length)
  );

  // Pagination control
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const visiblePages = 5; // Number of pagination links to display

  let startPage, endPage;
  if (totalPages <= visiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.ceil(visiblePages / 2)) {
      startPage = 1;
      endPage = visiblePages;
    } else if (currentPage + Math.floor(visiblePages / 2) >= totalPages) {
      startPage = totalPages - visiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(visiblePages / 2);
      endPage = currentPage + Math.floor(visiblePages / 2);
    }
  }

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
        <div className="filters space-x-3">
          <div className="filter ">
            <label className="text-main-txt">Year</label>
            <select value={year} onChange={handleYearChange}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              {/* Add more years as needed */}
            </select>
          </div>
          <div className="filter">
            <label className="text-main-txt">Term</label>
            <select value={term} onChange={handleTermChange}>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
              <option value="Summer">Summer</option>
              {/* Add more terms as needed */}
            </select>
          </div>
        </div>
        <h2 className="text-main-txt">Results :</h2>
        <div className="results">
          {currentCourses.map((course) => (
            <div key={course._id} className="course text-main-txt">
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
              <button
                className="details-button"
                onClick={() => handleShowDetails(course)}
              >
                Details
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className={currentPage === 1 ? 'disabled' : ''}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
              key={startPage + index}
              className={currentPage === startPage + index ? 'active' : ''}
              onClick={() => handlePageChange(startPage + index)}
            >
              {startPage + index}
            </button>
          ))}
          <button
            className={currentPage === totalPages ? 'disabled' : ''}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div className="direct-navigation">
          <span className="text-main-txt">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handleDirectPageChange}
            className="text-main-txt bg-main-bkg"
          />
          <span className="text-main-txt">of {totalPages} pages</span>
        </div>
      </div>
      {selectedCourse && selectedCourse.outcomes && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              <u>
                ({selectedCourse.code}) {selectedCourse.title}
              </u>
            </h2>
            <h3>Learning Outcomes:</h3>
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
