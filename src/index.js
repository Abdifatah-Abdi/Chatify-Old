import { deleteCookie, getCookie, authorization } from "./methods.js";

const downloadPlatformSpan = document.getElementById("download-platform");
const toTopButton = document.getElementById("to-top-button");
const signButton = document.getElementById('login-button');
const pfpIcon = document.getElementById("login-button").querySelector('img');
const email_item = document.getElementById("email-item");
const profile_menu = document.getElementById("profile-menu");


const userInfo = {
    username: '',
    pfp: '',
    email: '',
};

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
    //get user information
    const userResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
		method: "GET",
		headers: {
			"Authorization": authorization,
		},
	});
	const usersData = await userResponse.json();

	for (let index = 0; index < usersData.records.length; index++) {
		const record = usersData.records[index];

		if (record.fields.user_id == getCookie('id')) {
            userInfo.username = record.fields.username;
            userInfo.pfp = record.fields.pfp_link;
            userInfo.email = record.fields.email;
        }
	};

    signButton.querySelector('p').textContent = userInfo.username
    signButton.setAttribute('href', '#')
    pfpIcon.style.display = 'block'
    email_item.textContent = userInfo.email;
}

signButton.addEventListener('mouseup', () => {
    if (signButton.getAttribute('href') != '#') {
        console.log(signButton.getAttribute('href'));
    } else {
        profile_menu.style.setProperty('display', profile_menu.style.display === 'none' ? 'block' : 'none');
    }
})

console.log(profile_menu.lastElementChild);
profile_menu.lastElementChild.addEventListener('mouseup', () => {
    deleteCookie('id');
});