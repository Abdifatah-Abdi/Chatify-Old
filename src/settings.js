const settingsMenu = document.getElementById('settings-menu');
const right = document.getElementById('right');

settingsMenu.querySelectorAll('div').forEach(option => {
    option.addEventListener("mouseup", function () {
        document.getElementsByClassName('visible-section')[0]?.classList.toggle('visible-section');
        document.getElementById(option.textContent.replace(/\s+/g, '-')).classList.add('visible-section')
        document.getElementsByClassName('selected-option')[0]?.classList.toggle('selected-option');
        option.classList.add('selected-option')
        right.querySelector('h3').textContent = option.textContent;
    });
});
