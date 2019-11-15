var socket = new WebSocket("ws://" + window.location.host + "/ws/session_control/");
// Used for timing delay for auto complete.
var debounce;
// Used to keep track of current list of items in autocomplete.
var auto_complete_items;
// Currently selected item in list.
var current_selection = -1;

function send_message(e) {
  socket.send(JSON.stringify(e));
}

/**
 * Makes an API call to fetch the auto-complete data.
 * Look at the auto_complete view in views.py for more info.
 */
function auto_complete(keyword) {
  $.ajax({
    method: "GET",
    url: "/panel/auto_complete?keyword=" + keyword,
    dataType: "json"
  }).done(function(result) {
    auto_complete_items = jQuery.parseJSON(result);
    var html_string = "";
    for (var i = 0; i < auto_complete_items.length; i++) {
      var model_name = auto_complete_items[i].model.split(".")[1];
      model_name = model_name.charAt(0).toUpperCase() + model_name.slice(1);
      html_string += "<li class='entry' data-index='" + i + "'>" + auto_complete_items[i].fields.name + "<span class='item-type'>" + model_name + "</span></li>";
    }
    $("#auto-complete-results").html(html_string);
    $("#auto-complete-results").show();
    current_selection = -1;
  });
}

/**
 * Reload all audio elements on the page after a slight delay. Should be called
 * after elements are dynamically changed to reload their source.
 */
function reload_audio() {
  setTimeout(function() {
    $("audio").each(function(index, audio) {
      audio.load();
    });
  }, 100);
}

$(function() {

  // Allow items to be drag & drop replaceable.
  $(".session-items").sortable({
    placeholder: "ui-state-highlight",
    update: function(event, ui) {
      var data = $(this).sortable("serialize");

      $.ajax({
        data: data,
        type: "POST",
        url: "/panel/update_item_order"
      });
    }
  });


  $(".selectors").on("change", "#session-selector", function() {
    $.ajax({
      method: "GET",
      url: "/panel/update_session?key=" + this.value,
      dataType: "html"
    }).done(function(result) {
      $(".session-items").html(result);
      $.ajax({
        method: "GET",
        url: "/panel/session_content",
        dataType: "html"
      }).done(function(result) {
        $(".session-content").html(result);
      });
    });
  });

  /********** Session Content ************/
  $(".content-panel").on("click", "#edit-session", function() {
    // Need to include an additional level of specificity since we are toggling
    // elements that are dynamic.
    $(".content-panel #session-html").toggle();
    $(".content-panel #session-text").toggle();
    $(this).find("img").toggle();
    // If we clicked the save button, make a call to update the session text.
    if ($(this).children()[0].style.display != "none") {
      $.ajax({
        method: "POST",
        url: "/panel/save_session",
        data: {
          "content": $("#session-text").val()
        }
      }).done(function(result) {
        $(".session-content").html(result);
      });
    }
  });

  /******** Session Panel ******/
  $(".session-items").on("click", ".delete-button", function() {
    var key = $(this).attr("data-id");
    var model = $(this).attr("data-model");
    $(this).closest(".card").remove();

    $.ajax({
      method: "GET",
      url: "/panel/edit_session?action=delete&model=" + model + "&key=" + key,
      dataType: "html"
    }).done(function(result) {
    });
  });

 // Communicate the model & id through the socket. The client will make an ajax
 // call to render the selected item.
  $(".session-items").on("click", ".send-button", function() {
    var key = $(this).attr("data-id");
    var model = $(this).attr("data-model");
    send_message({
      model: model,
      key: key
    });
  });

  $(".session-items").on("click", ".play-button", function() {
    var audio = $("#song_" + $(this).attr("data-id"))[0];
    (audio.paused) ? audio.play() : audio.pause();
  });

  $(".session-items").on("click", ".stop-button", function() {
    $("audio").each(function(index, audio) {
      audio.pause();
    });
  });

  /********** Auto Complete **************/

  $("#auto-complete-results").on("click", ".entry", function() {
    var index = $(this).attr("data-index");
    var data = auto_complete_items[index];
    $.ajax({
      method: "GET",
      url: "/panel/edit_session?action=add&model=" + data.model + "&key=" + data.pk,
      dataType: "html"
    }).done(function(result) {
      $("#input-keyword").val("");
      $(".session-items .card").last().after(result);
    });
    $("#auto-complete-results").hide();
  });

  $("#auto-complete-results").on("mouseenter", ".entry", function() {
    $(this).addClass("selected");
  });

  $("#auto-complete-results").on("mouseleave", ".entry", function() {
    $(this).removeClass("selected");
  });

  $("#input-keyword").on("focus", function() {
    if ($("#auto-complete-results").children().length > 0) {
      $("#auto-complete-results").show();
    }
  });

  $("#input-keyword").on("focusout", function() {
    // Set timeout so that click event still fires... gross.
    setTimeout(function() {
      $("#auto-complete-results").hide();
    }, 100);
  });

  $("#input-keyword").on("keydown", function(event) {
    // Scroll the selected class
    if (event.key == "ArrowDown" || event.key == "ArrowUp") {
      if ($("#auto-complete-results").children().length == 0) return;
      var direction = (event.key == "ArrowUp") ? -1 : 1;
      if (current_selection > -1) {
        $($("#auto-complete-results").children()[current_selection]).removeClass("selected");
      }
      current_selection = (current_selection + direction + 5) % 5;
      $($("#auto-complete-results").children()[current_selection]).addClass("selected");
    // Add the selected item.
    } else if (event.key == "Enter") {
      if (current_selection < 0) return;
      $($("#auto-complete-results").children()[current_selection]).click();
    }
  });

  /**
   * Aww yiss, roll your own debounce.
   */
  $("#input-keyword").on("input", function() {
    clearTimeout(debounce);
    var keyword = $("#input-keyword").val();
    if (keyword.length > 0) {
      debounce = setTimeout(function() {
        auto_complete(keyword);
      }, 200);
    } else {
      $("#auto-complete-results").hide();
      $("#auto-complete-results").empty();
    }
  });
});
