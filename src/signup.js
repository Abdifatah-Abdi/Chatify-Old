import { delay } from "./methods.js";

const username = document.getElementById('signup-username');
const email = document.getElementById('signup-email');
const password = document.getElementById('signup-password');
const confirm_password = document.getElementById('confirm-password');
const signup_button = document.getElementById('signup-button');
const input_forms = document.getElementsByTagName('input');

async function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA   -Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (input.value.match(validRegex)) {

      return true;

    } else {
        
    input.classList.add('error');
    await delay(400)
    input.classList.remove('error');
      return false;
    }
  
  }

  signup_button.addEventListener('mouseup', async e => {
    let error = false; // Use a flag variable

    Array.from(input_forms).forEach(form => {
        if (!form.value) {
            form.classList.add('error');
            setTimeout(() => {
                form.classList.remove('error');
            }, 400);
            error = true;
            return;
        }
    });

    if (error) {return;} //check if any form is empty
    if (!(await ValidateEmail(email))) {return;} //check if the email is invalid (barely works)

    console.log("end");
});