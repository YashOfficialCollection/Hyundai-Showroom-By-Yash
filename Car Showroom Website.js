// script.js

// Handle dealer form submission
document.getElementById('dealer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location').value;
    alert(`Finding dealers near: ${location}...`); // Implement Google Maps functionality here
    // Here you can add code to integrate Google Maps API to show dealer locations
});

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    alert(`Thank you, ${name}. We have received your message!`); // Here you can implement an actual form submission
});

