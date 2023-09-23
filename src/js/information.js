import { authorization, getCookie } from "./methods.js";

export const userId = getCookie("id");

/**
 * Returns the username.
 * 
 * Note: Have an await behind the function for the value, rather than the promise.
 * @returns The username.
 */
export async function getUsername() {
    const userData = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
        method: "GET",
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json",
        },
    });
    const users = await userData.json();

    for (let index = 0; index < users.records.length; index++) {
        const record = users.records[index];

        if (record.fields.user_id == userId)
            return record.fields.username;
    };
};