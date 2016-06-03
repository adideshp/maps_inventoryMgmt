
var Warehouse = {'city': 'Leipzig' , 'geoLocations' : {lat: 51.3397, lng: 12.3731}};


function MenuController($scope, $mdDialog) {
    //$scope.currentRouteStart,$scope.currentRouteEnd,$scope.currentRouteStartFormatted,$scope.currentRouteEndFormatted;
	$scope.routeMarkingStarted = false;
	$scope.routesList = [];
	$scope.routeLine;
	$scope.marker = [];
	$scope.defaultMarkers = [
		{'city': 'Munich' , 'geoLocations' : {lat: 48.1351, lng: 11.5820}},
		{'city': 'Hamburg' , 'geoLocations' : {lat: 53.5511, lng: 9.9937}},
		{'city': 'Berlin' , 'geoLocations' : {lat: 52.5200, lng: 13.4050}},
		{'city': 'Frankfurt' , 'geoLocations' : {lat:50.1109, lng: 8.6821}},
		{'city': 'Cologne' , 'geoLocations' : {lat: 50.9375, lng: 6.9603}},
		{'city': 'Hannover' , 'geoLocations' : {lat: 52.3759, lng: 9.7320}},
		{'city': 'Stuttgart' , 'geoLocations' : {lat: 48.7758, lng: 9.1829}},
		{'city': 'Dresden' , 'geoLocations' : {lat: 51.0504, lng: 13.7373}},
	];
    $scope.colourBox = ('Red Green Blue Yellow Black White Brown').split(' ').map(function(colour) {
    	return {name: colour};
    });    

    
    $scope.initMap = function() {
            $scope.map = new google.maps.Map(document.getElementById('map'), {
              center: Warehouse['geoLocations'],
              mapTypeControl: false,
              streetViewControl: false,
              zoom: 6
            });
    };


	$scope.addDefaultMarkers = function() {
		for (i=0;i< $scope.defaultMarkers.length; i++) {
			$scope.marker[i] = new google.maps.Marker({
			position: $scope.defaultMarkers[i]['geoLocations'],
			map: $scope.map,
			title: $scope.defaultMarkers[i]['city'] + '_marker'
			});
			$scope.marker[i].addListener('click', function(event) {
				$scope.routeMarkingStarted = !$scope.routeMarkingStarted;
				if ($scope.routeMarkingStarted) {
					console.log("Starting from Source of route");
					$scope.currentRouteStart = new google.maps.LatLng(event.latLng.lat().toFixed(4), event.latLng.lng().toFixed(4));
					$scope.currentRouteStartFormatted = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
					$scope.addRouteLine($scope.currentRouteStartFormatted, $scope.currentRouteStartFormatted, []);
					$scope.map.addListener('mousemove', function(event) {
						destination = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
						$scope.updateRouteLine($scope.currentRouteStartFormatted, destination);
					});
				} else {
					$scope.currentRouteEnd = new google.maps.LatLng(event.latLng.lat().toFixed(4), event.latLng.lng().toFixed(4));
					$scope.currentRouteEndFormatted = {lat : parseFloat(event.latLng.lat().toFixed(4)), lng: parseFloat(event.latLng.lng().toFixed(4))};
					$scope.deleteRouteLine();
					if ($scope.currentRouteStart.lat() ==  $scope.currentRouteEnd.lat() && $scope.currentRouteStart.lng() == $scope.currentRouteEnd.lng()) {
						console.log("[Unacceptable] Source and Destination are same.");
					} else {
						console.log("reached Destination of the route");
						$scope.displayRoute($scope.currentRouteStart,$scope.currentRouteEnd);
					}
				}
			});
		}
	};

	$scope.findCity = function(latitude, longitude) {
		latitude = Number((latitude).toFixed(4));
		longitude = Number((longitude).toFixed(4));
		for (var i=0; i<$scope.defaultMarkers.length; i++) {
			if ($scope.defaultMarkers[i].geoLocations.lat == latitude && $scope.defaultMarkers[i].geoLocations.lng ==longitude) {
				return $scope.defaultMarkers[i].city;
			} 
		}
		return null;
	}
 

	$scope.displayRoute = function(start, end) {
		var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
		directionsDisplay.setMap($scope.map); // map should be already initialized.

		var request = {
		    origin : start,
		    destination : end,
		    travelMode : google.maps.TravelMode.DRIVING
		};
		var directionsService = new google.maps.DirectionsService(); 
		directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		        //directionsDisplay.setDirections(response); <-- Google's way of displaying a path
		        console.log("Response Successful");
		        console.log(response.routes[0].legs[0].distance.text);
		        var routeInfo = {
		        	'source' : $scope.findCity(start.lat(), start.lng()), 
					'destination': $scope.findCity(end.lat(), end.lng()), 
					'distance': response.routes[0].legs[0].distance.text
		        };
		        $scope.addValidRouteLine(response.routes[0].overview_path, routeInfo);
		    }
		});
	};

	$scope.updateRouteLine = function(source, newDestination) {
		var pathArray =[];
		pathArray.push(source);
		pathArray.push(newDestination);
		$scope.routeLine.setPath([]);
		$scope.routeLine.setPath(pathArray);
	}

	$scope.deleteRouteLine = function() {
		$scope.routeLine.setMap(null);	
	}

	$scope.addRouteLine = function(source, destination, points) {
		$scope.routeLine = null;
		points.push(source);
		points.push(destination);
		$scope.routeLine = new google.maps.Polyline({
			path: points,
			geodesic: true,
			strokeColor: '#5f84f2',
			strokeOpacity: 2.0,
			strokeWeight: 2
		});
		$scope.routeLine.setMap($scope.map);
	}


	$scope.addValidRouteLine = function(points,routeInfo) {
		line = new google.maps.Polyline({
			path: points,
			geodesic: true,
			strokeColor: '#5f84f2',
			strokeOpacity: 5.0,
			strokeWeight: 5
		});
		line.setMap($scope.map);
		var routeList = {
			'source' : routeInfo.source, 
			'destination': routeInfo.destination, 
			'distance': routeInfo.distance, 
			'polylineObject': []
		};
		routeList.polylineObject.push(line);
		$scope.routesList.push(routeList);
		$scope.$apply();
		console.log($scope.routesList);
	}

	$scope.doSecondaryAction = function(event) {
    	$mdDialog.show(
	      $mdDialog.alert()
	        .title('Secondary Action')
	        .textContent('Secondary actions can be used for one click actions')
	        .ariaLabel('Secondary click demo')
	        .ok('Neat!')
	        .targetEvent(event)
    	);
  	};

  	$scope.deleteRoute = function(index) {
  		$scope.routesList[index].polylineObject[0].setMap(null);
  		var source = $scope.routesList[index].source;
  		var destination = $scope.routesList[index].destination;
  		if (index == 0) {$scope.routesList.splice(index,index+1);}
  		else {$scope.routesList.splice(index,index);}
  		console.log("Route " + source + " to " + destination + " deleted successfully.");
  	}



	/*Function calls after the controller is loaded*/
	$scope.initMap();
	$scope.addDefaultMarkers();

}
