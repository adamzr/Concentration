//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]
shuffle = function(v){
	for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
	return v;
};

$(document).ready(function(){

	function Match(name, imgSrc){
		this.name = name;
		this.imgSrc = imgSrc;
	}
	
	var matches = new Array();
	
	if(window.location.hash.indexOf("access_token") > 0){
		var token = window.location.hash.split("access_token=")[1].split("&")[0];
		$.ajax("https://www.google.com/m8/feeds/contacts/default/full?oauth_token=1/QbIbRMWW",
		{
			cache: false,
			dataType: "xml",
			success: function(data, textStatus, jqXHR){
				var $xml = $(data);
				console.log($xml);
				var emails = new Array();
				var $emails = $xml.find("gd:email");
				$emails.each(function(){
					emails.push($(this).attr("address"));
				});
				localStorage["emails"] = JSON.stringify(emails);
			}
		}
		);
	}
	else if(localStorage['matches']){
		matches = JSON.parse(localStorage['matches']);
		play();
	}
	else{
		play();
	}
	
	function play(){
		if(matches.length < 16){
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
			while(matches.length < 16){
				matches.push(defaultMatches.shift());
			}
		}
		matches = shuffle(matches);
		
		cards = new Array(32);
		
		for(i = 0; i < 32; i++){
			cards[i] = i;
		}
		
		cards = shuffle(cards);
		
		for(i = 0, j = 0; i < 16; i++, j += 2){
			var match = matches[i];
			var $card1 = $(".card").eq(cards[j]);
			var $card2 = $(".card").eq(cards[j + 1]);
			$card1.find(".back").append("<span></span><img class='face' src='" + match.imgSrc + "'></img>");
			$card2.find(".back").append("<p>" + match.name + "</p>");
			$card1.data("name", match.name);
			$card2.data("name", match.name);
		}
	

		$(".card").click(function(){
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
	}
});