//For RFID record
document.addEventListener("DOMContentLoaded", async () => {
  const startRecordBut = document.getElementById("record-attendance");
  const formContainer = document.getElementById("rfid-container");
  const rfidInput = document.getElementById("rfid-input");

  startRecordBut.addEventListener("click", async () => {
    formContainer.classList.toggle("hidden");
    formContainer.classList.toggle("visible");

    if (formContainer.classList.contains("visible")) {
      rfidInput.focus();
    }
  });

  const attendanceForm = document.getElementById("attendance-form");

  //submitting attendance function
  attendanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    //transform value put by user in to object, rfid:value
    const formRfid = new FormData(attendanceForm);

    const rfidData = Object.fromEntries(formRfid.entries());
    const success = document.getElementById("success");
    const fail = document.getElementById("fail");

    const isFormVisible = formContainer.classList.contains("visible");

    if (isFormVisible) {
      rfidInput.focus();
    }

    try {
      //sending the data to server
      const res = await fetch(
        "http://localhost:3002/students/record-attendance",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(rfidData),
        }
      );

      const responseRfidData = await res.json();
      console.log("Server Response", responseRfidData);

      if (responseRfidData.success) {
        console.log("Success!");

        const row = document.createElement("tr");
        const attendanceTableBody = document.querySelector("table tbody");

        row.innerHTML = `
        <td>${responseRfidData.studFullname}</td>
        <td>${responseRfidData.year}</td>
        <td>${responseRfidData.course}</td>
        <td>${responseRfidData.department}</td>
        <td>${responseRfidData.present}</td>
        <td>${responseRfidData.timeIn}</td>
        <td>${responseRfidData.schoolYear}</td>
        <td>--</td>`;

        attendanceTableBody.appendChild(row);

        success.classList.add("visible");
        fail.classList.remove("visible");
        success.innerHTML = `Welcome<br>${responseRfidData.studFullname}`;
        rfidInput.value = "";
        rfidInput.focus();
        setTimeout(function () {
          success.classList.remove("visible");
        }, 8000);
      } else {
        console.log("RFID tag doesnt recognized or duplicate.");
        success.classList.remove("visible");
        fail.classList.add("visible");

        //remove fail visible in 3 seconds
        setTimeout(function () {
          fail.classList.remove("visible");
        }, 8000);

        rfidInput.value = "";
        rfidInput.focus();
      }
    } catch (error) {
      console.error("Server can't reach", error);
      alert("Server Error");
    }
  });
});

//for student's attendance render
document.addEventListener("DOMContentLoaded", async () => {
  const attendanceTableBody = document.querySelector("table tbody");
  const errorRendering = document.getElementById("error-table-render");
  async function renderAttendance() {
    try {
      const res = await fetch(
        "http://localhost:3002/students/attendances/show"
      );
      const data = await res.json();

      if (data.attendance && Array.isArray(data.attendance)) {
        showDataToRows(data.attendance.slice(0, 10));
      } else {
        console.error("No Students found");
        errorRendering.classList.remove("hidden");
        errorRendering.innerHTML = `Error: Students not found`;
      }
    } catch (error) {
      console.error("Server Cannot reach as of the moment", error);
      alert(error);
      return [];
    }
  }

  const showDataToRows = (attendances) => {
    attendances.forEach((attendance) => {
      const row = document.createElement("tr");

      const formattedTimeIn = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(attendance.timeIn));

      row.innerHTML = `
                <td>${attendance.studFullname}</td>
                <td>${attendance.year}</td>
                <td>${attendance.course}</td>
                <td>${attendance.department}</td>
                <td>${attendance.present}</td>
                <td>${formattedTimeIn}</td>
                <td>--</td>
            `;
      attendanceTableBody.appendChild(row);
    });
  };

  renderAttendance();
});
