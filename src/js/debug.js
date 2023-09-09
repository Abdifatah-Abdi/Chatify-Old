import { deleteCookie, getCookie, setInfiniteCookie } from "./methods.js";

const setId = document.getElementById("set-id");
const setIdButton = document.getElementById("set-id-button");

document.querySelector("h2").textContent = getCookie("id");

setIdButton.addEventListener("mouseup", () => {
    if (setId.value == "-1") {
        deleteCookie("id");
        document.querySelector("h1").textContent = "Discarded cookie.";
    } else {
        setInfiniteCookie("id", setId.value);
        document.querySelector("h1").textContent = `Your id is: ${getCookie("id")}`;
    };
});
