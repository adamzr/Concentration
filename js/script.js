$(document).ready(function(){
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
		}
	});
});