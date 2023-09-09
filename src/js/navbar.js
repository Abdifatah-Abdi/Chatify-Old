import { getCookie, deleteCookie, authorization } from "./methods.js";

const usernameSpans = (document.getElementById("username")?.querySelectorAll('span') || []);
const [username, id] = usernameSpans;

// signed up navbar
const signButton = document.getElementById('login-button');
const pfpIcon = document.getElementById("login-button").querySelector('img');
const email_item = document.getElementById("email-item");
const profile_menu = document.getElementById("profile-menu");
const userInfo = {
    username: '',
    pfp: '',
    email: '',
};

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

    if (window.location.pathname.substring(1) == 'chat.html') {
        username.textContent = userInfo.username;
    }
}

signButton.addEventListener('mouseup', () => {
    if (signButton.getAttribute('href') == '#') {
        profile_menu.style.setProperty('display', profile_menu.style.display === 'none' ? 'block' : 'none');
	}
});

//User Profile
profile_menu.children[2].addEventListener('mouseup', () => {
    window.location.href = 'settings.html'
})

//Sign Out
profile_menu.lastElementChild.addEventListener('mouseup', () => {
    deleteCookie('id');
});