// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox';

var messages = {};
var rooms = {};

var updateRooms = function(message) {
  if (!rooms.hasOwnProperty(message.roomname)) {
    rooms[message.roomname] = {};
    var link = '?username=' + username + '&roomname=' + message.roomname;
    var room = $('<li class="room" />').append($('<a class="room-link" />').text(message.roomname).attr('href', '#').attr('data-room-name', message.roomname).on('click', roomClickHandler));
    $('.rooms').append(room);
  }

  rooms[message.roomname][message.id] = message;
  rooms[message.roomname].size = rooms[message.roomname].size + 1 || 1;
}

var updateMessages = function(){
  $.ajax({
    url: parseUrl,
    type: 'GET',
    success: function(data){
      data.results.sort(function(a,b){
        return Date.parse(Date(a.createdAt)) > Date.parse(Date(b.createdAt));
      });
      _.each(data.results, function(message){
        if(!messages.hasOwnProperty(message.objectId)){
          messages[message.objectId] = message;
          updateRooms(message);
          if(message.text && message.roomname === currentRoomname){
            var messageBox = $('<div class="messageBox card-panel teal lighten-2 hoverable" />');
            var innerContent = $('<div class="card-content" />');
            var footer = $('<div class="card-footer" />').text(Date(message.createdAt));
            innerContent.append($('<span class="username card-title" />').text(message.username));
            innerContent.append($('<p class="message" />').text(message.text));
            messageBox.append(innerContent);
            messageBox.append(footer);
            $('#chats').prepend(messageBox);
          }
        }
      });
    },
    error: function(){
      console.error('error');
    }
  });
};
setInterval(updateMessages, 1000);

var postToMessages = function(){
  var message = {
    text: $('#message').val(),
    username: username,
    roomname: currentRoomname
  }
  $.ajax({
    url: parseUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('success');
      updateMessages();
    },
    error: function(data){
      console.log(data);
      console.error('message not posted');
    }
  })

  $('#message').val('');
}

  $('#submit-new-message').on('click', function(e){
    e.preventDefault();
    console.log('clicked');
    postToMessages();
  });

  $('#message').on('keypress', function(e) {
    if (e.which === 13) {
      postToMessages();
    }
  });

var encodeHTMLEntities = function(string) {
  string = ''+string;
  return string.replace(/\<\W*script[^>]*\>/gi, '');
};

var roomClickHandler = function(e) {
  e.preventDefault();
  console.log("Hi!");
  currentRoomname = $(this).attr('data-room-name');
  window.location.search = "?username=" + username + "&roomname=" + currentRoomname;
  updateMessages();
};

$('#newRoom').on('click', function() {
  var roomname = prompt("Name your new room!");
  if (roomname !== "") {
    currentRoomname = roomname;
    window.location.search = "?username=" + username + "&roomname=" + currentRoomname;
  }
})



