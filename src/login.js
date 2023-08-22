const signInContainer = document.getElementById("sign-in-container");
const signUpContainer = document.getElementById("sign-up-container");

const signInSelector = document.getElementById("sign-in-selector");
const signUpSelector = document.getElementById("sign-up-selector");

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