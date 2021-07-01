////This is an object for sending an XMLHttpRequest
//
"use strict";

var XHR = {
		
		sendRequestThroughRouter: function(apiServlet, method, pathExtension, data, responseFn){
			this.sendLocalRequest(
				CONFIGURATION.LOCAL_SERVLET.ROUTER,
				apiServlet,
				method,
				pathExtension,
				data,
				responseFn
			);
		},
		
		sendSynchRequestThroughRouter: function(apiServlet, method, pathExtension, data, responseFn){
			this.sendSynchLocalRequest(
				CONFIGURATION.LOCAL_SERVLET.ROUTER,
				apiServlet,
				method,
				pathExtension,
				data,
				responseFn
			);
		},
		
		// This is completely static so you can use it directly
		sendLocalRequest: function(localServlet, apiServlet, method, pathExtension, data, responseFn){
			var request = new XMLHttpRequest();
			request.open("POST", localServlet, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.onload = function(e){
				$(document).trigger("ajaxFinishedLoading", {'localServlet': localServlet, 'xhr': request, 'response': this.response});
				responseFn(this.status, this.response);
			};
			request.onerror = function(f){
				console.log(f.stack);
			};
			let info_to_send = this.configureInfoToSend(apiServlet, method, pathExtension, data);
			request.send(info_to_send);
		},
		
		// This sends data like a GET request would
		sendLocalDeleteRequest: function(localServlet, data, responseFn){
			var request = new XMLHttpRequest();
			let url = localServlet+"?data="+data;
			console.log(url);
			request.open("DELETE", url, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.onload = function(e){
				$(document).trigger("ajaxFinishedLoading", {'localServlet': localServlet, 'xhr': request, 'response': this.response});
				responseFn(this.status, this.response);
			};
			request.onerror = function(f){
				console.log(f.stack);
			};
			request.send(null);		
		},
		
		//TODO
		//This is the same as above. Put them together
		sendSynchLocalRequest: function(localServlet, apiServlet, method, pathExtension, data, responseFn){	
			var request = new XMLHttpRequest();
			request.open("POST", localServlet, false);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.onload = function(e){
				$(document).trigger("ajaxFinishedLoading", {'localServlet': localServlet, 'xhr': request, 'response': this.response});
				responseFn(this.status, this.response);
			};
			request.onerror = function(f){
				console.log(f.stack);
			};
			let info_to_send = this.configureInfoToSend(apiServlet, method, pathExtension, data);
			request.send(info_to_send);
		},
		
		sendBeaconThroughRouter: function(apiServlet, method, pathExtension, data){
			let infoToSend = this.configureInfoToSend(apiServlet, method, pathExtension, data);
			// Send the beacon
			let status = navigator.sendBeacon(CONFIGURATION.LOCAL_SERVLET.ROUTER, infoToSend);
			if (!status){
				//TODO
				//Do something!!!!
			}
		},
		
		sendLocalMultipPartRequest: function(localServlet, apiServlet, method, pathExtension, data, responseFn){
			var request = new XMLHttpRequest();
			request.open("POST", localServlet, true);
			request.onload = function(e){
				$(document).trigger("ajaxFinishedLoading", {'localServlet': localServlet, 'xhr': request, 'response': this.response});
				responseFn(this.status, this.response);
			};
			request.onerror = function(f){
				console.log(f.stack);
			};
			let formData = new FormData();
			for (let dataId in data){
				formData.append(dataId, data[dataId]);
			}
			request.send(formData);			
		},
		
		configureInfoToSend: function(apiServlet, method, pathExtension, data){
			let infoToSend = "servlet="+apiServlet;
			infoToSend +="&method="+method;
			infoToSend += "&path_extensions="+JSON.stringify(pathExtension);
			infoToSend += "&data="+encodeURIComponent(JSON.stringify(data));
			return infoToSend;
		},
	};

