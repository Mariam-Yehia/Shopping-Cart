// Show Notification Function
function showNotification(messages, type = "success", autoDismiss = true) {
    let notification = document.getElementById("notification");

    // Remove existing notification before creating a new one
    if (notification) {
        notification.remove();
    }

    // Define background colors
    const colors = {
        success: "bg-success",
        error: "bg-danger",
        warning: "bg-warning",
    };

    // Create notification element
    notification = document.createElement("div");
    notification.id = "notification";
    notification.className = `position-fixed top-0 end-0 mt-3 me-3 p-3 rounded-lg shadow-lg text-white ${colors[type]}`;
    notification.style.zIndex = "1050";
    notification.style.maxWidth = "300px";

    // Set messages
    const messageContainer = document.createElement("div");
    messageContainer.innerHTML = messages.join('<br>');
    notification.appendChild(messageContainer);

    document.body.appendChild(notification);

    // Auto dismiss notifications (except for error)
    if (autoDismiss && type !== "error") {
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Real-time password validation
document.getElementById("password")?.addEventListener("input", (e) => {
    const passwordStrength = document.getElementById("passwordStrength");
    const passwordRules = isStrongPassword(e.target.value);
    
    const rules = [
        { rule: "At least 8 characters", valid: passwordRules.lengthValid },
        { rule: "Contains uppercase letter", valid: passwordRules.uppercaseValid },
        { rule: "Contains lowercase letter", valid: passwordRules.lowercaseValid },
        { rule: "Contains number", valid: passwordRules.numberValid },
        { rule: "Contains special character", valid: passwordRules.specialCharValid },
    ];

    // Display rule validation status
    passwordStrength.innerHTML = rules
        .map(rule => `<p class="${rule.valid ? "text-success" : "text-danger"} text-sm">${rule.rule} ${rule.valid ? "✓" : ""}</p>`)
        .join("");

    const isPasswordStrong = rules.every(rule => rule.valid);

    passwordStrength.className = `mt-1 ${isPasswordStrong ? "text-success" : "text-danger"}`;

    // Show notification for weak password
    if (!isPasswordStrong) {
        const rulesMessage = rules.filter(rule => !rule.valid).map(rule => rule.rule).join('<br>');
        showNotification([`Your password must include:`, rulesMessage], "error", false);
    }
});

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password Strength Validation
function isStrongPassword(password) {
    const minLength = 8;
    return {
        lengthValid: password.length >= minLength,
        uppercaseValid: /[A-Z]/.test(password),
        lowercaseValid: /[a-z]/.test(password),
        numberValid: /[0-9]/.test(password),
        specialCharValid: /[!@#$%^&*]/.test(password),
    };
}

// Get user session
function getUserSession() {
    return JSON.parse(sessionStorage.getItem("user"));
}

// Check if user is logged in
function checkLogin() {
    const user = getUserSession();
    if (!user && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("signup.html")) {
        window.location.href = "login.html";
    }
}

// Sign Up Functionality
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();

        if (!name || !email || !password) {
            showNotification(["Please fill in all fields"], "error");
            return;
        }

        // Validate Email
        if (!isValidEmail(email)) {
            showNotification(["Please enter a valid email address."], "error");
            return;
        }

        // Validate Password Strength
        const passwordRules = isStrongPassword(password);
        if (!passwordRules.lengthValid || !passwordRules.uppercaseValid || !passwordRules.lowercaseValid || !passwordRules.numberValid || !passwordRules.specialCharValid) {
            showNotification(["Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character."], "error");
            return;
        }

        localStorage.setItem("user", JSON.stringify({ name, email, password }));
        showNotification(["Sign Up Successful! Please login."], "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
}

// Login Functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();

        if (!email || !password) {
            showNotification(["Please fill in all fields"], "error");
            return;
        }

        // Fetch stored user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            showNotification(["No account found. Please sign up."], "error");
            return;
        }

        if (storedUser.email !== email || storedUser.password !== password) {
            showNotification(["Invalid email or password"], "error");
            return;
        }

        // Save the user's name in localStorage
        localStorage.setItem("loggedInUser", JSON.stringify({ name: storedUser.name }));

        // Save session and redirect
        sessionStorage.setItem("user", JSON.stringify(storedUser));
        showNotification(["Login Successful!"], "success");

        setTimeout(() => {
            window.location.href = "home.html";
        }, 2000);
    });
}


// Handle Forgot Password form submission
document.getElementById("forgotPasswordForm")?.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("forgotEmail").value;
    // Here logic to send the reset link to the email

    showNotification([`A reset link has been sent to ${email}. Please check your inbox!`], "success");
    // Close the modal after submission
    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    modal.hide();
    // Reset the form
    this.reset();
});



// Initialize Password Field and Toggle Icon
document.addEventListener("DOMContentLoaded", function () {
    const passwordField = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", function () {
        const isPassword = passwordField.type === "password";
        passwordField.type = isPassword ? "text" : "password";

        // Toggle between open and closed eye icons
        togglePassword.innerHTML = isPassword 
            ? '<i class="fa-regular fa-eye-slash text-gray-500"></i>' 
            : '<i class="fa-regular fa-eye text-gray-500"></i>';
    });
});

  

  
// Initial load
checkLogin();
