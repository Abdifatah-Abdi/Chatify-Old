import { delay, getCookie, authorization } from "./methods.js";
// DOM Elements
const signInContainer = document.getElementById("sign-in-container");
const signUpContainer = document.getElementById("sign-up-container");
const signInSelector = document.getElementById("sign-in-selector");
const signUpSelector = document.getElementById("sign-up-selector");
const signInButton = document.getElementById("sign-in-button");
const signUpButton = document.getElementById("sign-up-button");
// Sign-up Elements
const usernameInput = document.getElementById("create-username-input");
const emailInput = document.getElementById("create-email-input");
const passwordInput = document.getElementById("create-password-input");
const confirmPasswordInput = document.getElementById("create-confirm-password-input");
const subText = document.getElementsByTagName('h2');
// Sign-in Elements
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const rememberBox = document.getElementById('remember-me');
// Error Effect
async function ErrorEffect(inputForm, errorText, subIndex) {
    subText[subIndex].style.color = '#ff5f36';
    subText[subIndex].textContent = '*' + errorText;
    subText[subIndex].style.opacity = 1;
    if (inputForm) {
        inputForm.classList.add('error');
    }
}
// Success Effect
async function SuccessEffect(successText, subIndex) {
    subText[subIndex].style.color = 'lime';
    subText[subIndex].textContent = successText;
    subText[subIndex].style.opacity = 1;
}
// Validate Email
async function ValidateEmail(emailForm) {
    const validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validRegex.test(emailForm.value);
}
// Event Listeners
signInSelector.addEventListener("mouseup", () => {
    signInSelector.classList.add("active-selector");
    signUpSelector.classList.remove("active-selector");
    signInContainer.classList.remove("hidden-login-container");
    signUpContainer.classList.add("hidden-login-container");
});
signUpSelector.addEventListener("mouseup", () => {
    signInSelector.classList.remove("active-selector");
    signUpSelector.classList.add("active-selector");
    signInContainer.classList.add("hidden-login-container");
    signUpContainer.classList.remove("hidden-login-container");
    subText[1].style.color = 'white';
    subText[1].textContent = "Create a free account to use Chatify's services!";
    subText[1].style.opacity = 0.6;
});
signUpButton.addEventListener("click", async () => {
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();
    for (let i = 0; i < users.records.length; i++) {
        const user = users.records[i];
        if (!usernameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
            ErrorEffect(null, 'Fill in all the forms', 1);
            return;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]+$/; // Regular expression to match letters, numbers, and underscores
        if (!usernameRegex.test(usernameInput.value)) {
            ErrorEffect(usernameInput, "Username can only contain letters, numbers, and underscores", 1);
            return;
        }

        if (user.fields.username === usernameInput.value) {
            ErrorEffect(usernameInput, "This username is taken!", 1);
            return;
        }
        // Password validation for length
        if (passwordInput.value.length < 5) {
            ErrorEffect(passwordInput, 'Your password must be longer than 5 characters', 1);
            return;
        }
        // Password validation for uppercase letter and number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(passwordInput.value)) {
            ErrorEffect(passwordInput, 'Password must include an uppercase letter and a number', 1);
            return;
        }
        if (!ValidateEmail(emailInput)) {
            ErrorEffect(emailInput, "Invalid email format!", 1);
            return;
        }
        if (user.fields.email === emailInput.value) {
            ErrorEffect(emailInput, "Unoriginal email", 1);
            return;
        }
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
        ErrorEffect(confirmPasswordInput, "Passwords do not match", 1);
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        return;
    }
    const maxUserId = await getMaxUserId();
    const response = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "POST",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fields: {
                user_id: maxUserId,
                username: usernameInput.value,
                date_created: Date.now(),
                email: emailInput.value,
                password: passwordInput.value,
            },
        }),
    });
    const parsedResponse = await response.json();
    document.cookie = `id=${maxUserId};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    console.log(getCookie('id'));
    SuccessEffect('Account created!', 1);
    await delay(1000);
    window.location.href = 'chat.html';
});
// Get highest user id available
async function getMaxUserId() {
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();
    let max = 0;
    for (const user of users.records) {
        const user_id = user.fields.user_id;
        if (user_id > max) {
            max = user_id;
        }
    }
    return ++max;
}
// Sign-in section
signInButton.addEventListener('mouseup', async () => {
    const expires = rememberBox.checked ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "";
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();
    if (!loginEmailInput.value || !loginPasswordInput.value) {
        ErrorEffect(null, "Please fill in all forms", 0);
        return;
    }
    let foundUser = null;
    if (await ValidateEmail(loginEmailInput)) {
        foundUser = users.records.find(user => user.fields.email === loginEmailInput.value);
    } else {
        foundUser = users.records.find(user => user.fields.username === loginEmailInput.value);
    }
    if (foundUser) {
        if (foundUser.fields.password === loginPasswordInput.value) {
            SuccessEffect("Found your account!", 0);
            document.cookie = `id=${foundUser.fields.user_id}${expires};`
            await delay(1000);
            window.location.href = 'chat.html';
        } else {
            ErrorEffect(loginPasswordInput, "Password incorrect!", 0);
        }
    } else {
        ErrorEffect(loginEmailInput, "Couldn't find account", 0);
    }
});