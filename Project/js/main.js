var currentRouteStart,currentRouteEnd,currentRouteStartFormatted,currentRouteEndFormatted;
var routeMarkingStarted = false;
var routeLines = [];
var routeLine;
var Warehouse = {'city': 'Leipzig' , 'geoLocations' : {lat: 51.3397, lng: 12.3731}};
var marker = [];
var defaultMarkers = [
	{'city': 'Munich' , 'geoLocations' : {lat: 48.1351, lng: 11.5820}},
	{'city': 'Hamburg' , 'geoLocations' : {lat: 53.5511, lng: 9.9937}},
	{'city': 'Berlin' , 'geoLocations' : {lat: 52.5200, lng: 13.4050}},
	{'city': 'Frankfurt' , 'geoLocations' : {lat:50.1109, lng: 8.6821}},
	{'city': 'Cologne' , 'geoLocations' : {lat: 50.9375, lng: 6.9603}},
	{'city': 'Hannover' , 'geoLocations' : {lat: 52.3759, lng: 9.7320}},
	{'city': 'Stuttgart' , 'geoLocations' : {lat: 48.7758, lng: 9.1829}},
	{'city': 'Dresden' , 'geoLocations' : {lat: 51.0504, lng: 13.7373}},
];


function addDefaultMarkers() {
for (i=0;i< defaultMarkers.length; i++) {
	marker[i] = new google.maps.Marker({
	position: defaultMarkers[i]['geoLocations'],
	map: map,
	title: defaultMarkers[i]['city'] + '_marker'
	});
	marker[i].addListener('click', function(event) {
		routeMarkingStarted = !routeMarkingStarted;
		if (routeMarkingStarted) {
			console.log("Starting from Source of route");
			currentRouteStart = new google.maps.LatLng(event.latLng.lat().toFixed(4), event.latLng.lng().toFixed(4));
			currentRouteStartFormatted = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
			addRouteLine(currentRouteStartFormatted, currentRouteStartFormatted, []);
			map.addListener('mousemove', function(event) {
				destination = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
				updateRouteLine(currentRouteStartFormatted, destination);
			});
		} else {
			console.log("reached Destination of the route");
			deleteRouteLine();
			currentRouteEnd = new google.maps.LatLng(event.latLng.lat().toFixed(4), event.latLng.lng().toFixed(4));
			currentRouteEndFormatted = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
			displayRoute(currentRouteStart,currentRouteEnd);
		}
		
		});
}
}


function displayRoute(start, end) {
	var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
	directionsDisplay.setMap(map); // map should be already initialized.

	var request = {
	    origin : start,
	    destination : end,
	    travelMode : google.maps.TravelMode.DRIVING
	};
	var directionsService = new google.maps.DirectionsService(); 
	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	        //directionsDisplay.setDirections(response);
	        console.log("Response Successful");
	        addValidRouteLine(response.routes[0].overview_path);
	    }
	});
}

function updateRouteLine(source, newDestination) {
	var pathArray =[];
	pathArray.push(source);
	pathArray.push(newDestination);
	routeLine.setPath([]);
	routeLine.setPath(pathArray);
}

function deleteRouteLine() {
	routeLine.setMap(null);	
}

function addRouteLine(source, destination, points) {
	routeLine = null;
	points.push(source);
	points.push(destination);
	routeLine = new google.maps.Polyline({
		path: points,
		geodesic: true,
		strokeColor: '#5f84f2',
		strokeOpacity: 2.0,
		strokeWeight: 2
	});
	routeLine.setMap(map);
}


function addValidRouteLine(points) {
	line = null;
	line = new google.maps.Polyline({
		path: points,
		geodesic: true,
		strokeColor: '#5f84f2',
		strokeOpacity: 5.0,
		strokeWeight: 5
	});
	line.setMap(map);
	routeLines.push(line);
}
