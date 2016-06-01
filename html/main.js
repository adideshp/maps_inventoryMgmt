var map;

function initMap() {
	var myLatLng = {lat: -25.363, lng: 131.044};
		map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		mapTypeControl: false,
		streetViewControl: false,
		zoom: 8	
	});

	var marker = new google.maps.Marker({
	position: myLatLng,
	map: map,
	title: 'Hello World!'
	});
}