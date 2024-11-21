// profile.js

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.querySelector('#editModal .btn-primary');

    saveButton.addEventListener('click', () => {
        const userName = document.getElementById('userName').value;
        const userLogin = document.getElementById('userLogin').value;
        const aboutText = document.getElementById('aboutText').value;

        // Here you can add code to update the profile fields or make an API request to save them

        // Close modal after saving
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
    });
});
