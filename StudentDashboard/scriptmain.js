
"use strict";

// ========================================
// 1. INITIAL DATA
// ========================================

let students = [
    { id: 1, name: "ayush", marks: 100 },
    { id: 2, name: "harshit", marks: 90 },
    { id: 3, name: "arjun", marks: 20 }
];

let nextId = 3;

// ========================================
// 2. SELECT HTML ELEMENTS
// ========================================

const studentForm = document.querySelector("#student-form");
const nameInput = document.querySelector("#student-name");
const marksInput = document.querySelector("#student-marks");

const tBody = document.querySelector("#student-list");

const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const gradeFilter = document.querySelector("#grade-filter");

const totalStudents = document.querySelector("#total-students");
const averageMarks = document.querySelector("#average-marks");
const highestMarks = document.querySelector("#highest-marks");
const lowestMarks = document.querySelector("#lowest-marks");

const topStudent = document.querySelector("#top-student");
const lowestStudent = document.querySelector("#lowest-student");

const passedCount = document.querySelector("#passed-count");
const failedCount = document.querySelector("#failed-count");
const passRate = document.querySelector("#pass-rate");

const resultCount = document.querySelector("#result-count");
const emptyMessage = document.querySelector("#empty-message");
const formMessage = document.querySelector("#form-message");

// ========================================
// 3. HELPER FUNCTIONS
// ========================================

// Calculate grade
function Grading(marks) {
    if (marks >= 90) {
        return "A";
    } else if (marks >= 75) {
        return "B";
    } else if (marks >= 60) {
        return "C";
    } else if (marks >= 33) {
        return "D";
    } else {
        return "F";
    }
}

// Calculate pass/fail status
function statusFunction(grade) {
    return grade === "F" ? "Fail" : "Pass";
}

// Add calculated properties to a student
function getStudentDetails(student) {
    const grade = Grading(student.marks);

    return {
        ...student,
        grade: grade,
        status: statusFunction(grade)
    };
}

// Check whether an array is empty
function isEmpty(array) {
    return array.length === 0;
}

// ========================================
// 4. CREATE TABLE ROW
// ========================================

