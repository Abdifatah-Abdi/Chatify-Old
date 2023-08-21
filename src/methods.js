export function getCookie(cookie_name) {
	let name = cookie_name + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let cookieSplit = decodedCookie.split(';');
	for (let index = 0; index < cookieSplit.length; index++) {
		let cookie = cookieSplit[index];
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1);
		};
		if (cookie.indexOf(name) == 0) {
			return cookie.substring(name.length, cookie.length);
		};
	};
	return "";
};

export const delay = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}



// export function convertTimeToUserTimezone(timeString) {
// 	// Parse the input time string
// 	let [time, ampm] = timeString.split(" ");
// 	let [hours, minutes] = time.split(":");

// 	// Convert hours and minutes to numbers
// 	hours = parseInt(hours);
// 	minutes = parseInt(minutes);

// 	// Get the user's local timezone
// 	let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// 	// Create a date object in the user's local timezone
// 	let userDate = new Date();

// 	// Set hours, minutes, and seconds to match the input time
// 	userDate.setHours(ampm === "am" ? hours : hours + 12);
// 	userDate.setMinutes(minutes);

// 	// Convert the user's local time to the user's timezone
// 	let options = { timeZone: userTimezone, hour: "numeric", minute: "numeric" };
// 	let userTime = userDate.toLocaleTimeString("en-US", options);

// 	return userTime;
// };