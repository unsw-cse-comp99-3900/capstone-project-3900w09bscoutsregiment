"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

const SearchPage = () => {
  const router = useRouter();
  React.useEffect(() => {
      const token = localStorage.getItem("token") || null;
      if (token === null) {
          router.push("/");
          return;
      } else {
        const expiryTime = jwtDecode(token).exp
        const currentTime = Date.now() / 1000;

        if (expiryTime < currentTime) {
          localStorage.removeItem("token");
          toast.error("Session expired, please log in again");
          router.push("/login");
        }
      }
  }, []);
  
    let port = process.env.NEXT_PUBLIC_PORT_NUM;

    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState("2024");
    const [term, setTerm] = useState("Term 2");
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
    
    /**
     * Filter the courses based on their search option
     */
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
    
    /**
     * Add a course to the user's personal list of courses in the backend
     * @param {*} courseId 
     */
    const handleAddCourse = async (courseId) => {
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
                toast.success("Course added successfully", {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
            } else {
                toast.warning("Course is already added", {
                    position: "bottom-center",
                    pauseOnHover: false,
                });
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

    /**
     * Handle event when you want to jump to certain page of the list
     * @param {*} event
     */
    const handleDirectPageChange = (event) => {
        let page = parseInt(event.target.value, 10);
        if (isNaN(page) || page < 1) {
            page = 1;
        } else if (page > Math.ceil(filteredCourses.length / coursesPerPage)) {
            page = Math.ceil(filteredCourses.length / coursesPerPage);
        }
        setCurrentPage(page);
    };
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
        <div className="flex flex-col items-center p-5 pt-20">
            <div className="bg-primary-bkg rounded-lg shadow-lg p-5 w-full max-w-full">
                <h1 className="text-center text-primary-theme-lb font-bold text-xl">
                    Search Course Outline
                </h1>
                <div className="flex justify-center mb-5">
                    <input
                        name="course-name-input"
                        type="text"
                        placeholder="Searching Using Course Name / Code"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full max-w-xl p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-center space-x-3 mb-5">
                  <div className="flex flex-col items-center">
                    <label className="font-bold text-main-txt mb-1">Year</label>
                        <select value={year} onChange={handleYearChange} className="border border-gray-300 rounded">
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            {/* Add more years as needed */}
                        </select>
                    </div>
                    <div className="flex flex-col items-center">
                      <label className="font-bold text-main-txt mb-1">Term</label>
                        <select value={term} onChange={handleTermChange} className="border border-gray-300 rounded">
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                            <option value="Summer">Summer</option>
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                            <option value="Hexamester 1">Hexamester 1</option>
                            <option value="Hexamester 2">Hexamester 2</option>
                            <option value="Hexamester 3">Hexamester 3</option>
                            <option value="Hexamester 4">Hexamester 4</option>
                            <option value="Hexamester 5">Hexamester 5</option>
                            <option value="Hexamester 6">Hexamester 6</option>
                            {/* Add more terms as needed */}
                        </select>
                    </div>
                </div>
                <h2 className="text-main-txt font-bold text-xl">Showing {currentCourses.length} results out of {filteredCourses.length} :</h2>
                <div className="border-t-2 border-primary-theme-lb pt-2">
                    {currentCourses.map((course) => (
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
                                id={`add-course-${course.code}`}
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                                onClick={() => handleAddCourse(course._id)}
                            >
                                +
                            </button>
                            <button
                              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ml-2"
                              onClick={() => handleShowDetails(course)}
                            >
                              Details
                            </button>
                        </div>
                    ))}
                </div>
                {/* Navigation Menu */}
                <div className="flex justify-center mt-5">
                    <button
                        className={`p-2 mr-2 rounded ${
                            currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                        }`}
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
                                className={`p-2 mr-2 rounded ${
                                    currentPage === startPage + index
                                        ? "bg-blue-700 text-white"
                                        : "bg-blue-600 text-white hover:bg-blue-700 transition"
                                }`}
                                onClick={() =>
                                    handlePageChange(startPage + index)
                                }
                            >
                                {startPage + index}
                            </button>
                        )
                    )}
                    <button
                        className={`p-2 mr-2 rounded ${
                            currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <span className="text-main-txt mr-2">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={handleDirectPageChange}
                    className="w-16 p-2 border border-gray-300 rounded text-main-txt bg-main-bkg mr-2"
                  />
                  <span className="text-main-txt">of {totalPages} pages</span>
                </div>
            </div>
            {/* Show detail of a course */}
            {selectedCourse && selectedCourse.outcomes && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-5 rounded-lg w-4/5 max-w-2xl max-h-4/5 overflow-y-auto shadow-lg">
                    <h2 className="text-xl font-bold"><u>({selectedCourse.code}) {selectedCourse.title}</u></h2>
                    <h3 className="text-lg font-bold mt-3">Learning Outcomes:</h3>
                    <ol className="list-decimal pl-5">
                      {selectedCourse.outcomes.map((outcome, index) => (
                        <li key={index} className="mt-2">{outcome}</li>
                      ))}
                    </ol>
                    <button
                      onClick={handleCloseModal}
                      className="mt-5 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
