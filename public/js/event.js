let baseURL = "http://localhost:3002";

//buttons functionalities
document.addEventListener("DOMContentLoaded", () => {
  const eventContainer = document.getElementById("event-container");
  document.getElementById("btn-event").addEventListener("click", () => {
    eventContainer.classList.toggle("visible");
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    if (eventContainer.classList.contains("visible")) {
      eventContainer.classList.remove("visible");
    }
  });
});

//Get event upto 10 rows
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("event-table-body");
  let fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3002/admin/sendEvent");
      const data = await response.json();

      if (data.events && Array.isArray(data.events)) {
        renderTableRows(data.events.slice(0, 10));
      } else {
        console.error("No event data found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error);
      return [];
    }
  };

  const renderTableRows = (events) => {
    events.forEach((event) => {
      const row = document.createElement("tr");
      const formattedTimeStarting = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(new Date(event.timeBegin));

      const formattedTimeEnding = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(new Date(event.timeEnd));
      row.innerHTML = `
      
      <td style="display: none;">${event._id}</td>
        <td>${event.title}</td>
        <td>${event.location}</td>
        <td>${event.description}</td>
        <td>${formattedTimeStarting}</td>
        <td>${formattedTimeEnding}</td>
        <td>${event.startingSchoolYear} - ${event.endingSchoolYear} </td>
        <td><button class="btn-edit mb-1">Edit</button>
        <button class="btn-delete mb-1">Delete</button>
        <button type="button" class="btn btn-outline-success btn-attendance" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
        Attendance
        </button>
        </td>
      `;
      ``;
      tableBody.appendChild(row);
    });
  };

  fetchData();
});

//creating event
document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("event");
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(eventForm);

    const eventData = Object.fromEntries(formData.entries());
    const notifBar = document.getElementById("alert-check");

    try {
      const response = await fetch("http://localhost:3002/admin/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        eventForm.reset();
        const tableBody = document.querySelector("table tbody");

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${data.title}</td>
        <td>${data.location}</td>
        <td>${data.description}</td>
        <td>${data.timeBegin}</td>
        <td>${data.timeEnd}</td>
        <td>${data.startingSchoolYear} - ${data.endingSchoolYear}</td>
        <td>
        <button class="btn-edit mb-1">Edit</button>
        <button class="btn-delete mb-1">Delete</button>
        <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
        Attendance
        </button>
        </td>`;

        if (tableBody.firstChild) {
          tableBody.insertBefore(row, tableBody.firstChild);
        } else {
          tableBody.appendChild(row);
        }

        if (tableBody.childElementCount > 10) {
          tableBody.removeChild(tableBody.lastChild);
        }

        if (
          notifBar.classList.contains("d-none") ||
          notifBar.classList.contains("alert-danger") ||
          notifBar.classList.contains("alert-warning")
        ) {
          notifBar.classList.remove("d-none");
          notifBar.classList.remove("alert-danger");
          notifBar.classList.remove("alert-warning");
          notifBar.classList.add("alert-success");
          notifBar.innerHTML = `<p>${data.message}</p>`;
        } else {
          notifBar.classList.add("alert-success");
          notifBar.innerHTML = `<p>${data.message}</p>`;
        }
      } else {
        if (
          notifBar.classList.contains("d-none") ||
          notifBar.classList.contains("alert-success")
        ) {
          notifBar.classList.remove("d-none");
          notifBar.classList.remove("alert-success");
          notifBar.classList.add("alert-warning");
          notifBar.innerHTML = `<p>${data.message}</p>`;
        } else {
          notifBar.classList.add("alert-warning");
          notifBar.innerHTML = `<p>${data.message}</p>`;
        }
      }
    } catch (error) {
      console.error(error);
      if (
        notifBar.classList.contains("d-none") ||
        notifBar.classList.contains("alert-success") ||
        notifBar.classList.contains("alert-warning")
      ) {
        notifBar.classList.remove("d-none");
        notifBar.classList.remove("alert-success");
        notifBar.classList.remove("alert-warning");
        notifBar.classList.add("alert-danger");
        notifBar.innerHTML = `<p>${data.message}</p>`;
      } else {
        notifBar.classList.add("alert-danger");
        notifBar.innerHTML = `<p>${data.message}</p>`;
      }
    }
  });
});

// //button that delete events
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("table tbody");
  tableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const row = e.target.closest("tr");
      if (row) {
        const id = row.querySelector("td:first-child").innerText;
        const eventTitle = row.querySelector("td:nth-child(2)").innerText;

        const isConfirmed = window.confirm(`Confirm Delete ${eventTitle}`);

        if (isConfirmed) {
          console.log("Deleting event with ID:", id);

          try {
            const response = await fetch(
              `http://localhost:3002/admin/event/delete/${id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Unable to reach server");
            }

            const data = await response.json();
            console.log("Delete response:", data);
            row.remove();
            // Additional logic if needed
          } catch (error) {
            console.error("Error fetching or deleting:", error);

            const errorAlert = document.getElementById("alert-error");
            errorAlert.innerText = error.message;
            errorAlert.classList.remove("d-none");
            // Additional error handling or UI updates
          }
        }
      }
    }
  });
});

