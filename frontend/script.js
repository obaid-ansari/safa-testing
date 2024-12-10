document.addEventListener("DOMContentLoaded", () => {
  // Function to initialize the navigation menu
  function initializeNavMenu() {
    const burger = document.getElementById("burger");
    const navLinks = document.getElementById("nav-links");
    const navLinkItems = document.querySelectorAll("#nav-links a");
    const hajjUmrahLink = document.getElementById("hajj-umrah");
    const hajjUmrahSubList = document.querySelector(".hajj-umrah");
    const subListItems = hajjUmrahSubList.querySelectorAll("li");

    // Toggle menu visibility when the burger icon is clicked
    burger.addEventListener("click", () => {
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none"; // Close menu
        hajjUmrahSubList.style.display = "none"; // Close sub-list when menu closes
      } else {
        navLinks.style.display = "flex"; // Open menu
      }
    });

// Toggle sub-list visibility when "Hajj & Umrah" is clicked
hajjUmrahLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default link behavior
  const isSubListVisible = hajjUmrahSubList.style.display === "block";
  hajjUmrahSubList.style.display = isSubListVisible ? "none" : "block"; // Toggle sub-list
  // Store the state in the browser's history
  history.pushState({ subListVisible: !isSubListVisible }, "");
});

    // Close menu when a nav link is clicked, except for "Hajj & Umrah"
    navLinkItems.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && link !== hajjUmrahLink) {
          // Apply only in phone/tablet view and not for "Hajj & Umrah"
          navLinks.style.display = "none";
          hajjUmrahSubList.style.display = "none"; // Close sub-list when menu closes
        }
      });
    });

    // Prevent closing the main nav when clicking on sub-list items
    subListItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up to the nav links
        navLinks.style.display = "none"; // Close the main navigation
        hajjUmrahSubList.style.display = "none"; // Close the sub-list
      });
    });

    // Close the navbar when clicking outside of it
    document.addEventListener("click", (event) => {
      const isClickInsideNav =
        navLinks.contains(event.target) || burger.contains(event.target);

      // Check if the click is outside the nav links and the burger
      if (!isClickInsideNav && window.innerWidth <= 768) {
        navLinks.style.display = "none"; // Close the main navigation
        hajjUmrahSubList.style.display = "none"; // Close the sub-list
      }
    });
  }

  // Initialize the navigation menu on DOMContentLoaded
  initializeNavMenu();

// Re-initialize the navigation menu when the user navigates back or forward
window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (state && state.subListVisible) {
    hajjUmrahSubList.style.display = "block";
  } else {
    hajjUmrahSubList.style.display = "none";
  }
  initializeNavMenu();
});

  // Add event listener to the logo to reload the page
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => {
      location.reload();
    });
  }
});
// Array of background images
const images = [
  "https://cdn.jsdelivr.net/gh/t1m0thyj/WDD-website@gh-pages/images/previews/Coast_day.jpg",
  "https://cdn.jsdelivr.net/gh/t1m0thyj/WDD-website@gh-pages/images/previews/cyberpunk_night.jpg",
  "https://cdn.jsdelivr.net/gh/t1m0thyj/WDD-website@gh-pages/images/thumbnails/24hr-Tahoe-Mix_day.png",
  "https://images.squarespace-cdn.com/content/v1/535b1632e4b0ab57db46e48b/1571362181927-KQ1GMNX5GL11RCFCBO7Z/06.jpg?format=750w",
  "https://cdn.jsdelivr.net/gh/t1m0thyj/WDD-website@gh-pages/images/previews/Coastline_night.jpg",
];

// Current image index
let currentIndex = 0;

// Function to change the background image
function changeBackgroundImage() {
  const hero = document.getElementById("hero"); // Ensure 'hero' is properly selected
  if (hero) {
    hero.style.backgroundImage = `url(${images[currentIndex]})`; // Correct syntax with template literals
    currentIndex = (currentIndex + 1) % images.length; // Cycle through images
  }
}

// Change the background image every 5 seconds
setInterval(changeBackgroundImage, 5000);
