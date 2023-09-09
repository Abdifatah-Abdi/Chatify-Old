class NavigationBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <nav class="navigation-bar">
		<div>
			<a href="index.html">
				<img src="/assets/images/Logo160x.png" alt="Logo of site.">
			</a>
			<p>Chatify</p>
		</div>
		<div class="navigation-bar-middle">
			<a class="navigation-bar-link animated-underline active" href="./index.html">
				<p class="link-content">Home</p>
			</a>
			<a class="navigation-bar-link animated-underline" href="./chat.html">
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
		<a class="navigation-bar-link" id="login-button" href="./login.html">
			<p class="link-content">Sign in / Sign up</p>
			<img src="/assets/images/profiles/default_profile.png" alt="profile picture">
		</a>
	</nav>
    `;
    }
}

customElements.define('navigation-bar', NavigationBar);