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
});

signUpButton.addEventListener("click", async () => {
    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        }
    });
    const parsedData = await data.json();

    for (let index = 0; index < parsedData.records.length; index++) {
        const record = parsedData.records[index];

        if (record.fields.username != usernameInput.value)
            continue;

        alert("Nahh bruhh you ain't original my boy 💀💀💀☠️☠️");
        return;
    };

    if (passwordInput.value != confirmPasswordInput.value) {
        alert("bruh you idiot");
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        return;
    };

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

    alert(`User created. Username: ${usernameInput.value}. Password: ${passwordInput.value}. User Id: ${maxUserId}.`);
});

// Sign in section
async function getMaxUserId() {
    const data = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
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