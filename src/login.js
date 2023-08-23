import { delay } from "./methods.js";

// Elements in DOM
const signInContainer = document.getElementById("sign-in-container");
const signUpContainer = document.getElementById("sign-up-container");

const signInSelector = document.getElementById("sign-in-selector");
const signUpSelector = document.getElementById("sign-up-selector");

const signInButton = document.getElementById("sign-in-button");
const signUpButton = document.getElementById("sign-up-button");

const usernameInput = document.getElementById("create-username-input");
const emailInput = document.getElementById("create-email-input");
const passwordInput = document.getElementById("create-password-input");
const confirmPasswordInput = document.getElementById("create-confirm-password-input");
const subText = document.getElementsByTagName('h2') // [0] is sign in h2, [1] is sign up h2

/**
 * @param {form} inputForm - The input form you want to shake (optional).
 * @param {string} errorText - The text you want to display post-error (required).
 */
async function ErrorEffect(inputForm, errorText) {
    subText[1].style.color = '#ff5f36';
    subText[1].textContent = '*' + errorText;

    if (inputForm) {
        inputForm.classList.add('error');
        await delay(400)
        inputForm.classList.remove('error');
    }
}

async function ValidateEmail(inputForm) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA   -Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (inputForm.value.match(validRegex)) return true;
    ErrorEffect(inputForm, "Invalid email format");
    return false;
};

// Values

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
});

signUpButton.addEventListener("click", async () => {
    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
            "Content-Type": "application/json",
        }
    });
    const parsedData = await data.json();

    for (let index = 0; index < parsedData.records.length; index++) {
        const record = parsedData.records[index];

        if (!usernameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
            ErrorEffect(null, 'Bruh, you have to fill in all forms');
            return;
        }            

        //check if username already exists
        if (record.fields.username == usernameInput.value) {
            ErrorEffect(usernameInput, "Nahh bruhh you ain't original my boy 💀💀💀☠️☠️")
            return;
        }
        
        //check if email format is accpeted (ex. email@gmail.com)
        if (!ValidateEmail(emailInput)) {return;}

        //check if email already exists
        if (record.fields.email == emailInput.value) {
            ErrorEffect(emailInput, "Unoriginal email")
            return;
        }
    };

    if (passwordInput.value != confirmPasswordInput.value) {
        ErrorEffect(confirmPasswordInput, "Passwords do not match")
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        return;
    };

    const maxUserId = await getMaxUserId();
    const response = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "POST",
        headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
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

    alert(`User created. Username: ${usernameInput.value}. Password: ${passwordInput.value}. User Id: ${maxUserId}.`);
});

// Sign in section
async function getMaxUserId() {
    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
            "Content-Type": "application/json",
        }
    });
    const parsedData = await data.json();

    let max = 0;
    for (let index = 0; index < parsedData.records.length; index++) {
        const record = parsedData.records[index];

        if (max < record.fields.message_id)
            max = record.fields.message_id;
    };

    // console.log(max++);
    return max++;
};