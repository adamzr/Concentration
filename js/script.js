//Adam Richeimer
//adamzr@gmail.com

//We'll need this to shuffle the cards

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]
shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
 var GAME = {};
 
GAME.COLS = 8;
GAME.ROWS = 4;
GAME.CARDS = GAME.ROWS * GAME.COLS;
GAME.MATCHES = GAME.CARDS / 2;
GAME.started = false;

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

//When the document is ready start the game
$(document).ready(function(){
    //Block the UI while we build the game 
    $.blockUI({ message: '<h1>Game loading. Just a minute...</h1>' });
    
    //A match, i.e. a pair of cards
    function Match(name, imgSrc){
        this.name = name;
        this.imgSrc = imgSrc;
    }
    
    //The list of all the matches
    var matches = new Array();
    
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
				
				var requestsMade = 0;
				var requestsCompleted = 0;
				$emails.each(function(){
					var email = $(this).attr("address");//extract the emai address
					//Get photos for the email address from RainMaker
					
          if(email && email.trim().length < 1){
            //If there's no email address just skip it
            return;
          }
          
					$.ajax({
						url: "http://api.rainmaker.cc/v1/person.json",
						cache: false,
						complete: function(jqXHR, textStatus){
							requestsCompleted++;
						},
						data: {
							email: email,
							apiKey: "aa676803302af5e2",
							timeoutSeconds: 30
						},
						dataType: "jsonp",
						error: function(jqXHR, textStatus, errorThrown){
							console.log(textStatus + ":" + errorThrown);
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
								matches.push(new Match(data.contactInfo.fullName, photos[Math.floor(Math.random() * photos.length)].url));
							}
						}
					});
					requestsMade++;
				});
				
				var checksMade = 0;
				var maxChecks = 30;
				function waitUntilComplete(){
					if(requestsMade === requestsCompleted || checksMade === maxChecks){
						localStorage["matches"] = JSON.stringify(matches);//Save them for next time
						play();
						return;
					}
					console.log("Waiting on " + (requestsMade - requestsCompleted) + " checks.");
					checksMade++;
					setTimeout(waitUntilComplete, 1000);
				}
				waitUntilComplete();
            }
        }
        );
    }
    
    //If we got authorization for Google Contacts use it
    if(window.location.hash.indexOf("facebook") > 0){
        //Load Facebook JS SDK
        window.fbAsyncInit = function() {
        FB.init({appId: '234115633277720', status: true, cookie: true, xfbml: true});
        var access_token = FB.getSession().access_token;
        FB.api('/me/friends', function(response) {
          $.each(response.data, function(index, value){
            matches.push(new Match(value.name, "https://graph.facebook.com/" + value.id + "/picture?access_token=" + access_token));
          });
          localStorage["matches"] = JSON.stringify(matches);//Save them for next time
          play();
        });
      };
      (function() {
        var e = document.createElement('script'); e.async = true;
        e.src = document.location.protocol +
          '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
      }());
         
    }
    
    //If we didn't come here from Google Contact maybe we have them saved from last time
    else if(localStorage['matches']){
        matches = JSON.parse(localStorage['matches']);
        play();
    }
    //If not we can still use the default cards
    else{
        play();
    }
    
    //Start the game!
    function play(){
        //If there's not enough matches we'll need to use the default cards
        if(matches.length < GAME.MATCHES){
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
            while(matches.length < GAME.MATCHES){
                matches.push(defaultMatches.shift());
            }
        }
        
        //Shuffle the matches
        matches = shuffle(matches);
        
        cards = new Array(GAME.CARDS);
        
        for(i = 0; i < GAME.CARDS; i++){
            cards[i] = i;
        }
        
        cards = shuffle(cards);
        
        //Assign matches to cards
        for(i = 0, j = 0; i < GAME.MATCHES; i++, j += 2){
            var match = matches[i];
            var $card1 = $(".card").eq(cards[j]);
            var $card2 = $(".card").eq(cards[j + 1]);
            //If the image source is a valid URL use the face image, otherwise use just the name
            if(match.imgSrc.trim().length > 0){
              $card1.find(".back").append("<span></span><img class='face' src='" + match.imgSrc + "' id='face" + i +"'></img>");
            }
            else{
              $card1.find(".back").append("<p>" + match.name + "</p>");
            }
            
            $card2.find(".back").append("<p>" + match.name + "</p>");
            $card1.data("name", match.name);
            $card2.data("name", match.name);
        }
        
        function timer(){
          $("#seconds").text(parseInt($("#seconds").text()) + 1);
        }
        
        //If the image doesn't load use the name instead of the face
        $(".face").live("error", function(){
          $(this).replaceWith("<p>" + $(this).parent(".card").data("name") + "</p>");
         });
        
        //Handle clicks on cards
        $(".card").click(function(){
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
                
                if(flippedOver === 1){
                    if($(".flipped").eq(0).data("name") === $(".flipped").eq(1).data("name")){
                        $(".flipped").fadeOut(3000,
                        function(){
                          $(this).remove();
                          if($(".card").length === 0){
                            clearInterval(GAME.timerInteval);
                            var seconds = Math.max(parseInt($("#seconds").text()) - 3, 0);
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
});