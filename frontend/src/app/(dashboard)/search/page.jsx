"use client";
import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "../../globals.css";
import "./search.css";

const SearchPage = () => {
    let port = 5000;
    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState("2024");
    const [term, setTerm] = useState("Term 2");
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(10); // Number of courses per page
    const [selectedCourse, setSelectedCourse] = useState(null);
=======
import { toast } from "react-toastify";

const SearchPage = () => {
  let port = process.env.NEXT_PUBLIC_PORT_NUM;

  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('2024');
  const [term, setTerm] = useState('Term 2');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10); // Number of courses per page
  const [selectedCourse, setSelectedCourse] = useState(null);
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [searchTerm, year, term, courses]);

    const fetchCourses = async () => {
        try {
            const response = await fetch(
                `http://localhost:${port}/api/course/all`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCourses(data); // Assuming data is an array of courses
            setFilteredCourses(data); // Ensure filteredCourses is updated as an array
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, "i");
            filtered = filtered.filter(
                (course) =>
                    course.title.match(searchRegex) ||
                    course.code.match(searchRegex)
            );
        }

        if (year) {
            filtered = filtered.filter(
                (course) => course.year.toString() === year
            );
        }

        if (term) {
            filtered = filtered.filter((course) => course.term === term);
        }

        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to the first page whenever filters change
    };

    const handleAddCourse = async (courseId) => {
        console.log("addCourse");
        try {
            const response = await fetch(
                `http://localhost:${port}/api/course/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ userId: "teehee", courseId }),
                }
            );
            if (response.ok) {
                console.log("Course added successfully");
<<<<<<< HEAD
            } else {
=======
                toast.success("Course added successfully", {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
            } else {
                toast.warning("Course is already added", {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                console.error("Failed to add course");
            }
        } catch (error) {
            console.error("Error adding course:", error);
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

<<<<<<< HEAD
=======
    /**
     * Handle event when you want to jump to certain page of the list
     * @param {*} event
     */
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
    const handleDirectPageChange = (event) => {
        let page = parseInt(event.target.value, 10);
        if (isNaN(page) || page < 1) {
            page = 1;
        } else if (page > Math.ceil(filteredCourses.length / coursesPerPage)) {
            page = Math.ceil(filteredCourses.length / coursesPerPage);
        }
        setCurrentPage(page);
    };
<<<<<<< HEAD

    const shortenTerm = (term) => {
        if (!term.includes("Term")) {
            return term;
        }
        return term.replace("Term ", "T");
    };

=======
    /**
     * Helper function to help with the search term
     * This is done by shorten their term
     * @param {string} term
     * @returns {string} term
     */
    const shortenTerm = (term) => {
        if (term.includes("Hexamester")) {
            return term.replace("Hexamester ", "H");
        }
        if (term.includes("Semester")) {
            return term.replace("Semester ", "S");
        }
        if (term.includes("Term")) {
            return term.replace("Term ", "T");
        }

        return term;
    };

    /**
     * Help To fetch indept details on a specific course
     * @param {course} course
     */
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
    const handleShowDetails = async (course) => {
        const shortenedTerm = shortenTerm(course.term);
        try {
            const response = await fetch(
                `http://localhost:${port}/api/course/${course.code}/${course.year}/${shortenedTerm}`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setSelectedCourse(data[0]);
        } catch (error) {
            console.error("Error fetching course details:", error);
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
<<<<<<< HEAD
        <div className="search-page">
            <div className="search-container">
                <h1>Search Course Outline</h1>
                <div className="search-bar">
                    <input
                        name="course-name-input"
=======
        <div className="flex flex-col items-center p-5 pt-20">
            <div className="bg-primary-bkg rounded-lg shadow-lg p-5 w-full max-w-full">
                <h1 className="text-center text-primary-theme-lb font-bold text-xl">
                    Search Course Outline
                </h1>
                <div className="flex justify-center mb-5">
                    <input
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                        type="text"
                        placeholder="Searching Using Course Name / Code"
                        value={searchTerm}
                        onChange={handleSearchChange}
<<<<<<< HEAD
=======
                        className="w-full max-w-xl p-2 border border-gray-300 rounded"
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
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
<<<<<<< HEAD
=======
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                            <option value="Hexamester 1">Hexamester 1</option>
                            <option value="Hexamester 2">Hexamester 2</option>
                            <option value="Hexamester 3">Hexamester 3</option>
                            <option value="Hexamester 4">Hexamester 4</option>
                            <option value="Hexamester 5">Hexamester 5</option>
                            <option value="Hexamester 6">Hexamester 6</option>
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                            {/* Add more terms as needed */}
                        </select>
                    </div>
                </div>
                <h2 className="text-main-txt">Results :</h2>
                <div className="results">
                    {currentCourses.map((course) => (
<<<<<<< HEAD
                        <div key={course._id} className="course text-main-txt">
                            <span>{course.code}</span>
                            <span>{course.title}</span>
                            <span>{course.year}</span>
                            <span>{course.term}</span>
                            <button
                                id="first-course"
                                className="add-button"
=======
                        <div
                            key={course._id}
                            className="flex justify-between items-center p-2 border-b border-gray-300 text-main-txt"
                        >
                            <span className="flex-1 text-center">
                                {course.code}
                            </span>
                            <span className="flex-1 text-center">
                                {course.title}
                            </span>
                            <span className="flex-1 text-center">
                                {course.year}
                            </span>
                            <span className="flex-1 text-center">
                                {course.term}
                            </span>
                            <button
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
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
<<<<<<< HEAD
                <div className="pagination">
                    <button
                        className={currentPage === 1 ? "disabled" : ""}
=======
                {/* Navigation Menu */}
                <div className="flex justify-center mt-5">
                    <button
                        className={`p-2 mr-2 rounded ${
                            currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                        }`}
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, index) => (
                            <button
                                key={startPage + index}
<<<<<<< HEAD
                                className={
                                    currentPage === startPage + index
                                        ? "active"
                                        : ""
                                }
=======
                                className={`p-2 mr-2 rounded ${
                                    currentPage === startPage + index
                                        ? "bg-blue-700 text-white"
                                        : "bg-blue-600 text-white hover:bg-blue-700 transition"
                                }`}
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                                onClick={() =>
                                    handlePageChange(startPage + index)
                                }
                            >
                                {startPage + index}
                            </button>
                        )
                    )}
                    <button
<<<<<<< HEAD
                        className={currentPage === totalPages ? "disabled" : ""}
=======
                        className={`p-2 mr-2 rounded ${
                            currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                        }`}
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
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
<<<<<<< HEAD
=======
            {/* Show detail of a course */}
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
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
<<<<<<< HEAD
                                <li key={index}>{outcome}</li>
                            ))}
                        </ol>
                        <button onClick={handleCloseModal}>Close</button>
=======
                                <li key={index} className="mt-2">
                                    {outcome}
                                </li>
                            ))}
                        </ol>
                        <button
                            onClick={handleCloseModal}
                            className="mt-5 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Close
                        </button>
>>>>>>> e8a34a236c1f19d669fa716793062b98bbcfd3fa
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
