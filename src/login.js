const idOne = document.getElementById("id-1");
const idTwo = document.getElementById("id-2");

idOne.addEventListener("mouseup", () => {
    document.cookie = "id=1; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/";
    console.log(document.cookie);
});

idTwo.addEventListener("mouseup", () => {
    document.cookie = "id=2; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/";
    console.log(document.cookie);
});

console.log(document.cookie, "\n Abdi Agent");