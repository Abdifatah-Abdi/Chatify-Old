export function getCookie(cookie_name) {
	let name = cookie_name + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let cookieSplit = decodedCookie.split(';');

	for (let index = 0; index < cookieSplit.length; index++) {
		let cookie = cookieSplit[index];

		while (cookie.charAt(0) == ' ')
			cookie = cookie.substring(1);

		if (cookie.indexOf(name) == 0)
			return cookie.substring(name.length, cookie.length);
	};

	return "";
};

export function setInfiniteCookie(name, value) {
	document.cookie = `${name}=${value};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
};

export const authorization = 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41';

export function deleteCookie(cookie_name) {
	document.cookie = `${cookie_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	location.reload();
};

export const delay = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
};

/**
 * Returns a random number (inclusive) with the set ranges
 * @param {*} minimum The minimum number
 * @param {*} maximum The maximum number
 * @returns A random number
 */
export function random(minimum, maximum) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};
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