// ================================
// HOME SECURITY LOGIN
// ================================

// Demo login credentials
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";


// Get elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");


// ================================
// SHOW / HIDE PASSWORD
// ================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "👁️";
    }

});


// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // Clear previous message
    loginMessage.textContent = "";
    loginMessage.className = "login-message";


    // Check credentials
    if (
        username === VALID_USERNAME &&
        password === VALID_PASSWORD
    ) {

        loginMessage.textContent =
            "Login successful! Opening dashboard...";

        loginMessage.classList.add("success");


        // Small delay before dashboard
        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 800);


    } else {

        loginMessage.textContent =
            "Invalid username or password.";

        loginMessage.classList.add("error");


        passwordInput.value = "";

        passwordInput.focus();
    }

});
