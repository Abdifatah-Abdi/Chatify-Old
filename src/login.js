import { delay, getCookie } from "./methods.js";

// Elements in DOM
const signInContainer = document.getElementById("sign-in-container");
const signUpContainer = document.getElementById("sign-up-container");

const signInSelector = document.getElementById("sign-in-selector");
const signUpSelector = document.getElementById("sign-up-selector");

const signInButton = document.getElementById("sign-in-button");
const signUpButton = document.getElementById("sign-up-button");

//sign up elements
const usernameInput = document.getElementById("create-username-input");
const emailInput = document.getElementById("create-email-input");
const passwordInput = document.getElementById("create-password-input");
const confirmPasswordInput = document.getElementById("create-confirm-password-input");
const subText = document.getElementsByTagName('h2') // [0] is sign in h2, [1] is sign up h2

//sign in elements
const loginEmailInput = signInContainer.querySelector('div').querySelector('input[type="text"]');
const loginPasswordInput = signInContainer.querySelector('div').querySelector('input[type="password"]');
const rememberBox = document.getElementById('remember-me');

/**
 * @param {form} inputForm - The input form you want to shake (optional).
 * @param {string} errorText - The text you want to display post-error (required).
 * @param {p} sub - 0 for Sign-in page subtitle text, 1 for Sign-up page subtitle text
 */
async function ErrorEffect(inputForm, errorText, sub) {
    subText[sub].style.color = '#ff5f36';
    subText[sub].textContent = '*' + errorText;
    subText[sub].style.opacity = 1;

    if (inputForm) {
        inputForm.classList.add('error');
        await delay(400)
        inputForm.classList.remove('error');
    }
}

/**
 * @param {form} inputForm - The input form you want to shake (optional).
 * @param {string} SuccessText - The text you want to display post-success (required).
 * @param {p} sub - 0 for Sign-in page subtitle text, 1 for Sign-up page subtitle text
 */
async function SuccessEffect(SuccessText, sub) {
    subText[sub].style.color = 'lime';
    subText[sub].textContent = SuccessText;
    subText[sub].style.opacity = 1;
}

async function ValidateEmail(inputForm) {
    var validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (inputForm.value.match(validRegex)) return true;
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
    subText[1].style.opacity = 0.6;
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
            ErrorEffect(null, 'Bruh, you have to fill in all forms', 1);
            return;
        }            

        //check if username already exists
        if (record.fields.username == usernameInput.value) {
            ErrorEffect(usernameInput, "Nahh bruhh you ain't original my boy 💀💀💀☠️☠️", 1)
            return;
        }
        
        //check if email format is accpeted (ex. email@gmail.com)
        if (!(await ValidateEmail(emailInput))) {
            ErrorEffect(emailInput, "Invalid email format!", 1);
            return;
        }

        //check if email already exists
        if (record.fields.email == emailInput.value) {
            ErrorEffect(emailInput, "Unoriginal email", 1)
            return;
        }
        
    };

    if (passwordInput.value != confirmPasswordInput.value) {
        ErrorEffect(confirmPasswordInput, "Passwords do not match", 1)
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
    document.cookie = `id=${maxUserId};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    console.log(getCookie('id'));

    SuccessEffect('Account created!', 1);
    await delay(1000);
    window.location.href = 'main.html';
});

// get highest user id available
async function getMaxUserId() {
    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
            "Content-Type": "application/json",
        }
    });
    const parsedData = await data.json();
    const records = parsedData.records;

    let max = 0;
    for (const record of records) {
        const user_id = record.fields.user_id;

        if (user_id > max) {
            max = user_id;
        }
    }

    return ++max;
};

//sign in section
signInButton.addEventListener('mouseup', async () => {

    const expires = rememberBox.checked ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "";

    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
            "Content-Type": "application/json",
        }
    });
    const parsedData = await data.json();

    if (!loginEmailInput.value || !loginPasswordInput.value) {
        ErrorEffect(null, "Fill in all forms kid", 0);
        return;
    }

    if (await ValidateEmail(loginEmailInput)) { //if user entered an email
        
        for (let index = 0; index < parsedData.records.length; index++) {
            const record = parsedData.records[index];        
    
            if (record.fields.email == loginEmailInput.value) {
                //if found
                //check if pass is correct
                if (record.fields.password == loginPasswordInput.value) {
                    SuccessEffect("Found your account!", 0);
                    //set the cookie id to user id
                    document.cookie = `id=${record.fields.user_id}${expires};`
                    await delay(1000);
                    window.location.href = 'main.html';
                    return
                }
                ErrorEffect(loginPasswordInput, "Password incorrect!", 0);
                return;
            }

            if (index == parsedData.records.length - 1) {
                ErrorEffect(loginEmailInput, "Couldn't find email, try entering a username", 0)
            }
            continue
        }; 

    } else { //if user entered a username

        for (let index = 0; index < parsedData.records.length; index++) {
            const record = parsedData.records[index];        

            //find username
            if (record.fields.username == loginEmailInput.value) {
                //if found
                //check if password is correct
                if (record.fields.password == loginPasswordInput.value) {
                    SuccessEffect("Found your account!", 0);
                    //set the cookie id to user id
                    document.cookie = `id=${record.fields.user_id}${expires};`
                    await delay(1000);
                    window.location.href = 'main.html';
                    return
                }
                ErrorEffect(loginPasswordInput, "Password incorrect!", 0);
                return;
            }

            if (index == parsedData.records.length - 1) {
                ErrorEffect(loginEmailInput, "Couldn't find username, try entering an email", 0)
            }
            continue
        }; 

    }
})