//fetch the clicked event
document.addEventListener("DOMContentLoaded", () => {
  //Display attendees
  const tableBody = document.getElementById("event-table-body");
  const tableBodyRfid = document.getElementById("rfid-table-body");
  tableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-attendance")) {
      const row = e.target.closest("tr");
      if (row) {
        const evntId = row.querySelector("td:first-child").innerText;
        try {
          const response = await fetch(
            `${baseURL}/admin/event/attendees/${evntId}`
          );
          const data = await response.json();

          const evntTitle = data.title;
          const strtSchoolYear = data.startingSchoolYear;
          const endSchoolYear = data.endingSchoolYear;
          const beginTime = data.timeBegin;
          const endTime = data.timeEnd;

          const formattedBeginTime = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            timeZone: "UTC",
          }).format(new Date(beginTime));

          const formattedEndTime = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            timeZone: "UTC",
          }).format(new Date(endTime));

          document.querySelector(
            ".modal-title"
          ).innerHTML = `${evntTitle} SY: ${strtSchoolYear} - ${endSchoolYear}`;

          document.querySelector(
            ".modal-event-id"
          ).innerHTML = `Event ID: <p id="event-id">${evntId}</p>`;

          document.querySelector(
            ".modal-description"
          ).innerHTML = `${formattedBeginTime} to ${formattedEndTime}`;

          if (data.attendees) {
            const attendeesArray = data.attendees.slice(0, 10);

            tableBodyRfid.innerHTML = "";

            attendeesArray.forEach((attendee) => {
              const studentName = attendee.studentName;
              const year = attendee.year;
              const course = attendee.course;
              const department = attendee.department;
              const status = attendee.status;
              const timeIn = attendee.timeIn;

              const formattedTimeIn = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Manila",
              }).format(new Date(timeIn));

              const attendeeRow = document.createElement("tr");
              attendeeRow.innerHTML = `<td>${studentName}</td>
              <td>${year}</td>
              <td>${course}</td>
              <td>${department}</td>
              <td>${status}</td>
              <td>${formattedTimeIn}</td>
              <td>--</td>
              `;

              tableBodyRfid.append(attendeeRow);
            });

            // Wait for the modal to be fully shown before setting focus
            $("#fullScreenModal").on("shown.bs.modal", function () {
              document.getElementById("rfid").focus();
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  //time in
  document.getElementById("rfid-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventAttendanceId = document.getElementById("event-id").innerText;
    const attendeeRfid = document.getElementById("rfid").value;

    try {
      const response = await fetch(
        `${baseURL}/admin/event/attendees/timeIn/${eventAttendanceId}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ rfid: attendeeRfid }),
        }
      );

      const data = await response.json();

      //dynamically render new attendee time in
      if (data.success) {
        const cardRfid = document.getElementById("rfid-form");
        cardRfid.reset();
        cardRfid.focus();
        const row = document.createElement("tr");

        const formattedTimeIn = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        }).format(new Date(data.timeIn));

        row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.year}</td>
        <td>${data.course}</td>
        <td>${data.department}</td>
        <td>${data.status}</td>
        <td>${formattedTimeIn}</td>
        <td>--</td>
        `;

        //success alert
        const alertBox = document.querySelector(".alert-container");
        if (alertBox.classList.contains("alert-warning")) {
          alertBox.classList.remove("alert-warning");
          alertBox.classList.add("alert-success");
          alertBox.innerHTML = `<span id="alert-span"
          ><i class="fa-regular fa-face-laugh-beam me-2"></i>
          <h6 id="text-alert">
            <span id="alert-name">${data.name}</span> was Added!
          </h6></span
        >`;
        } else {
          alertBox.classList.add("alert-success");
          alertBox.innerHTML = `<span id="alert-span"
          ><i class="fa-regular fa-face-laugh-beam me-2"></i>
          <h6 id="text-alert">
            <span id="alert-name"><b>${data.name}</b></span> was Added!
          </h6></span
        >`;
        }

        //insert the new attendee to first row
        if (tableBodyRfid.firstChild) {
          tableBodyRfid.insertBefore(row, tableBodyRfid.firstChild);
        } else {
          tableBodyRfid.appendChild(row);
        }
        if (tableBodyRfid.childElementCount > 10) {
          tableBodyRfid.removeChild(tableBodyRfid.lastChild);
        }
        setTimeout(() => {
          alertBox.innerHTML = "";
          alertBox.classList.remove("alert-success");
        }, 3500);
      } else if (!data.success) {
        //rfid invalid alert
        const alertBox = document.querySelector(".alert-container");
        alertBox.innerHTML = "";
        if (alertBox.classList.contains("alert-success")) {
          alertBox.classList.remove("alert-succes");
          alertBox.classList.add("alert-warning");
          alertBox.innerHTML = `<span id="alert-span"
          ><i class="fa-regular fa-face-sad-tear me-2"></i>
          <h6 id="text-alert">
            RFID was not recognized
          </h6></span
        >`;
        } else {
          alertBox.classList.add("alert-warning");
          alertBox.innerHTML = `<span id="alert-span"
          ><i class="fa-regular fa-face-sad-tear me-2"></i>
          <h6 id="text-alert">
            RFID was not recognized
          </h6></span
        >`;
        }
        const cardRfid = document.getElementById("rfid-form");
        cardRfid.reset();
        cardRfid.focus();

        setTimeout(() => {
          alertBox.innerHTML = "";
          alertBox.classList.remove("alert-warning");
        }, 3500);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error, please see console");
    }
  });
});
