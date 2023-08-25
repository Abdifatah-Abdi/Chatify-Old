import { deleteCookie, getCookie } from "./methods.js";

const downloadPlatformSpan = document.getElementById("download-platform");
const toTopButton = document.getElementById("to-top-button");
const signButton = document.getElementById('login-button');
const pfpIcon = document.getElementById("login-button").querySelector('img');

const userInfo = {
    username: '',
    pfp: '',
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
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
		},
	});
	const usersData = await userResponse.json();

	for (let index = 0; index < usersData.records.length; index++) {
		const record = usersData.records[index];

		if (record.fields.user_id == getCookie('id')) {
            userInfo.username = record.fields.username;
            userInfo.pfp = record.fields.pfp_link;
        }
	};

    signButton.querySelector('p').textContent = userInfo.username
    signButton.setAttribute('href', '#')
    pfpIcon.style.display = 'block'
} else {
    
}

signButton.addEventListener('mouseup', () => {
    deleteCookie('id');
})