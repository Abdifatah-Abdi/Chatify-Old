const settingsMenu = document.getElementById('settings-menu');
const right = document.getElementById('right');
const uploadPFPInput = document.getElementById('pfp-upload');
const uploadCPFPInput = document.getElementById('pfp-upload');
const pfpPreview = document.getElementById('pfp-preview');
const pfpIcon = document.getElementById('PFP');

settingsMenu.querySelectorAll('div').forEach(option => {
    option.addEventListener("mouseup", function () {
        document.getElementsByClassName('visible-section')[0]?.classList.toggle('visible-section');
        document.getElementById(option.textContent.replace(/\s+/g, '-')).classList.add('visible-section')
        document.getElementsByClassName('selected-option')[0]?.classList.toggle('selected-option');
        option.classList.add('selected-option')
        right.querySelector('h3').textContent = option.textContent;
    });
});

uploadPFPInput.addEventListener("change", async () => {
    pfpPreview.src = URL.createObjectURL(uploadPFPInput.files[0]);
})

uploadCPFPInput.addEventListener("change", async () => {
    pfpIcon.src = URL.createObjectURL(uploadPFPInput.files[0]);
})