function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Make a POST request to the server for authentication
    fetch('/signup_or_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            // Redirect to HOMEpage.html if authentication succeeds
            window.location.href = '/HOMEpage.html';
        } else {
            // Display error message if authentication fails
            alert("Invalid username or password");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
}
