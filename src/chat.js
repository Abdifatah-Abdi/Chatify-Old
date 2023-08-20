import { getCookie } from "./methods.js";

const message = document.getElementsByClassName("message");

const sendMessageButton = document.getElementById("send-message-button-container");
const sendMessageTextBox = document.getElementById("message-text-box");

const inboundMessage = document.querySelector(".inbound-clone");
const outboundMessage = document.querySelector(".outbound-clone");
const messagesContainer = document.getElementById("messages-container");

const username = document.getElementById("username");

const activeChat = document.getElementById("active-chat");
let activeChatNumber = Number(activeChat.getAttribute("data-group-id"));

const userId = parseInt(getCookie("id"));

// Context Menu Variables
const contextMenu = document.querySelector('.context-menu-message');
const contextMenuCopyText = document.getElementById("context-menu-copy-text");
const contextMenuCopyId = document.getElementById("context-menu-copy-id");
const contextMenuCopyUrl = document.getElementById("context-menu-copy-url");
const contextMenuReply = document.getElementById("context-menu-reply");
const contextMenuReport = document.getElementById("context-menu-report");
const contextMenuDelete = document.getElementById("context-menu-delete");

// Upload Menu Variables
const uploadMediaButton = document.getElementById("send-media-button-container");
const sendMediaSection = document.getElementById("send-media-section");
const sendMediaGifs = document.getElementById("send-media-gifs");

const userTimezoneOffset = new Date().getTimezoneOffset() * 60;
const date = new Date()
let minutes = date.getMinutes();
let hours = '';

if (date.getHours() < 13) {
	hours = date.getHours();
	minutes += "am";
} else {
	hours = (date.getHours() - 12);
	minutes += "pm";
};

