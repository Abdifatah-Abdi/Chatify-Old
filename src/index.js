import { deleteCookie, getCookie } from "./methods.js";

const downloadPlatformSpan = document.getElementById("download-platform");
const toTopButton = document.getElementById("to-top-button");
const signButton = document.getElementById('login-button');

toTopButton.addEventListener("mouseup", () => {
    window.scrollTo({ top: 0, behavior: 'smooth', })
});

if (navigator.userAgent.indexOf("Windows") != -1) {
    downloadPlatformSpan.textContent = `Windows`;
} else if (navigator.userAgent.indexOf("Mac OS") != -1) {
    downloadPlatformSpan.textContent = `Mac OS`;
} else if (navigator.userAgent.indexOf("Linux") != -1) {
    downloadPlatformSpan.textContent = `Linux`;
} else if (navigator.userAgent.indexOf("Android") != -1) {
    downloadPlatformSpan.textContent = `Android`;
} else if (navigator.userAgent.indexOf("iOS") != -1) {
    downloadPlatformSpan.textContent = `iOS`;
} else {
    downloadPlatformSpan.textContent = `Huh?`;
};

console.log('Cookie: ', getCookie('id'));
if (getCookie('id')) {
    signButton.querySelector('p').textContent = 'Sign Out'
    signButton.setAttribute('href', '#')
}

signButton.addEventListener('mouseup', e => {
    deleteCookie('id');
})