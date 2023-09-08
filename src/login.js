import { authorization, random, setInfiniteCookie } from "./methods.js";

//#region Elements
//#region Containers, Selectors, and Button elements
const signInContainer = document.getElementById("sign-in-container");
const signUpContainer = document.getElementById("sign-up-container");
const signInSelector = document.getElementById("sign-in-selector");
const signUpSelector = document.getElementById("sign-up-selector");
const signInButton = document.getElementById("sign-in-button");
const signUpButton = document.getElementById("sign-up-button");
//#endregion
//#region Sign-up Elements
const createUsernameInput = document.getElementById("create-username-input");
const createEmailInput = document.getElementById("create-email-input");
const createPasswordInput = document.getElementById("create-password-input");
const confirmPasswordInput = document.getElementById("create-confirm-password-input");
//#endregion
//#region Sign-in Elements
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const rememberBox = document.getElementById('remember-me');
//#endregion
//#region Error Elements
const takenUsernameError = document.getElementById("taken-username-error");
const availableUsername = document.querySelectorAll(".available-username");
const takenEmailError = document.getElementById("taken-email-error");
const nonMatchingPasswordError = document.getElementById("non-matching-password-error");
const fillInFormsError = document.getElementById("fill-in-all-forms-error");

const incorrectCredentialsError = document.getElementById("incorrect-credentials-error");
const fillInCredentialsError = document.getElementById("fill-in-all-credentials-error");
//#endregion
//#endregion
//#region Event Listeners
signInSelector.addEventListener("mouseup", signInSelectorClick);
signUpSelector.addEventListener("mouseup", signUpSelectorClick);
signInButton.addEventListener('mouseup', signInButtonOnClick);
signUpButton.addEventListener("mouseup", signUpButtonOnClick);
createUsernameInput.addEventListener("focusout", createUsernameInputFocusOut);
availableUsername.forEach(availableUsernameLoop);
//#endregion
//#region Functions
async function signInButtonOnClick() {
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const parsedData = await userData.json();

    if (!loginEmailInput.value || !loginPasswordInput.value) {
        fillInCredentialsError.classList.remove('hidden');
        errorEffect(loginEmailInput);
        errorEffect(loginPasswordInput);
        return;
    };

    for (let index = 0; index < parsedData.records.length; index++) {
        const record = parsedData.records[index];

        if (!(loginEmailInput.value === record.fields.email && loginPasswordInput.value === record.fields.password))
            continue;

        undoErrorEffect(loginEmailInput);
        undoErrorEffect(loginPasswordInput);

        setInfiniteCookie("id", record.fields.user_id);
        return;
    };

    incorrectCredentialsError.classList.remove("hidden");
    loginPasswordInput.value = "";

    errorEffect(loginEmailInput);
    errorEffect(loginPasswordInput);
};

async function signUpButtonOnClick() {
    if (!createUsernameInput.value || !createEmailInput.value || !createPasswordInput.value || !confirmPasswordInput.value) {
        fillInFormsError.classList.remove("hidden");
        return;
    } else {
        fillInFormsError.classList.add("hidden");
    };

    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();

    for (let index = 0; index < users.records.length; index++) {
        const record = users.records[index];

        if (record.fields.username === createUsernameInput.value) {
            errorEffect(createUsernameInput);
            takenUsernameError.classList.remove("hidden");

            availableUsername.forEach(element => element.textContent = `${createUsernameInput.value}${random(20, 100)}`);
            return;
        } else {
            undoErrorEffect(createUsernameInput);
            takenUsernameError.classList.add("hidden");
        };

        if (record.fields.email === createEmailInput.value) {
            errorEffect(createEmailInput);
            takenEmailError.classList.remove("hidden");
            return;
        } else {
            undoErrorEffect(createEmailInput);
            takenEmailError.classList.add("hidden");
        };

        if (createPasswordInput.value !== confirmPasswordInput.value) {
            errorEffect(createPasswordInput);
            errorEffect(confirmPasswordInput);

            nonMatchingPasswordError.classList.remove("hidden");

            createPasswordInput.value = "";
            confirmPasswordInput.value = "";
            return;
        } else {
            undoErrorEffect(createPasswordInput);
            undoErrorEffect(confirmPasswordInput);

            nonMatchingPasswordError.classList.add("hidden");
        };
    };

    const maxUserId = await getMaxUserId();
    await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "POST",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fields: {
                user_id: maxUserId,
                username: createUsernameInput.value,
                date_created: Date.now(),
                email: createEmailInput.value,
                password: createPasswordInput.value,
            },
        }),
    });
    document.cookie = `id=${maxUserId};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
};

async function createUsernameInputFocusOut() {
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();

    for (let index = 0; index < users.records.length; index++) {
        const record = users.records[index];

        if (record.fields.username === createUsernameInput.value) {
            errorEffect(createUsernameInput);
            takenUsernameError.classList.remove("hidden");
            fillInFormsError.classList.add("hidden");

            availableUsername.forEach(element => element.textContent = `${createUsernameInput.value}${random(20, 100)}`);
            return;
        } else {
            undoErrorEffect(createUsernameInput);
            takenUsernameError.classList.add("hidden");
        };
    };
};

function signInSelectorClick() {
    signInSelector.classList.add("active-selector");
    signUpSelector.classList.remove("active-selector");
    signInContainer.classList.remove("hidden-login-container");
    signUpContainer.classList.add("hidden-login-container");
};

function signUpSelectorClick() {
    signInSelector.classList.remove("active-selector");
    signUpSelector.classList.add("active-selector");
    signInContainer.classList.add("hidden-login-container");
    signUpContainer.classList.remove("hidden-login-container");
};

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

        if (user_id > max)
            max = user_id;
    };

    return ++max;
};

async function errorEffect(inputForm) {
    inputForm.classList.add('error');
};

async function undoErrorEffect(inputForm) {
    inputForm.classList.remove('error');
};

function availableUsernameLoop(element) {
    element.addEventListener("mouseup", availableUsernameElementClick.bind(null, element));
};

function availableUsernameElementClick(element) {
    createUsernameInput.value = element.textContent;
    undoErrorEffect(createUsernameInput);
};
//#endregion