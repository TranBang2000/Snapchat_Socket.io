const socket = io("http://localhost:3000");
socket.on("server-send-fail-req", function () {
  alert("Tài khoản đã được sử dụng!");
});
socket.on("server-send-success-req", function (data) {
  $("#current-user").html(data);
  $("#login-form").hide(2000);
  $("#chat-form").show(1000);
});
socket.on("server-send-list-user", function (data) {
  $("#box-content").html("");
  data.forEach(function (item) {
    //append chen them ptu moi
    $("#box-content").append(`
            <div class="user">${item}</div>
        `);
  });
});
socket.on("server-send-message-for-user", function (data) {
  $("#list-message").append(`
    <li class="msg">${data.un}:${data.mss}</li>
`);
});
socket.on("server-send-character", function (data) {
  $("#alert").html(data);
});
socket.on("server-send-alert", function () {
  $("#alert").html("");
});
$(document).ready(function () {
  $("#login-form").show();
  $("#chat-form").hide();

  $("#btn-register").click(function () {
    if ($("#username").val() === "") {
      alert("Mời bạn nhập Tên để tham gia chat");
    } else socket.emit("client-send-username", $("#username").val());
  });
  $("#btn-logout").click(function () {
    socket.emit("logout");
    $("#chat-form").hide(2000);
    $("#login-form").show(1000);
  });
  $("#btn-send-message").click(function () {
    socket.emit("user-send-message", $("#txt-message").val());
  });
  $("#txt-message").focusin(function (e) {
    socket.emit("user-write-character");
  });
  $("#txt-message").focusout(function () {
    socket.emit("user-stop-write-character");
  });
});