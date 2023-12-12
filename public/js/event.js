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

//fetching event to database
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("table tbody");
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
        <td><button class="btn-edit mb-1">Edit</button><button class="btn-delete mb-1">Delete</button><button class="btn-attendance">Attendance</button></td>
      `;
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
        <td><button class="btn-edit mb-1">Edit</button><button class="btn-delete mb-1">Delete</button><button class="btn-attendance">Attendance</button></td>`;

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
          notifBar.classList.contains("alert-danger")
        ) {
          notifBar.classList.remove("d-none");
          notifBar.classList.remove("alert-danger");
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
