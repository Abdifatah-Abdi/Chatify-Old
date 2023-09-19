import { deleteCookie, getCookie, authorization, getAncestors } from "../js/methods.js"

class NavigationBar extends HTMLElement {
	constructor() {
		super();
	};

	connectedCallback() {
		this.id = "navigation-bar-container";

		if (getCookie("id")) {
			this.innerHTML = `
				<nav id="navigation-bar">
					<div>
						<a href="/index.html">
							<img src="/assets/images/Logo160x.png" alt="Logo of site.">
						</a>
						<p>Chatify</p>
					</div>

					<div class="navigation-bar-middle">
						<a class="navigation-bar-link animated-underline active" href="/index.html">
							<p class="link-content">Home</p>
						</a>
						<a class="navigation-bar-link animated-underline" href="/src/html/chat.html">
							<p class="link-content">Chat</p>
						</a>
						<a class="navigation-bar-link animated-underline" href="#">
							<p class="link-content">Community</p>
						</a>
						<a class="navigation-bar-link animated-underline" href="#">
							<p class="link-content">Blog</p>
						</a>
						<a class="navigation-bar-link animated-underline" href="./about.html">
							<p class="link-content">About</p>
						</a>
					</div>

					<a class="navigation-bar-link profile-menu" id="login-button">
					<img src="/assets/images/profiles/default_profile.png" class="profile-menu"
						alt="PFP">
					<p class="link-content profile-menu">Username</p>
					</a>

					<div id="profile-menu" class="allow-user-select profile-menu">
						<div class="user-info">
						<div class="profile-menu">
								<img src="/assets/images/profiles/default_profile.png" class="profile-menu"
									alt="PFP">
							</div>

						<div class="profile-menu">
							<p class="profile-menu">Welcome back,</p>
							<p id="username" class="profile-menu">Username</p>
							<p id="user-email" class="profile-menu">Email:</p>
						</div>

						<div class="profile-menu">
							<button id="sign-out-button">
								<img src="/assets/images/icons/exit.svg" alt="" title="Sign out">
							</button>
						</div>
					</div>

					<button class="profile-menu-item" id="profile-button">Profile</button>
					<button class="profile-menu-item" id="inbox-button">Inbox</button>
					<button class="profile-menu-item" id="settings-button">Settings</button>
					<button class="profile-menu-item end" id="help-and-support-button">Help & Support</button>
				</div>
			</nav>
    		`;

			window.addEventListener("load", async () => {
				if (!getCookie("id"))
					return;

				const userResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
					method: "GET",
					headers: {
						"Authorization": authorization,
					},
				});
				const usersData = await userResponse.json();

				for (let index = 0; index < usersData.records.length; index++) {
					const record = usersData.records[index];

					if (!record.fields.user_id == getCookie("id"))
						return;

					username.textContent = record.fields.username;
					email.textContent = `Email: ${record.fields.email}`;
				};

				if (window.location.pathname.substring(1) == 'chat.html')
					username.textContent = userInfo.username;

				loginButton.addEventListener("mouseup", () => {
					profileMenu.classList.toggle("hidden");
				});

				settingsButton.addEventListener("mouseup", () => {
					window.location.href = "./settings.html";
				});

				signOutButton.addEventListener('mouseup', () => {
					deleteCookie("id");
					window.location.href = "./index.html";
				});
			});

			window.addEventListener("click", event => {
				if (event.target.id === "profile-menu" || event.target.id === "login-button")
					return;

				if (event.target.classList.contains("profile-menu"))
					return;

				profileMenu.classList.add("hidden");
			});
		} else {
			this.innerHTML = `
			<nav id="navigation-bar">
				<div>
					<a href="/index.html">
						<img src="/assets/images/Logo160x.png" alt="Logo of site.">
					</a>
					<p>Chatify</p>
				</div>
				<div class="navigation-bar-middle">
					<a class="navigation-bar-link animated-underline active" href="/index.html">
						<p class="link-content">Home</p>
					</a>
					<a class="navigation-bar-link animated-underline" href="/src/html/chat.html">
						<p class="link-content">Chat</p>
					</a>
					<a class="navigation-bar-link animated-underline" href="#">
						<p class="link-content">Community</p>
					</a>
					<a class="navigation-bar-link animated-underline" href="#">
						<p class="link-content">Blog</p>
					</a>
					<a class="navigation-bar-link animated-underline" href="./about.html">
						<p class="link-content">About</p>
					</a>
				</div>
				<a class="navigation-bar-link" id="login-button" href="/src/html/login.html">
					<p class="link-content">Sign in / Sign up</p>
				</a>
			</nav>
    		`;
		};

	};
};

customElements.define('navigation-bar', NavigationBar);

const profileMenu = document.getElementById("profile-menu");
const loginButton = document.getElementById("login-button");

const username = document.getElementById("username");
const email = document.getElementById("user-email");
const signOutButton = document.getElementById("sign-out-button");

const profileButton = document.getElementById("profile-button");
const inboxButton = document.getElementById("inbox-button");
const settingsButton = document.getElementById("settings-button");
const helpAndSupportButton = document.getElementById("help-and-support-button");
