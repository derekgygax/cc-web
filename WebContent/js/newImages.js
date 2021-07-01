$(document).ready(function(){
	
	let updateProfilePic = function(images){
		var url = window.URL.createObjectURL(images['image_0']);
		$("#profilePic").attr("style", "background-image: url("+url+")");
		$("#navProfilePic").attr("src", url);
		$(".addProfilePicture").addClass("yellow darken-2");
		$(".addProfilePicture").removeClass("light-blue");
	};
	
	let couple = Object.create(Couple);
	// Click the Input file-type
	$("body").on("click", ".upload", function(e){
		e.preventDefault();
		let $imageUploadNode = $(this).siblings("input.image_upload");
		$imageUploadNode.click();
	});
	
	$("body").on("click", ".delete", function(e){
		e.preventDefault();
		let $input = $(this).siblings("input.image_upload");
		let deleteResponseFn = function(rStatus, rText){
			$.ajax({
				type: "GET",
				url: "/images?onlycontent=true",
				success: function(images){
					$("#ccImages").html(images);
				},
				error: function(xhr, ajaxOptions, thrownError){
					console.log(xhr);
					console.log(ajaxOptions);
					console.log(thrownError);
				}
			});
		}
		couple.deletePhotos($input.attr('name'), deleteResponseFn);
	});
	
// Drag and Drop ===================================================================	
	
	$("body").on({
		'dragover dragenter': function(e) {
			e.preventDefault();
			e.stopPropagation();
		},
		'drop': function(e) {
			e.preventDefault();
			e.stopPropagation();
		}
	});

	
	$("body").on('drop', '.ccImage', function(event) {
		event.preventDefault();
		event.stopPropagation();
        var dataTransfer =  event.originalEvent.dataTransfer;
        console.log(dataTransfer);
        var img = $(this).find("img")[0];
        var input = $(this).find(".image_upload")[0];
        if (dataTransfer && dataTransfer.files.length) {
        	input.files = dataTransfer.files
        	changeImageFromInput(input);
        } else {
			
        }	
	});
	

	$("body").on('change', '.image_upload', function(e){
		
		changeImageFromInput($(this));
		
	});
	
	function changeImageFromInput(input) {
		
		let img = $(input).parent().siblings('img');
		var deleteBtn = $(input).parent().find('.delete')[0];
		var ccNoImage = $(input).parent().siblings('.ccNoImage');
		let file = $(input)[0].files[0];
		if (file){
			img.attr("src",window.URL.createObjectURL(file));
			if(ccNoImage) {
				$(ccNoImage).remove();
			}
		}
		
		if(deleteBtn) {
			$(input.form).attr("data-editting", "1");
			$(deleteBtn).text("Save Image");
			$(deleteBtn).removeClass("delete");
			$(deleteBtn).attr("type", "submit");
		}
	}
	
	$("body").on("submit", ".uploadImagesForm", function(e){
		e.preventDefault();
		
		let imagesAndDimensions = {};
		
		var img = $(this).find("img")[0];
		var input = $(this).find(".image_upload")[0];
		var saveImage = $(e.target).find("button[type='submit']")[0];
		var imgNumber = $(input).attr('name');
		var next = +imgNumber + 1;

		if(input.files.length != 0){
			imagesAndDimensions["image_"+imgNumber] = input.files[0];
		} else {
			console.log("No image selected");
		}
		
		let responseFn = function(rStatus, rText, rImages){
			if(rStatus == 200) {
				if(imgNumber == 0) {
					$(".addProfilePicture").addClass("light-blue");
					$(".addProfilePicture").removeClass("yellow darken-2");
					return;
				}
				
				$(saveImage).text("Delete Image");
				$(saveImage).attr("type", "");
				$(saveImage).addClass("delete");

			} else {
				if(imgNumber == 0) {
					$(".addProfilePicture").addClass("red darken-4");
					$(".addProfilePicture").removeClass("yellow");
					return;
				}
				
			}

			
		};
		
		if(imgNumber == 0){
			updateProfilePic(imagesAndDimensions);
		}

		couple.addPhotos(imagesAndDimensions, responseFn);
	});
	
});
