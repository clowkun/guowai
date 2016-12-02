window.onload = function() {
    var forgot_link = document.getElementById("forgot");
    forgot_link.onclick = displayMessage;
}

function displayMessage(event) {
    event.preventDefault();
    alert("Hello, World!");
}