document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("flightBookingForm");
  const journeyType = document.getElementById("journeyType");
  const returnDateGroup = document.getElementById("returnDateGroup");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");
  const infants = document.getElementById("infants");
  const dobContainer = document.getElementById("dobContainer");

  // Journey Type Change Handler
  journeyType.addEventListener("change", function () {
    if (this.value === "return") {
      returnDateGroup.style.display = "block";
      returnDateGroup.querySelector("input").required = true;
    } else {
      returnDateGroup.style.display = "none";
      returnDateGroup.querySelector("input").required = false;
    }
  });

  // Passenger Count Change Handler
  function updateDOBFields() {
    const totalAdults = parseInt(adults.value) || 0;
    const totalChildren = parseInt(children.value) || 0;
    const totalInfants = parseInt(infants.value) || 0;
    const total = totalAdults + totalChildren + totalInfants;

    if (total > 9) {
      alert("Maximum 9 passengers allowed in total");
      return false;
    }

    if (totalInfants > totalAdults) {
      alert("Number of infants cannot exceed number of adults");
      return false;
    }

    // Clear existing DOB fields
    dobContainer.innerHTML = "";

    // Add DOB fields for children
    for (let i = 0; i < totalChildren; i++) {
      addDOBField("child", i + 1);
    }

    // Add DOB fields for infants
    for (let i = 0; i < totalInfants; i++) {
      addDOBField("infant", i + 1);
    }

    return true;
  }

  function addDOBField(type, index) {
    const div = document.createElement("div");
    div.className = "dob-field";
    div.innerHTML = `
          <label for="${type}Dob${index}">Date of Birth - ${
      type.charAt(0).toUpperCase() + type.slice(1)
    } ${index}*</label>
          <input type="date" id="${type}Dob${index}" name="${type}Dob${index}" required>
      `;
    dobContainer.appendChild(div);
  }

  adults.addEventListener("change", updateDOBFields);
  children.addEventListener("change", updateDOBFields);
  infants.addEventListener("change", updateDOBFields);

  // Form Submit Handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // No need to call updateDOBFields here, as it should already be updated
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Booking submitted successfully!");
        form.reset();
        dobContainer.innerHTML = ""; // Clear DOB fields after submission
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert("An error occurred while submitting the booking");
      console.error("Error:", error);
    }
  });

  // Set min date for departure and return date
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("departureDate").min = today;
  document.getElementById("returnDate").min = today;

  // Initialize DOB fields for default adult
  updateDOBFields();
});
