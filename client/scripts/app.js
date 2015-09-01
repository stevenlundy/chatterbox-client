// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox';

var messages = {};
var rooms = {};

var updateRooms = function(message) {
  if (!rooms.hasOwnProperty(message.roomname)) {
    rooms[message.roomname] = {};
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
          if(message.text){
            updateRooms(message);
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
    room: 'The Bonfire'
  }
  $.ajax({
    url: parseUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(){
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

  $('#submit-new-message').on('click', function(){
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

  // Initialize collapse button
$('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
