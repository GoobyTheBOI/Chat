import './scss/style.scss';
import './img/login-button.png';

const socket = io("/tech");
// let username = localStorage.getItem("userName");
// document.getElementById("nickname__chat").innerHTML = `#${username}`;
const rooms = window.location.pathname.replace(/^\/+/, "");

// Login form
$("#submit").click(function (e) {
  e.preventDefault();
  if ($.trim($("#nickname").val()) == "") {
    $(".message_failed").append(
      "<div>This nickname already exists. Try another.</div>"
    );
  } else {
    var inputvalue = $("#nickname").val();
    localStorage.setItem("userName", inputvalue);
    return (window.location.href = "/chatrooms");
  }
});

