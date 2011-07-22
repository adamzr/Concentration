//Adam Richeimer
//adamzr@gmail.com

//We'll need this to shuffle the cards

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]
shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

//Global variable to avoid poluting namespace
var GAME = {};

GAME.COLS = 8;//Number of columns
GAME.ROWS = 4;//Number of rows
GAME.CARDS = GAME.ROWS * GAME.COLS;//Number of cards
GAME.NUMBER_OF_MATCHES = GAME.CARDS / 2;//Number of matches
GAME.started = false;//Has the game started, i.e user turned over a card

//The list of all the matches
GAME.matches = new Array();

//Extend jQuery so we can center the "You won" message
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

//A match, i.e. a pair of cards
function Match(name, imgSrc){
    this.name = name;//The person's name
    this.imgSrc = imgSrc;//The URI to an image file to match to the name
}

// Callback for LinkenIn API load
function onLinkedInLoad() {
  IN.Event.on(IN, "auth", onLinkedInAuth);//Set callback for if we are authenticated
}

// Callback for if we are authenticated in to LinkedIn
function onLinkedInAuth() {
  //We only want to use LinkedIn if the user selected it
  if(window.location.hash.indexOf("linkedin") > 0){
    // Make a call to get user's connections; set callback to handle them
    IN.API.Connections("me").result(createInMatches);
  }
}

// Callback for got LinkedIn connections, makes them into matches
function createInMatches(connections){
  $.each(connections.values, function(index, value){
    if(value.pictureUrl){
      GAME.matches.push(new Match(value.firstName + " " + value.lastName, value.pictureUrl));
    }
  })
  localStorage["matches"] = JSON.stringify(GAME.matches);//Save them for next time
  play();//Start the game
}

//Error handler for images
function usename(event){
  $(event.srcElement).replaceWith("<p>" + $(event.srcElement).parent(".card").data("name") + "</p>");
  console.warn("Image load failed!");
}

