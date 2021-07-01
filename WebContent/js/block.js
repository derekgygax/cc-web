$(document).ready(function(){
	// Block a couple
	//TODO YOU NEED TO DO THIS!!!
	// Make sure it works once kyle brings it in
	$("body").on("click", ".block_couple", function(){
		let $recommendedCoupleCard = $(this).closest(".recommended_couple_card");
		let recommendedCoupleNames = $(this).closest(".card-action").siblings(".recommended_couple_info").find(".away_couple_names").text();
		if (confirm("Are you sure you want to block "+recommendedCoupleNames+"?\nYou will never be able to see them again.")){
			let responseFn = function(statusCode, blockResult){
				if (statusCode == 200){
					$recommendedCoupleCard.parent().remove();
				} else {
					
				}
			};
			
			let couple = Object.create(Couple);
			couple.coupleId = $(this).closest(".recommended_couple_card").attr("data-coupleId");
			console.log("blocking " + recommendedCoupleNames);
			couple.block(responseFn);
		}
	});
});