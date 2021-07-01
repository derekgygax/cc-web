// TODO
//This really needs to be fixed changed!!

$("body").on("click", ".logout", function(e){
	for (let i = 0; i < CONFIGURATION.IN_LOCAL_STORAGE.length; i++){
		delete localStorage[CONFIGURATION.IN_LOCAL_STORAGE[i]];
	}
	window.location.href = CONFIGURATION.WEBPAGES.LOGIN;
});