// Starts the game
function play(){
    //If there's not enough matches we'll need to use the default cards
    if(GAME.matches.length < GAME.NUMBER_OF_MATCHES){
        defaultMatches = new Array();
        defaultMatches.push(new Match("Barack Obama", "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Official_portrait_of_Barack_Obama.jpg/100px-Official_portrait_of_Barack_Obama.jpg"));
        defaultMatches.push(new Match("George W. Bush", "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/George-W-Bush.jpeg/100px-George-W-Bush.jpeg"));
        defaultMatches.push(new Match("Bill Clinton", "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Clinton.jpg/100px-Clinton.jpg"));
        defaultMatches.push(new Match("George H. W. Bush", "http://upload.wikimedia.org/wikipedia/commons/thumb/1/10/George_H._W._Bush_-_portrait_by_Herbert_Abrams_%281994%29.jpg/100px-George_H._W._Bush_-_portrait_by_Herbert_Abrams_%281994%29.jpg"));
        defaultMatches.push(new Match("Ronald Reagan", "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/REAGANWH.jpg/100px-REAGANWH.jpg"));
        defaultMatches.push(new Match("Jimmy Carter", "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/James_E._Carter_-_portrait.gif/99px-James_E._Carter_-_portrait.gif"));
        defaultMatches.push(new Match("Gerald Ford", "http://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Gerald_R._Ford_-_portrait.jpg/100px-Gerald_R._Ford_-_portrait.jpg"));
        defaultMatches.push(new Match("Richard Nixon", "http://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Richard_Nixon_-_Presidential_portrait.jpg/100px-Richard_Nixon_-_Presidential_portrait.jpg"));
        defaultMatches.push(new Match("Lyndon B. Johnson", "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Lyndon_B._Johnson_-_portrait.png/100px-Lyndon_B._Johnson_-_portrait.png"));
        defaultMatches.push(new Match("John F. Kennedy", "http://upload.wikimedia.org/wikipedia/commons/thumb/2/21/John_F_Kennedy_Official_Portrait.jpg/100px-John_F_Kennedy_Official_Portrait.jpg"));
        defaultMatches.push(new Match("Dwight D. Eisenhower", "http://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Dwight_D._Eisenhower%2C_official_Presidential_portrait.jpg/100px-Dwight_D._Eisenhower%2C_official_Presidential_portrait.jpg"));
        defaultMatches.push(new Match("Harry S. Truman", "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/HarryTruman.jpg/100px-HarryTruman.jpg"));
        defaultMatches.push(new Match("Franklin D. Roosevelt", "http://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Franklin_Roosevelt_-_Presidential_portrait.jpg/100px-Franklin_Roosevelt_-_Presidential_portrait.jpg"));
        defaultMatches.push(new Match("Herbert Hoover", "http://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Herbert_Clark_Hoover_by_Greene%2C_1956.jpg/100px-Herbert_Clark_Hoover_by_Greene%2C_1956.jpg"));
        defaultMatches.push(new Match("Calvin Coolidge", "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Calvin_Coolidge.jpg/100px-Calvin_Coolidge.jpg"));
        defaultMatches.push(new Match("Warren G. Harding", "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Wh29.gif/100px-Wh29.gif"));
        //We should use only as many default cards as needed
        while(GAME.matches.length < GAME.NUMBER_OF_MATCHES){
            GAME.matches.push(defaultMatches.shift());
        }
    }
    
    //Shuffle the matches
    GAME.matches = shuffle(GAME.matches);
    
    var cards = new Array(GAME.CARDS);
    
    for(i = 0; i < GAME.CARDS; i++){
        cards[i] = i;
    }
    
    cards = shuffle(cards);
    
    //Assign matches to cards
    for(i = 0, j = 0; i < GAME.NUMBER_OF_MATCHES; i++, j += 2){
        var match = GAME.matches[i];
        var $card1 = $(".card").eq(cards[j]);
        var $card2 = $(".card").eq(cards[j + 1]);
        //If the image source is a valid URL use the face image, otherwise use just the name
        var back = "<p>" + match.name + "</p>";
        if(match.imgSrc.trim().length > 0){
          $card1.find(".back").append("<span></span><img class='face' src='" + match.imgSrc + "' id='face" + i +"' onerror='usename'></img>");
        }
        else{
          $card1.find(".back").append(back);
        }
        
        $card2.find(".back").append(back);
        $card1.data("name", match.name);
        $card2.data("name", match.name);
    }
    
    // Adds one second to the counter
    function timer(){
      $("#seconds").text(parseInt($("#seconds").text()) + 1);
    }
    
    //If the image doesn't load use the name instead of the face
    $(".face").live("error", function(){
      $(this).replaceWith("<p>" + $(this).parent(".card").data("name") + "</p>");
      console.warn("There was a problem loading an image.")
     });
    
    //Handle clicks on cards
    $(".card").click(function(){
        // Start the timer on the first click
        if(!GAME.started){
            GAME.started = true;
            GAME.timerInteval = setInterval(timer, 1000);
        }
        if( $(this).hasClass("flipped")){
            //If you turn over one you already turned over, all get turned back over
            $(".flipped").removeClass("flipped");
        }
        else{
            var flippedOver = $(".flipped").length;
            //If there's 2 flipped cards
            if(flippedOver > 1){
                $(".flipped").removeClass("flipped");
            }
            $(this).toggleClass("flipped");
            //If there's two flipped over cards (one already flipped over, plus the one we just clicked on)
            if(flippedOver === 1){
                // If there's a match 
                if($(".flipped").eq(0).data("name") === $(".flipped").eq(1).data("name")){
                    var delay = 3;// The fade out delay in seconds
                    $(".flipped").fadeOut((delay * 1000),
                    function(){
                      $(this).remove();
                      // Check if we won
                      if($(".card").length === 0){
                        clearInterval(GAME.timerInteval);
                        var seconds = Math.max(parseInt($("#seconds").text()) - delay, 0);
                        $("#seconds").text( seconds );
                        $("#main").html("<div id='winmessage'><h1>You Won in " + seconds + " seconds!</h1><br /><a href='javascript:location.reload()'>Play again?</a></div>");
                        $("#winmessage").center();
                      }
                    }
                    );
                }
            }
        }
        
    });
    
    $.unblockUI();
}

GAME.requestsMade = 0;// How many ajax requests have been made that must be completed before the game starts
GAME.requestsCompleted = 0;//How many of the ajax requests have completed
GAME.checksMade = 0;// Number of checks we've made so far to determine if all ajax requests have completed
GAME.maxChecks = 30;// Maximum number of times to check if all requests have been made before timing out

// Start the game once all requests have completed or we've timed out
function waitUntilComplete(){
  if(GAME.requestsMade === GAME.requestsCompleted || GAME.checksMade === GAME.maxChecks){
    localStorage["matches"] = JSON.stringify(GAME.matches);//Save them for next time
    play();// Start 
    return;
  }
  console.log("Waiting on " + (GAME.requestsMade - GAME.requestsCompleted) + " checks.");
  GAME.checksMade++;
  setTimeout(waitUntilComplete, 1000);// Recheck in one second
}