function createTr(student) {
    const studentDetails = getStudentDetails(student);

    const tr = document.createElement("tr");
    tr.classList.add("ourTr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const td6 = document.createElement("td");

    td1.textContent = studentDetails.id;
    td2.textContent = studentDetails.name.toUpperCase();
    td3.textContent = studentDetails.marks;
    td4.textContent = studentDetails.grade;
    td5.textContent = studentDetails.status;

    // Create delete button
    const btn = document.createElement("button");

    btn.type = "button";
    btn.classList.add("deleteButton");
    btn.textContent = "Delete";

    // Delete student from the original array
    btn.addEventListener("click", () => {
        deleteStudent(studentDetails.id);
    });

    td6.appendChild(btn);

    tr.append(
        td1,
        td2,
        td3,
        td4,
        td5,
        td6
    );

    return tr;
}

// ========================================
// 5. RENDER TABLE
// ========================================

function clearRow() {
    tBody.innerHTML = "";
}

function renderTable(array) {
    clearRow();

    array.forEach(student => {
        const tr = createTr(student);
        tBody.appendChild(tr);
    });

    // Update result count
    if (resultCount) {
        resultCount.textContent =
            `${array.length} student record${array.length === 1 ? "" : "s"}`;
    }

    // Show empty message when no results exist
    if (emptyMessage) {
        emptyMessage.style.display =
            isEmpty(array) ? "block" : "none";
    }
}

// ========================================
// 6. ADD STUDENT
// ========================================

function addNewStudent() {
    const name = nameInput.value.trim();
    const marksText = marksInput.value.trim();
    const marks = Number(marksText);

    // Validate name
    if (name === "") {
        formMessage.textContent = "Please enter a student name.";
        return;
    }

    // Validate marks
    if (
        marksText === "" ||
        !Number.isFinite(marks) ||
        marks < 0 ||
        marks > 100
    ) {
        formMessage.textContent =
            "Please enter marks between 0 and 100.";
        return;
    }

    // Create new student
    const newStudent = {
        id: ++nextId,
        name: name,
        marks: marks
    };

    // Store student
    students.push(newStudent);

    // Clear form
    nameInput.value = "";
    marksInput.value = "";

    formMessage.textContent = "Student added successfully.";

    // Refresh dashboard and table
    updateTopDashboard();
    passedCountFunction();
    updateStudentView();
}

// Listen for form submission
studentForm.addEventListener("submit", event => {
    event.preventDefault();
    addNewStudent();
});

// ========================================
// 7. DELETE STUDENT
// ========================================

function deleteStudent(id) {
    students = students.filter(student => student.id !== id);

    updateTopDashboard();
    passedCountFunction();
    updateStudentView();

    formMessage.textContent = "Student deleted successfully.";
}

// ========================================
// 8. UPDATE TOP DASHBOARD
// ========================================

function updateTopDashboard() {
    const total = students.length;

    totalStudents.textContent = total;

    // Handle empty student array
    if (total === 0) {
        averageMarks.textContent = "0";
        highestMarks.textContent = "0";
        lowestMarks.textContent = "0";

        if (topStudent) {
            topStudent.style.display = "none";
        }

        if (lowestStudent) {
            lowestStudent.style.display = "none";
        }

        return;
    }

    const marksArray = students.map(student => student.marks);

    // Calculate average
    const sum = marksArray.reduce((acc, marks) => {
        return acc + marks;
    }, 0);

    averageMarks.textContent = (sum / total).toFixed(2);

    // Highest and lowest marks
    const highest = Math.max(...marksArray);
    const lowest = Math.min(...marksArray);

    highestMarks.textContent = highest;
    lowestMarks.textContent = lowest;

    // Highest and lowest scoring student
    const bestStudent = students.find(
        student => student.marks === highest
    );

    const weakestStudent = students.find(
        student => student.marks === lowest
    );

    if (topStudent) {
        topStudent.style.display = "block";
        topStudent.textContent =
            `${bestStudent.name.toUpperCase()} (${highest})`;
    }

    if (lowestStudent) {
        lowestStudent.style.display = "block";
        lowestStudent.textContent =
            `${weakestStudent.name.toUpperCase()} (${lowest})`;
    }
}

// ========================================
// 9. SEARCH STUDENT
// ========================================

function searchStudentByInput() {
    updateStudentView();
}

searchInput.addEventListener("input", searchStudentByInput);

// ========================================
// 10. SORT STUDENTS
// ========================================

function sortingA2Z(array) {
    return [...array].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}

function sortingZ2A(array) {
    return [...array].sort((a, b) =>
        b.name.localeCompare(a.name)
    );
}

function sortingLowestToHighest(array) {
    return [...array].sort((a, b) =>
        a.marks - b.marks
    );
}

function sortingHighestToLowest(array) {
    return [...array].sort((a, b) =>
        b.marks - a.marks
    );
}

// Listen for sorting changes
sortSelect.addEventListener("change", updateStudentView);

// ========================================
// 11. FILTER STUDENTS BY GRADE
// ========================================

gradeFilter.addEventListener("change", updateStudentView);

// ========================================
// 12. COMBINED SEARCH, FILTER AND SORT
// ========================================

function updateStudentView() {
    let result = [...students];

    // Step 1: Search by name
    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    if (searchText !== "") {
        result = result.filter(student =>
            student.name.toLowerCase().includes(searchText)
        );
    }

    // Step 2: Filter by grade
    const selectedGrade = gradeFilter.value;

    if (selectedGrade !== "all") {
        result = result.filter(student =>
            Grading(student.marks) === selectedGrade
        );
    }

    // Step 3: Sort results
    const sortValue = sortSelect.value;

    switch (sortValue) {
        case "name-asc":
            result = sortingA2Z(result);
            break;

        case "name-desc":
            result = sortingZ2A(result);
            break;

        case "marks-asc":
            result = sortingLowestToHighest(result);
            break;

        case "marks-desc":
            result = sortingHighestToLowest(result);
            break;

        case "default":
        default:
            // Keep the original insertion order
            break;
    }

    // Step 4: Render final results
    renderTable(result);
}

// ========================================
// 13. PASS COUNT, FAIL COUNT AND PASS RATE
// ========================================

function passedCountFunction() {
    const total = students.length;

    const passedStudents = students.filter(student =>
        Grading(student.marks) !== "F"
    );

    const failedStudents = students.filter(student =>
        Grading(student.marks) === "F"
    );

    const passed = passedStudents.length;
    const failed = failedStudents.length;

    passedCount.textContent = passed;
    failedCount.textContent = failed;

    // Avoid division by zero
    const rate = total === 0
        ? 0
        : (passed / total) * 100;

    passRate.textContent = `${rate.toFixed(2)}%`;
}

// ========================================
// 14. CURSOR GLOW EFFECT
// ========================================

const glowElements = document.querySelectorAll(
    ".stat-card, .panel, .summary-item"
);

glowElements.forEach(element => {
    element.addEventListener("pointermove", event => {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        element.style.setProperty("--mouse-x", `${x}px`);
        element.style.setProperty("--mouse-y", `${y}px`);
    });
});

// ========================================
// 15. INITIALIZE DASHBOARD
// ========================================

function initializeDashboard() {
    updateTopDashboard();
    passedCountFunction();
    updateStudentView();
}

initializeDashboard();
