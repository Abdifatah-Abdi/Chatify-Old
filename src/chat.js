import { getCookie, convertTimeToUserTimezone } from "./methods.js";

const message = document.getElementsByClassName("message");

const sendMessageButton = document.getElementById("send-message-button-container");
const sendMessageTextBox = document.getElementById("message-text-box");

const uploadMediaButton = document.getElementById("send-media-button-container");
const sendMediaSection = document.getElementById("send-media-section");

const inboundMessage = document.querySelector(".inbound-clone");
const outboundMessage = document.querySelector(".outbound-clone");
const messagesContainer = document.getElementById("messages-container");

const username = document.getElementById("username");

const activeChat = document.getElementById("active-chat");
let activeChatNumber = Number(activeChat.getAttribute("data-group-id"));

const userId = parseInt(getCookie("id"));

const contextMenu = document.querySelector('.context-menu-message');
const contextMenuCopyText = document.getElementById("context-menu-copy-text");
const contextMenuCopyId = document.getElementById("context-menu-copy-id");
const contextMenuCopyUrl = document.getElementById("context-menu-copy-url");
const contextMenuReply = document.getElementById("context-menu-reply");
const contextMenuReport = document.getElementById("context-menu-report");
const contextMenuDelete = document.getElementById("context-menu-delete");

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

/* Load necessary details
*/
const socket = io("http://localhost:8080");

socket.on("message", message => {
	console.log(message);
	if (message.fields.user_id == userId.toString())
		return;

	if (message.fields.group_id != activeChatNumber)
		return;

	const messageElement = inboundMessage.cloneNode(true);
	messageElement.childNodes[3].childNodes[1].textContent = message.fields.message;
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
			`${messageElement.childNodes[3].textContent}${new Date(record.fields.time / 1000)}`;
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
	} else {
		image.setAttribute("src", "./assets/images/icons/upload.svg");
	};

	sendMediaSection.classList.toggle("hidden-send-media");
});

let contextMenuOpened = false;
function onMessageLoad() {
	[...message].forEach(element => {
		element.addEventListener("contextmenu", event => {
			event.preventDefault();
			contextMenu.classList.remove("hidden-context-menu");

			let x = event.clientX, y = event.clientY;
			let width = contextMenu.offsetWidth, height = contextMenu.offsetHeight;

			x += width / 2;
			y += height / 2

			if ((y -= height / 2) > (window.scrollY + window.innerHeight))
				console.log("going under the screen")

			contextMenu.style.left = `${x}px`;
			contextMenu.style.top = `${y}px`;

			const elementDataSet = element.parentElement.parentElement;
			messageContextMenuHandler(elementDataSet.dataset.messageId, elementDataSet.dataset.messageGroupId, elementDataSet.dataset.messageUserId,
				elementDataSet.dataset.messageContent);
		});
	});
};

document.addEventListener("contextmenu", event => {
	event.preventDefault();
	contextMenuOpened = true;
});

document.addEventListener("click", () => contextMenu.classList.add("hidden-context-menu"));

async function messageContextMenuHandler(messageId, messageGroupId, messageUserId, messageContent) {
	contextMenuReport.classList.add(messageUserId == userId ? "hidden-context-menu-item" : "a");
	contextMenuDelete.classList.add(messageUserId != userId ? "hidden-context-menu-item" : "a");
	// console.log(messageUserId);

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

document.querySelectorAll("*").forEach(element => {
	element.addEventListener("mouseup", () => {
		contextMenuReport.classList.remove("hidden-context-menu-item");
		contextMenuDelete.classList.remove("hidden-context-menu-item");
	});
});