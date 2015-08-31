// YOUR CODE HERE:
var parseUrl = 'https://api.parse.com/1/classes/chatterbox';

$.ajax({
  url: parseUrl,
  type: 'GET',
  success: function(data){
    console.log(data);
    // $('#chats').append($('<div>'+encodeHTMLEntities(data.results[86].text)+'</div>'))
    _.each(data.results, function(message){
      if(message.text){
        $('#chats').append($('<div class="card-panel teal lighten-2"/>').text(message.text));
      }
    });
  },
  error: function(){
    console.error('error');
  }
});


var encodeHTMLEntities = function(string) {
  string = ''+string;
  return string.replace(/\<\W*script[^>]*\>/gi, '');
};