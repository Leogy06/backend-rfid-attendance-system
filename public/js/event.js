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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      }).format(new Date(event.timeBegin));

      const formattedTimeEnding = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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
    const tables = document.querySelector("table tbody");

    const eventData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3002/admin/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        eventForm.reset();
        document.getElementById("alert-check").innerHTML = `
        <h4>${data.message}</h4>`;
        var row = tables.inserRow(tables.row.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);

        cell1.insertHTML = `${data.title}`;
        cell2.insertHTML = `${data.location}`;
        cell3.insertHTML = `${data.startingSchoolYear}`;
        cell4.insertHTML = `${data.endingSchoolYear}`;
        cell5.insertHTML = `${data.timeBegin}`;
        cell6.insertHTML = `${data.timeEnd}`;
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      document.getElementById("alert-check").innerText =
        "Server error, Unable to create event.";
    }
  });
});
