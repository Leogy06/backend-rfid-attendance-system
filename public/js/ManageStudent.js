//GET
const tableBody = document.querySelector("table tbody");
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:3002/students");
    const data = await response.json();

    if (data.students && Array.isArray(data.students)) {
      renderTableRows(data.students.slice(0, 10));
    } else {
      console.error("No student data found");
      return[]
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(error)
    return[]
  }
};

const renderTableRows = (students) => {
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    
    <td style="display: none;">${student._id}</td>
      <td>${index + 1}</td>
      <td>${getFullName(student)}</td>
      <td>${student.year}</td>
      <td>${student.course}</td>
      <td>${student.department}</td>
      <td>${student.rfid}</td>
      <td><button class="btn-edit">Edit</button><button class="btn-delete">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
};                                                                                                          

const getFullName = (student) => {
  const { firstName, middleName, lastName, suffix } = student;
  return `${firstName} ${middleName || ""} ${lastName} ${suffix || ""}`.trim();
};



//DELETE
// Event delegation for delete buttons
document.addEventListener("DOMContentLoaded", () => {
  tableBody.addEventListener("click", async(event) => {
    if (event.target.classList.contains("btn-delete")) {
     const row = event.target.closest("tr");
  
     if(row){
      const studentId = row.querySelector("td:first-child").innerText;
      const studentName = row.querySelector("td:nth-child(3)").innerText;
  
      const isConfirmed = window.confirm(`Delete Student ${studentName}?`);
      if (isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3002/students/delete/${studentId}`,{method: "DELETE"});
          if (response.ok) {
            alert(`${studentName} was deleted.`);
            row.remove();
          } else {
            alert(`Cannot Delete student with id ${studentId}`);
          }
        } catch (error) {
          console.error("Error", error);
          alert(error);
        }
      }
      
     }
  
    }
  });
});



//POST
// Function to open create student form
 function createStudent() {
    document.getElementById('overlay').style.display = "flex";
}
// Function to close create student form
 function closeForm() {
   document.getElementById('overlay').style.display = "none";
}

//capitalize first letter fname, mname,lastname
function capitalizeNames (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//capital all department and year
function capitalizeAll (str) {
  return str.toUpperCase();
}

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to the HTML elements
  const studentForm = document.getElementById('create-form'); // Reference to the user input form
  const password = document.getElementById('password');
  const passwordMatch = document.getElementById('password-match');

  // Add a submit event listener to the user input form
  studentForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior to handle it with JavaScript
    event.preventDefault();

    if (password.value === passwordMatch.value) {
      
      password.classList.remove("password-match");
      passwordMatch.classList.remove("password-match");

    } else {
      password.classList.add("password-mismatch");
      passwordMatch.classList.add("password-mismatch");
      alert("Password does not match or Empty")
      return; // Stop further execution if passwords do not match
    }

    // Get form data using FormData API
    const formData = new FormData(studentForm);

    // Convert FormData to a plain JavaScript object
    const userData = Object.fromEntries(formData.entries());

    userData.firstName = capitalizeNames(userData.firstName);
    userData.lastName = capitalizeNames(userData.lastName);
    userData.suffix = capitalizeNames(userData.suffix) || "";
    userData.middleName = capitalizeNames(userData.middleName) || "";
    
    userData.course = capitalizeAll(userData.course);
    userData.department = capitalizeAll(userData.department);
    

    try {
      // Send data to the server
      const response = await fetch('http://localhost:3002/students/register', {
        method: 'POST', // Use the HTTP POST method to send data to the server
        headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
        body: JSON.stringify(userData), // Convert the user data to JSON format and send it in the request body
      });

      // Parse the server response as JSON
      const data = await response.json();

      // Display success or error message to the user
      if (data.success) {
        alert("Student added!");
        
        password.classList.remove("password-match");
        passwordMatch.classList.remove("password-match");
        studentForm.reset(); // Reset the form fields after successful submission
        
      } else {
        alert(`Error: ${data.message}`); // Display error message from the server
      }
    } catch (error) {
      // Log error to the console
      console.error('Error creating user:', error);
      alert("Error creating user");
    }
  });
});



//PUT
function createStudentUpdate() {
  document.getElementById('overlay-update').style.display = "flex";
}

// Function to close create student form
function closeFormUpdate() {
 document.getElementById('overlay-update').style.display = "none";
}


document.addEventListener('DOMContentLoaded', () => {
const tableBody = document.querySelector("table tbody");

tableBody.addEventListener("click", async(event) => {
  if(event.target.classList.contains("btn-edit")){

    const row = event.target.closest("tr");

    const student_id = row.querySelector("td:first-child").innerText;
    const updateForm = document.getElementById('update-form');

    createStudentUpdate();

  // Add a submit event listener to the update form
  updateForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior to handle it with JavaScript
    event.preventDefault();
    
    // Get form data using FormData API
    const formData = new FormData(updateForm);

    // Convert FormData to a plain JavaScript object
    const updatedData = Object.fromEntries(formData.entries());

    //filtering keys that has no value
    const nonEmptyData = {};
    for(const key in updatedData){
      if (updatedData[key] !== ''){
        nonEmptyData[key] = updatedData[key]
      }
    }
    try {

      // Send the updated data to the server
      const response = await fetch(`http://localhost:3002/students/modify/${student_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nonEmptyData),
      });

      // Parse the server response as JSON
      const data = await response.json();

      // Display success or error message to the user
      if (data.message) {
        alert(data.message);
        // Optionally, close the update form or perform other actions
      } else {
        alert('Error updating student cant update');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    }
  });
  }
}) 
});

//search bar function
document.addEventListener('DOMContentLoaded', () => {
  const bodyTable = document.querySelector('table tbody');
  const searchInput = document.getElementById('searchInput');
  let students = [];

  const getFullName = (student) => {
    const { firstName, middleName, lastName, suffix } = student;
    return `${firstName} ${middleName} ${lastName} ${suffix || ''}`.trim();
  };

  const renderTable = (students) => {
     // Clear previous table content
     bodyTable.innerHTML='';
    students.forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="display: none;">${student._id}</td>
        <td>${index + 1}</td>
        <td>${getFullName(student)}</td>
        <td>${student.year}</td>
        <td>${student.course}</td>
        <td>${student.department}</td>
        <td>${student.rfid}</td>
        <td><button class="btn-edit">Edit</button><button class="btn-delete">Delete</button></td>
      `;
      bodyTable.appendChild(row);
    });

  };

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    
//always put searchable type of data which is only string like names 
      const filteredStudents = students.slice(0, 10).filter((student) => {
      const fullName = getFullName(student).toLowerCase();
      const course = student.course.toLowerCase();
      const department = student.department.toLowerCase();

      return (
      fullName.includes(value) || 
      course.includes(value)||
      department.includes(value)
      );

    });
    renderTable(filteredStudents);
  });

  // Fetch and render initial data
  fetch('http://localhost:3002/students')
    .then((res) => res.json())
    .then((data) => {
      students = data.students;
    })
    .catch((error) => {
      console.error("Error Fetching data", error);
      alert(error)
    })
});

fetchData();