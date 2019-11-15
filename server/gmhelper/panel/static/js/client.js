var socket = new WebSocket("ws://" + window.location.host + "/ws/session_control/");

socket.onmessage = function(event) {
  console.log(event);
  data = JSON.parse(event.data);

  $.ajax({
    method: "GET",
    url: "/panel/display_item?model=" + data.model + "&key=" + data.key,
    dataType: "html"
  }).done(function(result) {
    $("#content").html(result);
  });
}