//When the document is ready start the game
$(document).ready(function(){
    //Block the UI while we build the game 
    $.blockUI({ message: '<h1>Game loading. Just a minute...</h1>' });
    
    //If we got authorization for Google Contacts use it
    if(window.location.hash.indexOf("access_token") > 0){
        //Get the OAuth2 Token
        var token = window.location.hash.split("access_token=")[1].split("&")[0];
        
        //Get the Google Contacts Feed
        $.ajax("https://www.google.com/m8/feeds/contacts/default/full?oauth_token=" + token,
        {
            cache: false,//don't cache it, he may reload in which case we want latest results
            dataType: "jsonp xml",//the results are in JSON padded XML
            success: function(data, textStatus, jqXHR){
              var $xml = $(data);//Create a jQuery XML document of results to search within
              var $emails = $xml.find("email");//find all the email address elements
              
              $emails.each(function(){
                var email = $(this).attr("address");//extract the emai address
                
                $images = $(this).prev("link[rel='http://schemas.google.com/contacts/2008/rel#photo']");
                if($images.length > 0){
                  var href = $images.eq(0).attr("href");
                  var name = $(this).prev("title").text();
                  if(name && name.trim().length > 0 && href && href.trim().length > 0){
                    GAME.matches.push(new Match(name, href));
                    return;//Use the Google image, no need to use Rainmaker.cc
                  }
                }
                
                //Get photos for the email address from RainMaker
                
                if(!email || email.trim().length < 1){
                  //If there's no email address just skip it
                  return;
                }
                
                $.ajax({
                  url: "http://api.rainmaker.cc/v1/person.json",
                  cache: false,
                  complete: function(jqXHR, textStatus){
                    GAME.requestsCompleted++;
                  },
                  data: {
                    email: email,
                    apiKey: "aa676803302af5e2",
                    timeoutSeconds: 30
                  },
                  dataType: "jsonp",
                  error: function(jqXHR, textStatus, errorThrown){
                    console.warn("There was an error on the Rainmaker.cc call, status is:" + textStatus);
                  },
                  success: function(data, textStatus, jqXHR){
                    //If we have a name and a photo we're good to go
                    if("photos" in data && data.photos.length > 0 && "contactInfo" in data && "fullName" in data.contactInfo){
                      //Remove empty URLs
                      var photos = $.map(data.photos, function(photo, index){
                        if(photo.url.trim().length > 0){
                          return photo;
                        }
                        else{
                          return null;
                        }
                      });
                      
                      //Choose the photo to match with the face randomly from available photos
                      GAME.matches.push(new Match(data.contactInfo.fullName, photos[Math.floor(Math.random() * photos.length)].url));
                    }
                  }
                });
                GAME.requestsMade++;
              });
				
              waitUntilComplete();//Start the game once all requests are complete
            }
        }
        );
    }
    
    //If we got authorization for Facebook use it
    else if(window.location.hash.indexOf("facebook") > 0){
        //Load Facebook JS SDK
        window.fbAsyncInit = function() {
        FB.init({appId: '234115633277720', status: true, cookie: true, xfbml: true});
        var access_token = FB.getSession().access_token;
        FB.api('/me/friends', function(response) {//Get friends list
          $.each(response.data, function(index, value){
            $.ajax("http://adamrich.webfactional.com/resolve",
            {
              complete: function(jqXHR, textStatus){
                GAME.requestsCompleted++;
              },
              data: {
                url: "https://graph.facebook.com/" + value.id + "/picture?access_token=" + access_token +"&type=normal"
              },
              dataType: 'jsonp',
              error: function(jqXHR, textStatus, errorThrown){
                console.error("Error resolving URL, " + textStatus);
              },
              success: function(data, textStatus, jqXHR){
                if(["https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v1/yh/r/C5yt7Cqf3zU.jpg", "https://fbcdn-profile-a.akamaihd.net/static-ak/rsrc.php/v1/yV/r/Xc3RyXFFu-2.jpg"].indexOf(data !== -1)){
                  GAME.matches.push(new Match(value.name, "https://graph.facebook.com/" + value.id + "/picture?access_token=" + access_token +"&type=normal"));
                }
                else{
                  console.log(value.name + " has no Facebook profile picture");
                }
              }
            });
            GAME.requestsMade++;
            
          });
          waitUntilComplete();//Start the game once all requests are complete
        });
      };
      (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol +
          '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
      }());
         
    }
    
    //If we got authorization for LinkedIn wait to see if the LinkedIn event handlers will start the game for us
    else if(window.location.hash.indexOf("linkedin") > 0){
        //For now do nothing
    }
    
    //If we didn't come here from Google Contact maybe we have them saved from last time
    else if(localStorage['matches']){
        GAME.matches = JSON.parse(localStorage['matches']);
        play();
    }
    //If not we can still use the default cards
    else{
        play();
    }
    

});