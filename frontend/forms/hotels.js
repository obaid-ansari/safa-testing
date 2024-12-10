document
  .getElementById("hotelForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      location: document.getElementById("location").value,
      checkIn: document.getElementById("checkIn").value,
      checkOut: document.getElementById("checkOut").value,
      rooms: document.getElementById("rooms").value,
      guests: document.getElementById("guests").value,
    };

    fetch("/https://safa-testing-backend.onrender.com/hotels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Booking submitted successfully!");
        console.log(data);
        document.getElementById("hotelForm").reset(); // Reset form after submission
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error submitting your booking.");
      });
  });
