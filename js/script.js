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
				console.log($xml);
				
				var $emails = $xml.find("email");//find all the email address elements
				$emails.each(function(){
					var email = $(this).attr("address");//extract the emai address
					//Get photos for the email address from RainMaker
					$.getJSON("http://api.rainmaker.cc/v1/person.json?email=" + email + "&apiKey=aa676803302af5e2&timeoutSeconds=30&callback=?", function(data){
						//If we have a name and a photo we're good to go
						if("photos" in data && data.photos.length > 0 && "contactInfo" in data && "fullName" in data.contactInfo){
							//Choose the photo to match with the face randomly from available photos
							matches.add(new Match(data.contactInfo.fullName, data.photos[Math.floor(Math.random() * data.photos.length)].url));
						}
					});
				});
				setTimeout(play, 5000);//Wait 5 seconds after the last request to leave time for RainMaker to respond to all the queries
				localStorage["matches"] = JSON.stringify(matches);//Save them for next time
			}
		}
		);
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
			defaultMatches.push(new Match("George Washington", "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/100px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg"));
			defaultMatches.push(new Match("John Adams", "http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Adamstrumbull.jpg/100px-Adamstrumbull.jpg"));
			defaultMatches.push(new Match("Thomas Jefferson", "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg/100px-Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg"));
			defaultMatches.push(new Match("James Madison", "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/James_Madison.jpg/100px-James_Madison.jpg"));
			defaultMatches.push(new Match("James Monroe", "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jm5.gif/100px-Jm5.gif"));
			defaultMatches.push(new Match("John Quincy Adams", "http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/John_Quincy_Adams_by_GPA_Healy%2C_1858.jpg/100px-John_Quincy_Adams_by_GPA_Healy%2C_1858.jpg"));
			defaultMatches.push(new Match("Andrew Jackson", "http://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Andrew_jackson_head.jpg/100px-Andrew_jackson_head.jpg"));
			defaultMatches.push(new Match("Martin Van Buren", "http://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Mb8.gif/100px-Mb8.gif"));
			defaultMatches.push(new Match("William Henry Harrison", "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/William_Henry_Harrison_by_James_Reid_Lambdin%2C_1835.jpg/100px-William_Henry_Harrison_by_James_Reid_Lambdin%2C_1835.jpg"));
			defaultMatches.push(new Match("John Tyler", "http://upload.wikimedia.org/wikipedia/commons/thumb/0/00/WHOportTyler.jpg/100px-WHOportTyler.jpg"));
			defaultMatches.push(new Match("James K. Polk", "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/James_Knox_Polk_by_GPA_Healy%2C_1858.jpg/100px-James_Knox_Polk_by_GPA_Healy%2C_1858.jpg"));
			defaultMatches.push(new Match("Zachary Taylor", "http://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Zachary_Taylor_2.jpg/100px-Zachary_Taylor_2.jpg"));
			defaultMatches.push(new Match("Millard Fillmore", "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Millard_Fillmore_by_George_PA_Healy%2C_1857.jpg/100px-Millard_Fillmore_by_George_PA_Healy%2C_1857.jpg"));
			defaultMatches.push(new Match("Franklin Pierce", "http://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Franklin_Pierce_by_GPA_Healy%2C_1858.jpg/100px-Franklin_Pierce_by_GPA_Healy%2C_1858.jpg"));
			defaultMatches.push(new Match("James Buchanan", "http://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/JamesBuchanan-small.png/100px-JamesBuchanan-small.png"));
			defaultMatches.push(new Match("Abraham Lincoln", "http://upload.wikimedia.org/wikipedia/commons/thumb/5/54/AbrahamLincolnOilPainting1869Restored.jpg/100px-AbrahamLincolnOilPainting1869Restored.jpg"));
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
			$card1.find(".back").append("<span></span><img class='face' src='" + match.imgSrc + "' id='face" + i +"'></img>");
			//If the image doesn't load use the name instead of the face
			$("#face" + i).error(function(){
				$("#face" + i).replaceWith("<p>" + match.name + "</p>");
			});
			$card2.find(".back").append("<p>" + match.name + "</p>");
			$card1.data("name", match.name);
			$card2.data("name", match.name);
		}
		
		//Handle clicks on cards
		$(".card").click(function(){
			if(!GAME.started){
				GAME.started = true;
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
						$(".flipped").fadeOut(3000, function(){$(this).remove()});
					}
				}
			}
		});
		
		$.unblockUI();
	}
});