import { auth } from '../media/env/env.js';

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

export const authorization = auth;

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

export function getAncestors(element) {
	let ancestors = [];

	while (element) {
		ancestors.unshift(element);
		element = element.parentNode;
	};

	return ancestors;
};