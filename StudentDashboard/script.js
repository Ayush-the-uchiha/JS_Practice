
"use strict";

// ========================================
// 1. DATA
// ========================================

let students = [
    { id: 1, name: "Aarav Sharma", marks: 85 },
    { id: 2, name: "Priya Singh", marks: 92 },
    { id: 3, name: "Rahul Verma", marks: 29 },
    { id: 4, name: "Ananya Gupta", marks: 68 },
    { id: 5, name: "Rohan Kumar", marks: 45 }
];

let nextId = 6;

// ========================================
// 2. SELECT HTML ELEMENTS
// ========================================

const studentForm = document.querySelector("#student-form");
const nameInput = document.querySelector("#student-name");
const marksInput = document.querySelector("#student-marks");
const studentList = document.querySelector("#student-list");

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
// 3. GRADE AND PASS/FAIL FUNCTIONS
// ========================================

// Grading scale:
// A: 90-100
// B: 75-89
// C: 60-74
// D: 33-59
// F: 0-32

function getGrade(marks) {
    if (marks >= 90) return "A";
    if (marks >= 75) return "B";
    if (marks >= 60) return "C";
    if (marks >= 33) return "D";
    return "F";
}

function getStatus(marks) {
    return marks >= 33 ? "Pass" : "Fail";
}

// ========================================
// 4. ADD STUDENT
// ========================================

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const marks = Number(marksInput.value);

    if (!name) {
        showMessage("Please enter a student name.", true);
        return;
    }

    if (
        marksInput.value.trim() === "" ||
        !Number.isFinite(marks) ||
        marks < 0 ||
        marks > 100 ||
        !Number.isInteger(marks)
    ) {
        showMessage("Enter whole-number marks from 0 to 100.", true);
        return;
    }

    const student = {
        id: nextId++,
        name: name,
        marks: marks
    };

    students.push(student);

    studentForm.reset();
    showMessage("Student added successfully!");
    refreshDashboard();
    nameInput.focus();
});

// ========================================
// 5. DISPLAY STUDENTS
// ========================================

function renderStudents(list) {
    studentList.replaceChildren();

    list.forEach(function (student) {
        const row = document.createElement("tr");

        // ID
        const idCell = document.createElement("td");
        idCell.textContent = student.id;

        // Name
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        // Marks
        const marksCell = document.createElement("td");
        marksCell.textContent = student.marks + "/100";

        // Grade
        const gradeCell = document.createElement("td");
        const gradeBadge = document.createElement("span");

        gradeBadge.classList.add("grade", "grade-" + getGrade(student.marks));
        gradeBadge.textContent = getGrade(student.marks);
        gradeCell.appendChild(gradeBadge);

        // Pass / Fail
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        const status = getStatus(student.marks);

        statusBadge.classList.add(
            "status-badge",
            status === "Pass" ? "status-pass" : "status-fail"
        );

        statusBadge.textContent = status;
        statusCell.appendChild(statusBadge);

        // Delete button
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = student.id;
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + student.name
        );

        actionCell.appendChild(deleteButton);

        row.append(
            idCell,
            nameCell,
            marksCell,
            gradeCell,
            statusCell,
            actionCell
        );

        studentList.appendChild(row);
    });

    emptyMessage.hidden = list.length !== 0;

    resultCount.textContent =
        list.length + (list.length === 1 ? " record" : " records");
}

// ========================================
// 6. DELETE STUDENT
// ========================================

// Event delegation: one listener handles all delete buttons.

studentList.addEventListener("click", function (event) {
    const button = event.target.closest(".delete-btn");

    if (!button || !studentList.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);

    students = students.filter(function (student) {
        return student.id !== id;
    });

    refreshDashboard();
    showMessage("Student deleted successfully.");
});

// ========================================
// 7. SEARCH STUDENT
// ========================================

function searchStudents(query) {
    return students.filter(function (student) {
        return student.name
            .toLowerCase()
            .includes(query.trim().toLowerCase());
    });
}

// ========================================
// 8. SORT STUDENTS
// ========================================

function sortStudents(list, sortBy) {
    // Copy the array so the original order is preserved.

    const sorted = [...list];

    switch (sortBy) {
        case "name-asc":
            return sorted.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

        case "name-desc":
            return sorted.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });

        case "marks-asc":
            return sorted.sort(function (a, b) {
                return a.marks - b.marks;
            });

        case "marks-desc":
            return sorted.sort(function (a, b) {
                return b.marks - a.marks;
            });

        default:
            return sorted.sort(function (a, b) {
                return a.id - b.id;
            });
    }
}

// ========================================
// 9. FILTER BY GRADE
// ========================================

function filterByGrade(list, grade) {
    if (grade === "all") {
        return list;
    }

    return list.filter(function (student) {
        return getGrade(student.marks) === grade;
    });
}

// ========================================
// 10. CALCULATE STATISTICS
// ========================================

function updateStatistics() {
    const total = students.length;

    totalStudents.textContent = total;

    if (total === 0) {
        averageMarks.textContent = "0";
        highestMarks.textContent = "—";
        lowestMarks.textContent = "—";
        topStudent.textContent = "No students yet";
        lowestStudent.textContent = "No students yet";
        passedCount.textContent = "0";
        failedCount.textContent = "0";
        passRate.textContent = "0%";
        return;
    }

    // Average using reduce()
    const totalMarks = students.reduce(function (sum, student) {
        return sum + student.marks;
    }, 0);

    const average = totalMarks / total;
    averageMarks.textContent = average.toFixed(2);

    // Highest and lowest marks
    const highest = students.reduce(function (best, student) {
        return student.marks > best.marks ? student : best;
    });

    const lowest = students.reduce(function (worst, student) {
        return student.marks < worst.marks ? student : worst;
    });

    highestMarks.textContent = highest.marks;
    topStudent.textContent = highest.name;

    lowestMarks.textContent = lowest.marks;
    lowestStudent.textContent = lowest.name;

    // Pass / Fail counts
    const passed = students.filter(function (student) {
        return getStatus(student.marks) === "Pass";
    }).length;

    const failed = total - passed;

    passedCount.textContent = passed;
    failedCount.textContent = failed;
    passRate.textContent = ((passed / total) * 100).toFixed(1) + "%";
}

// ========================================
// 11. REFRESH THE DASHBOARD
// ========================================

function refreshDashboard() {
    const query = searchInput.value;
    const selectedGrade = gradeFilter.value;
    const selectedSort = sortSelect.value;

    let visibleStudents = searchStudents(query);

    visibleStudents = filterByGrade(
        visibleStudents,
        selectedGrade
    );

    visibleStudents = sortStudents(
        visibleStudents,
        selectedSort
    );

    renderStudents(visibleStudents);
    updateStatistics();
}

// ========================================
// 12. FORM MESSAGE
// ========================================

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.classList.toggle("error", isError);
}

// ========================================
// 13. EVENT LISTENERS
// ========================================

searchInput.addEventListener("input", refreshDashboard);
sortSelect.addEventListener("change", refreshDashboard);
gradeFilter.addEventListener("change", refreshDashboard);

// ========================================
// 14. INITIAL RENDER
// ========================================

refreshDashboard();
