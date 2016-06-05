var SC = require('node-soundcloud');
var botkit = require('botkit');
var spotify = require('spotify');
var YouTube = require('youtube-node');
var scSearch = require('soundcloud-search-node');


var client_id = "fd11f5b302d3cbdb73e88788f8d30056";
var client_secret = "121a099d3633117c55f263adde0d9073";
var redirect_uri = "http://localhost:3000/callback.html";

// Initialize client 
SC.init({
  id: client_id,
  secret: client_secret,
  uri: redirect_uri
});
 
// Connect user to authorize application 
var initOAuth = function(req, res) {
  var url = SC.getConnectUrl();
  res.writeHead(301, url);
  res.end();
};
 
// Get OAuth token (example endpoint discussed in the next section) 

var redirectHandler = function(req, res) {
  var code = req.query.code;
 
  SC.authorize(code, function(err, accessToken) {
    if ( err ) {
      throw err;
    } else {
      // Client is now authorized and able to make API calls 
      console.log('access token:', accessToken);
    }
  });
};

process.env.token="xoxb-48208740373-Qye8fDnNMEZW1Kj5lCm3P0xI";

var controller = botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['Play spotify (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var song = message.match[2];
 
      spotify.search({ type: 'track', query: song }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      } else {
        bot.reply(message, data.tracks.items[0].external_urls.spotify);
      }
 
});

});


controller.hears(['Play soundcloud (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var song = message.match[1];


      scSearch.getTracks(client_id, song, 10, function callback(tracks){

        bot.reply(message, tracks[0].permalink_url);
  });
 
});



controller.hears(['Play youtube (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var song = message.match[1];


      var youTube = new YouTube();

      youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

      youTube.search(song, 2, function(error, result) {
        if (error) {
          console.log(error);
        }
        else {

          bot.reply(message, "https://www.youtube.com/watch?v=" + result.items[0].id.videoId);
        }
      });
});