function formatTime(time) {
	const convertedTime = new Date(time * 1000);
	const currentDate = new Date();

	const hours = convertedTime.getHours();
	const minutes = convertedTime.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

	if (
		convertedTime.getDate() === currentDate.getDate() &&
		convertedTime.getMonth() === currentDate.getMonth() &&
		convertedTime.getFullYear() === currentDate.getFullYear()
	) {
		return `Today at ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	} else if (
		convertedTime.getDate() === currentDate.getDate() - 1 &&
		convertedTime.getMonth() === currentDate.getMonth() &&
		convertedTime.getFullYear() === currentDate.getFullYear()
	) {
		return `Yesterday at ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	} else {
		return `${convertedTime.getDate()} at ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
	}
}

/* Load necessary details
*/
const socket = io("http://localhost:8080");

socket.on("message", message => {
	console.log(message);
	if (message.fields.user_id == userId.toString())
		return;

	if (message.fields.group_id != activeChatNumber)
		return;

	// const messageElement = inboundMessage.cloneNode(true);
	// messageElement.childNodes[3].childNodes[1].textContent = message.fields.message;
	// messagesContainer.appendChild(messageElement);

	const messageElement = inboundMessage.cloneNode(true);
	messageElement.childNodes[1].childNodes[3].childNodes[1].textContent = message.fields.message;
	messageElement.childNodes[3].textContent = `${formatTime(message.fields.time)}`;
	messageElement.dataset.messageId = message.fields.message_id;
	messageElement.dataset.messageGroupId = message.fields.group_id;
	messageElement.dataset.messageUserId = message.fields.user_id;
	messageElement.dataset.messageContent = message.fields.message;
	messagesContainer.appendChild(messageElement);
});

window.addEventListener("load", async () => {
	username.textContent = `Id: ${userId}`;

	const groupsResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Groups", {
		method: "GET",
		headers: {
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
		},
	});
	const groupsData = await groupsResponse.json();

	for (let index = 0; index < groupsData.records.length; index++) {
		const record = groupsData.records[index];

		const splitGroup = record.fields.group_members.split(",");
		if (!splitGroup.includes(userId.toString()))
			continue;

		activeChat.children[0].textContent = record.fields.group_name;
	};

	const messageResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Messages", {
		method: "GET",
		headers: {
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
		},
	});
	const messageData = await messageResponse.json();

	for (let index = 0; index < messageData.records.length; index++) {
		const record = messageData.records[index];
		const isFromUser = record.fields.user_id == userId;
		let messageElement = isFromUser ?
			outboundMessage?.cloneNode(true) : inboundMessage?.cloneNode(true);
		messageElement.childNodes[1].childNodes[isFromUser ? 1 : 3].childNodes[1].textContent = record.fields.message;
		messageElement.childNodes[3].textContent =
			`${formatTime(record.fields.time)}`;
		messageElement.dataset.messageId = record.fields.message_id;
		messageElement.dataset.messageGroupId = record.fields.group_id;
		messageElement.dataset.messageUserId = record.fields.user_id;
		messageElement.dataset.messageContent = record.fields.message;
		messagesContainer.appendChild(messageElement);
	};

	onMessageLoad(); // This should be at the very end !!
});

/* Send messages
*/
sendMessageButton?.addEventListener("mouseup", async () => {
	const textMessage = sendMessageTextBox.value;

	if (textMessage === null || textMessage.trim() === "") return;
	sendMessageTextBox.value = "";

	const messageElement = outboundMessage?.cloneNode(true);
	messageElement.childNodes[1].childNodes[1].textContent = textMessage;
	messageElement.childNodes[3].textContent = `${messageElement.childNodes[3].textContent} ${hours + ':' + minutes}`
	messagesContainer.appendChild(messageElement);

	const response = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Messages", {
		method: "GET",
		headers: {
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
		},
	});
	const data = await response.json();

	let maxMessageId = -1;
	for (let index = 0; index < data.records.length; index++) {
		const record = data.records[index];

		if (maxMessageId < record.fields.message_id) maxMessageId = record.fields.message_id;
	};
	maxMessageId++;

	const a = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Messages", {
		method: "POST",
		headers: {
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			fields: {
				message_id: maxMessageId++,
				user_id: userId,
				group_id: activeChatNumber,
				message: textMessage,
				time: date.getTime() / 1000,
			},
		}),
	});
	const dataa = await a.json();
	socket.send(dataa);
});

uploadMediaButton.addEventListener("mouseup", () => {
	const image = uploadMediaButton.childNodes[1];

	if (image.getAttribute("src") == "./assets/images/icons/upload.svg") {
		image.setAttribute("src", "./assets/images/icons/upload_selected.svg");
		sendMediaSection.classList.add("active-menu");
		sendMediaSection.classList.remove("hidden-menu");
	} else {
		image.setAttribute("src", "./assets/images/icons/upload.svg");
		sendMediaSection.classList.add("hidden-menu");
		sendMediaSection.classList.remove("active-menu");
	};
});



let contextMenuOpened = false;
function onMessageLoad() {
	[...message].forEach(element => {
		element.addEventListener("contextmenu", event => {
			event.preventDefault();
			contextMenu.classList.remove("hidden-menu");
			contextMenu.classList.add("active-menu");

			let x = event.clientX, y = event.clientY;
			let width = contextMenu.offsetWidth, height = contextMenu.offsetHeight;

			x += width / 2;
			y += height / 2

			if ((y -= height / 2) > (window.scrollY + window.innerHeight))
				console.log("going under the screen")

			contextMenu.style.left = `${x}px`;
			contextMenu.style.top = `${y}px`;

			const elementDataSet = element.parentElement.parentElement;
			messageContextMenuHandler(
				elementDataSet.dataset.messageId,
				elementDataSet.dataset.messageGroupId,
				elementDataSet.dataset.messageUserId,
				elementDataSet.dataset.messageContent
			);
		});
	});
};

document.addEventListener("contextmenu", event => {
	event.preventDefault();
	contextMenuOpened = true;
});

window.addEventListener("mousedown", () => {
	const image = uploadMediaButton.childNodes[1];

	document.querySelectorAll(".active-menu").forEach(element => {
		element.classList.add("hidden-menu");
		element.classList.remove("active-menu");
		image.setAttribute("src", "./assets/images/icons/upload.svg");
	});
});

async function messageContextMenuHandler(messageId, messageGroupId, messageUserId, messageContent) {
	contextMenuReport.classList.add(messageUserId == userId ? "hidden" : "active");
	contextMenuDelete.classList.add(messageUserId != userId ? "hidden" : "active");

	contextMenuCopyText.addEventListener("mouseup", () => {
		navigator.clipboard.writeText(messageContent);
	});

	contextMenuCopyId.addEventListener("mouseup", () => {
		navigator.clipboard.writeText(messageId);
	});

	contextMenuCopyUrl.addEventListener("mouseup", () => {
		navigator.clipboard.writeText(`https://google.com/`);
	});

	contextMenuReport.addEventListener("mouseup", () => {
		console.log("Deal with it");
	});

	contextMenuDelete.addEventListener("mouseup", () => {
		contextMenuDeleteRecord(messageId);
	});
};

async function contextMenuDeleteRecord(messageId) {
	const messageResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Messages", {
		method: "GET",
		headers: {
			"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
		},
	});
	const data = await messageResponse.json();

	for (let index = 0; index < data.records.length; index++) {
		const record = data.records[index];
		const recordId = record.id;

		if (record.fields.message_id != messageId)
			continue;

		await fetch(`https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Messages/${recordId}`, {
			method: "DELETE",
			headers: {
				"Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
			},
		});
	};

	document.querySelector(`[data-message-id="${messageId}"]`).remove();
};

async function contextMenuReportMessage() {

};

document.addEventListener("keydown", key => {
	if (key.key === "Escape") {
		const image = uploadMediaButton.childNodes[1];

		document.querySelectorAll(".active-menu").forEach(element => {
			element.classList.add("hidden-menu");
			element.classList.remove("active-menu");
			image.setAttribute("src", "./assets/images/icons/upload.svg");
		});
	};
});