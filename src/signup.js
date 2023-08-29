import { delay } from "./methods.js";

const username = document.getElementById('signup-username');
const email = document.getElementById('signup-email');
const password = document.getElementById('signup-password');
const confirm_password = document.getElementById('confirm-password');
const signup_button = document.getElementById('signup-button');
const input_forms = document.getElementsByTagName('input');
const top_text = document.getElementById("top-text");
const login_event = document.createElement("login");

const socket = io("http://localhost:8080");

async function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA   -Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (input.value.match(validRegex)) {

      return true;

    } else {
        
    top_text.textContent = '*Invalid email!';
    top_text.style.visibility = 'visible';
    input.classList.add('error');
    await delay(400)
    input.classList.remove('error');
      return false;
    }
  
}

signup_button.addEventListener('mouseup', async e => {
    let error = false; // Use a flag variable

    for (const form of input_forms) {
        if (!form.value) {
            top_text.textContent = '*Please fill in all forms';
            top_text.style.visibility = 'visible';
            form.classList.add('error');
            await delay(300);
            form.classList.remove('error');
            error = true;
            if (form == input_forms[input_forms.length - 2]) {return;}
        }
    }

    if (!(await ValidateEmail(email))) { return; } //check if the email is invalid (barely works)
    
    if (password.value.length < 5) {
        top_text.style.visibility = 'visible';
        top_text.textContent = 'Your password must be longer than 5 characters';
        password.classList.add('error');
        await delay(400);
        password.classList.remove('error');
        return;
    }

    if (password.value != confirm_password.value) {
      top_text.style.visibility = 'visible';
      top_text.textContent = 'Passwords do not match';
      confirm_password.classList.add('error');
      await delay(400)
      confirm_password.classList.remove('error');
      return;
    }

    // Check if this email is already on Airtable

    const messageResponse = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
      method: "GET",
      headers: {
          "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
        },
      });
    const messageData = await messageResponse.json();

    for (let index = 0; index < messageData.records.length; index++) {
      const record = messageData.records[index];

      //Existing information checks
      if (record.fields.email === email.value) { //check if email is already registered
          top_text.style.visibility = 'visible';
          top_text.textContent = '*Email already registered';
          return;
      }
      if (record.fields.username === username.value) { //check if username was taken
        top_text.style.visibility = 'visible';
        top_text.textContent = '*Username taken';
        return;
      }

      let userid = Math.floor(1000000 + Math.random() * 9000000);
      function generateID() {
        if (userid == record.fields.user_id) {
          generateID()
          return userid;
        } else {
          return userid;
        }
      }

        const a = await fetch("https://api.airtable.com/v0/appDfdVnrEoxMyFfF/Users", {
          method: "POST",
          headers: {
            "Authorization": 'Bearer pati5KVtX7oSWkWky.02a40e2acb77b3ec52bcfacbadc838a8501e129eea7a9c1ec0d61e7748074e41',
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              user_id: generateID(),
              username: username.value,
              date_created: new Date().getTime() / 1000,
              pfp_link: 'assets\images\profiles\default_profile.png',
              email: email.value,
              password: password.value,
            },
          }),
        });
        const dataa = await a.json();
        socket.send(dataa);
        window.location.href = 'main.html'; // send user to the main page
        return;
    };
});

document.addEventListener("login", function() {
  console.log("hi");
});
