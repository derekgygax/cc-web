
$(document).ready(function(){

	// Images object to keep track of the location of the image on the page
	let Images = {
			previewNodeName: "image_preview_",
			inputNodeName: "image_upload_",
			srcs: [],
			numFilesChanged: 0,
			
			getImgInfo: function(imgNode){
				return {
					'files': $(imgNode).find("input")[0].files,
					"url": $(imgNode).find(".image_preview").find("img").attr("src"),
					'crop_dimensions': $(imgNode).find("input").attr("data-crop_dimensions"),
				};
			},
			
			updateProfilePic: function(images){
				var url = window.URL.createObjectURL(images['image_0']);
				$("#profilePic").attr("style", "background-image: url("+url+")");
				
			},
			
			addSrc: function(imgNode){
				$(imgNode).find(".image_preview").css("min-height", "96px");
				$(imgNode).find(".image_upload_title").css("display", "none");
				let position = Number($(imgNode).find(".image_preview").attr("id").replace(this.previewNodeName, ""));
				let newSrc = this.getImgInfo(imgNode);

				this.srcs[position] = newSrc;
			},
			
			justMoving: function(previewNodeId){
				let position = Number(previewNodeId.replace(this.previewNodeName, ""));
				if (this.srcs[position].fileChanged){
					delete this.srcs[position].fileChanged;
					return true;
				} else {
					return false;
				}
			},
			
			drag: function(dragNodeId, dropNodeId){
				let dragPosition = Number(dragNodeId.replace(this.previewNodeName, ""));
				let dropPosition = Number(dropNodeId.replace(this.previewNodeName, ""));
				this.srcs.splice(
					dragPosition,
					1
				);
				let dragImageParent = $("#"+dragNodeId).closest(".image");
				this.srcs.splice(
					dropPosition, 
					0, 
					this.getImgInfo(dragImageParent)
				);
				this.populateNodes();
			},
			
			removeSrc: function(position){
				this.srcs.splice(
					position,
					1
				);
			},
			
			emptySrc: function(previewNodeId){
				let position = Number(previewNodeId.replace(this.previewNodeName, ""));
				this.removeSrc(position);
				let tmpInputTag = document.createElement("input");
				tmpInputTag.setAttribute("type", "file");
				let newSrc = {
						'files': tmpInputTag.files,
						"url": undefined,
						'crop_dimensions': undefined,
						"inSrc": undefined,
				};
				this.srcs.push(newSrc);				
				this.populateNodes();
			},
			
			populateSrcs: function(){
				let _this = this;
				$.each($(".image"), function(){
					_this.srcs.push(_this.getImgInfo(this))
					if(_this.getImgInfo(this).url) {
						$(this).find(".image_upload_title").css("display", "none");
						$(this).find(".image_preview").css("min-height", "96px");
					} else {
						$(this).find(".image_preview").css("min-height", "320px");
					}
				});
			},
			
			populateNodes: function(){
				let _this = this;
				$.each($(".image"), function(index, node){
					let url =  _this.srcs[index].url;
					let files = _this.srcs[index].files;
					let crop_dimensions = _this.srcs[index].crop_dimensions;
					if (files.length > 0 || document.getElementById(_this.inputNodeName + index).files.length > 0){
						_this.srcs[index].fileChanged = true;
					}
					if (url){
						$("#"+_this.previewNodeName + index).find("img").attr("src", _this.srcs[index].url);
						$("#"+_this.previewNodeName + index).parent().find(".image_upload_title").css("display", "none");
						$("#"+_this.previewNodeName + index).parent().find(".image_preview").css("min-height", "");
						
						if($("#"+_this.previewNodeName + index).find("img").height() < 180) {
							console.log($("#"+_this.previewNodeName + index).find("img"));
							$("#"+_this.previewNodeName + index).find("img").css("padding", "48px 0");
						} else {
							$("#"+_this.previewNodeName + index).find("img").css("padding", "");

						}

					
					} else {
						$("#"+_this.previewNodeName + index).find("img").removeAttr("src");
						$("#"+_this.previewNodeName + index).parent().find(".image_upload_title").css("display", "block");
						$("#"+_this.previewNodeName + index).parent().find(".image_preview").css("min-height", "320px");
						$("#"+_this.previewNodeName + index).find("img").css("padding", "");
					}
					
					document.getElementById(_this.inputNodeName + index).files = _this.srcs[index].files;

					if (crop_dimensions){
						document.getElementById(_this.inputNodeName + index).setAttribute("data-crop_dimensions", crop_dimensions);
						Cropper.dragReCrop($(this).find(".inputNode"), crop_dimensions);
					} else {
						$(document.getElementById(_this.inputNodeName + index)).removeAttr("data-crop_dimensions")
					}
				});
			},
		
		};
	
	let Cropper = {
			setup: function($previewNodeImg, imgId, inputId){
				let _this = this;
				this.$cropStation = $("#crop_station");
				this.$cropStation.find("img").attr("src", $previewNodeImg.attr("src"));
				this.$cropStation.attr("data-imgId", imgId);
				this.$cropStation.attr("data-inputId", inputId);
				this.selection = null;
				
				this.$cropStation.find("img").imgAreaSelect({
			        handles: true,
			        onSelectEnd: function(img, selection){
			        	_this.setSelectionDimensions(selection);
			        }
			    });
			    this.$cropStation.show();
			},
			
			setSelectionDimensions : function(selection){
				this.selection = selection;
			},
		
			setupImage: function(){
				let imgId = this.$cropStation.attr("data-imgId");
				let inputId = this.$cropStation.attr("data-inputId");
				let $imageNode = $("#"+imgId).find("img");
				let $inputNode = $("#" + inputId);
				
				let cropStationRect = this.$cropStation[0].getBoundingClientRect();
				let imgNodeRect = $imageNode[0].getBoundingClientRect();
				
				var imgNatHeight = $imageNode.prop("naturalHeight");
				var imgNatWidth = $imageNode.prop("naturalWidth");
				
				let xPercent = this.selection.x1/cropStationRect.width;
				let yPercent = this.selection.y1/cropStationRect.height;
				
				let widthPercent = this.selection.width/cropStationRect.width;
				let heightPercent = this.selection.height/cropStationRect.height;
				
				var betterBoundingBox = $("body").find(".imgareaselect-selection").parent();
			
				console.log(imgNatHeight);
				console.log(imgNatWidth);
				console.log(this.$cropStation[0].getBoundingClientRect());
				console.log(betterBoundingBox);
				console.log($(betterBoundingBox).css('left'));
				$inputNode.attr("data-crop_dimensions", Math.round(imgNatWidth * xPercent) + 
					","+Math.round(imgNatHeight * yPercent) +
					","+Math.round(imgNatWidth * widthPercent) +
					","+ Math.round(imgNatHeight * heightPercent)
				);
				
				
				let newImgWidth = imgNodeRect.width / widthPercent;
				let newImgHeight = imgNodeRect.height / heightPercent;
				
				let newX = newImgWidth * xPercent;
				let newY = newImgHeight * yPercent;

				console.log()
				$imageNode.css("margin-left", -newX);
				$imageNode.css("margin-top", -newY);
				$imageNode.css("width", newImgWidth);
				$imageNode.css("height", newImgHeight);
				
				this.$cropStation.find("img").imgAreaSelect({
					disable:true,
					hide:true
				});
				this.$cropStation.hide();
			},
			
			dragReCrop: function($inputNode, cropDimensions){
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
				
//				TODO
//				Need to do this still!!!
				
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
//				TODO
//				Need to do this still!!!
				
//				TODO
//				Need to do this still!!!
				return;
				// fixing dereks shitty spelling
				let $imageNode = $inputNode.siblings(".image_preview").find("img");
				var imgNatHeight = $imageNode.prop("naturalHeight");
				var imgNatWidth = $imageNode.prop("naturalWidth");
				cropDimensions = cropDimensions.split(",");
				
				let xPercent = cropDimensions[0] / imgNatWidth;
				let yPercent = cropDimensions[1] / imgNatHeight; 
				let wPercent =  cropDimensions[2] / imgNatWidth;
				let hPercent =  cropDimensions[3] / imgNatHeight;
				
				let imgNodeRect = $imageNode[0].getBoundingClientRect();
				
				$imageNode.css("margin-left", -newX);
				$imageNode.css("margin-top", -newY);
				$imageNode.css("width", newImgWidth);
				$imageNode.css("height", newImgHeight);
				
			}
			
	};
	
	$("body").on("click", ".upload", function(){
		let $imageUploadNode = $(this).closest(".image-wrapper").find("input.image_upload");
		if ($imageUploadNode.attr("data-crop_dimensions")){
			$imageUploadNode.removeAttr("data-crop_dimensions");
		}
		$imageUploadNode.click();
	});
	
	
	$("body").on('change', '.image_upload', function(){
		if (!Images.justMoving($(this).siblings(".image_preview").attr("id"))){
			var photoId = $(this).attr("name");
			let file = this.files[0];
			if (file){
				$(this).siblings(".image_preview").find("img").attr("src",window.URL.createObjectURL(file));
			}
			$(this).siblings(".image_preview").find("img").attr("draggable", true);
			Images.addSrc($(this).closest(".image"));
			
			var tmpImg = new Image();
			var img = $(this).siblings(".image_preview").find("img");
			if(file) {
			tmpImg.src = window.URL.createObjectURL(file);
			$(tmpImg).one('load',function(){
				  orgHeight = tmpImg.height;
				  if(orgHeight < 180) {
					  $(img[0]).css("padding", "48px 0");
				  }
			});
			}
			
			if(photoId == 0) {
				$(".profilePicSave").attr("style", "")
			}
		}

	});
	
	$("body").on("click", ".openCrop", function(){
		var toCrop = $(this).parent().parent().find(".image .image_preview img");

	    $("#cropImage").attr('src', $(toCrop).attr('src'));
	    var $image = $('#cropImage');

	    $image.cropper({
	      aspectRatio: 16 / 9,
	      crop: function(event) {
	        console.log(event.detail.x);
	        console.log(event.detail.y);
	        console.log(event.detail.width);
	        console.log(event.detail.height);
	        console.log(event.detail.rotate);
	        console.log(event.detail.scaleX);
	        console.log(event.detail.scaleY);
	      }
	    });

		
		console.log(localStorage);
		

		Cropper.setup(
			$(this).parent().parent().find(".image .image_preview img"), 
			$(this).parent().parent().find(".image .image_preview").attr("id"),
			$(this).parent().parent().find(".image input").attr("id")
		);
	});
	
    $("body").on("click", "#performCropping", function(){
    	Cropper.setupImage();
    });	
    
    
    $("body").on("click", ".removeImage", function(){
    	let $imageNode = $(this).closest(".image");
    	$imageNode.find("img").removeAttr("src");
    	Images.emptySrc($imageNode.find(".image_preview").attr("id"));
    });
    
	$("body").on("submit", ".uploadImagesForm", function(event){
		event.preventDefault();
		let form = event.target
		let elements = form.elements;
		let imagesAndDimensions = {};
		let imgsToDelete = [];
		let imgNumber = 0;
		for (let i = 0; i < elements.length; i++){
			var element = elements[i];
			if (element.type == "file"){
				if (element.files.length != 0){
					imagesAndDimensions["image_"+imgNumber] = element.files[0];
					if (element.getAttribute("data-crop_dimensions")){
						imagesAndDimensions["cropDimensions_"+imgNumber] = element.getAttribute("data-crop_dimensions");
					}
					imgNumber++;
				} else {
					let $imgNode = $(element).closest(".image");
					if($imgNode.find("img").attr("src")){
						imagesAndDimensions["url_"+imgNumber] = $imgNode.find("img").attr("src");
						imgNumber++;
					} else {
						imgsToDelete.push(imgNumber);
//						imagesAndDimensions["blank_"+imgNumber] = "delete";
						imgNumber++;
					}
				}
			}
		}
		
		let responseFn = function(rStatus, rText, rImages){
			console.log("reg response");
			console.log(rStatus);
			console.log(rText);
			if(rStatus == 200) {
				$(".addProfilePicture").addClass("light-blue");
				$(".addProfilePicture").removeClass("green");
			} else {
				$(".addProfilePicture").addClass("red darken-4");
				$(".addProfilePicture").removeClass("green");
			}


			
			Images.updateProfilePic(rImages);
		};
		let deleteResponseFn = function(rStatus, rText){
			console.log("delete response");
			console.log(rStatus);
			console.log(rText);
		}
		let couple = Object.create(Couple);

		couple.addPhotos(imagesAndDimensions, responseFn);

		Images.updateProfilePic(imagesAndDimensions);
		$(".addProfilePicture").addClass("green");
		$(".addProfilePicture").removeClass("light-blue");
		if (imgsToDelete.length > 0){
			couple.deletePhotos(imgsToDelete.join(), deleteResponseFn);
		}
		
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

	$("body .image_preview img").on({
		"dragstart": function(event){
			if (Storage){
				sessionStorage.setItem("nodeDragging", $(event.target).closest(".image_preview").attr('id'));
			}
		},
		"dragend": function(event){
			sessionStorage.removeItem("nodeDragging");
		},
	    'dragover dragenter': function(e) {
	    	this.style.cursor = "copy";
	    },
	    'dragleave': function(e){
	    	this.style.cursor = "default";
	    },
		
	});

	$("body .image_preview").on({
		'drop': function(event){
	        var dataTransfer =  event.originalEvent.dataTransfer;
	        if (dataTransfer && dataTransfer.files.length) {
	        	$(this).siblings(".image_upload")[0].files = dataTransfer.files
	        } else {
				Images.drag(
					sessionStorage.getItem("nodeDragging"),
					$(event.target).closest(".image_preview").attr('id')
				);
	        }
		}
	});
	
	(function(){
		Images.populateSrcs();
	})();

});
