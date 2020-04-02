// replace these values with those generated in your TokBox Account
var apiKey = "46617502";
var sessionId = "";
var token = "";

var session;
var publisher;
var videoIconStatus = true;
var audioIconStatus = true;
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
$(document).ready(function() {
  $("#disconnectVideoButton").click(function() {
    if (videoIconStatus === true) {
      $("#disconnectVideoButton")
        .find($(".fas"))
        .removeClass("fa-video")
        .addClass("fa-video-slash");
      videoIconStatus = false;
    } else {
      $("#disconnectVideoButton")
        .find($(".fas"))
        .removeClass("fa-video-slash")
        .addClass("fa-video");
      videoIconStatus = true;
    }

    changeVideoStatus();
  });

  $("#muteButton").click(function() {
    if (audioIconStatus === false) {
      $("#muteButton")
        .find($(".fas"))
        .removeClass("fa-volume-mute")
        .addClass("fa-volume-up");
      audioIconStatus = true;
    } else {
      $("#muteButton")
        .find($(".fas"))
        .removeClass("fa-volume-up")
        .addClass("fa-volume-mute");
      audioIconStatus = false;
    }
    changeAudioStatus();
  });
});

// (optional) add server code here
initializeSession();
function stoppublish() {
  session.disconnect();
}
function changeAudioStatus() {
  try {
    if (publisher !== null && publisher !== "undefined") {
      publisher.publishAudio(audioIconStatus);
    }
  } catch (err) {
    alert(err.message);
  }
}
function changeVideoStatus() {
  try {
    if (publisher !== null && publisher !== "undefined") {
      publisher.publishVideo(videoIconStatus);
    }
  } catch (err) {
    alert(err.message);
  }
}
function initializeSession() {
  showSessionId();
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on("streamCreated", function(event) {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%"
      },
      handleError
    );
  });
  //show session Id
  function showSessionId() {
    var url = "";
    if (!url) {
      url = window.location.search;
    }
    if (!url) {
      url = window.location.search;
    }
    if (!url) {
      url = document.url;
    }
    var urlParams = new URLSearchParams(url);
    if (urlParams.has("sessionid")) {
      sessionId = urlParams.get("sessionid");
    }
    if (urlParams.has("token")) {
      token = urlParams.get("token");
    }
  }

  // Create a publisher
  publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%"
    },
    handleError
  );

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
  session.on("sessionDisconnected", function sessionDisconnected(event) {
    window.close();
  });
}
