function initialize() {

	var styles =[
  {
    "featureType": "road.local",
    "stylers": [
      { "color": "#3a474a" }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "color": "#2a2e2f" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "color": "#2a2e2f" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#2a2e2f" }
    ]
  },{
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "visibility": "on" },
      { "color": "#2a2e2f" }
    ]
  },{
    "featureType": "road.arterial",
    "stylers": [
      { "visibility": "on" },
      { "color": "#2a2e2f" }
    ]
  },{
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" }
    ]
  },{
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
  }
];

var mapCanvas = document.getElementById('map');

var mapOptions = {
	center: new google.maps.LatLng(28.364, 75.587),
	zoom: 16,
	scrollwheel: false,          					 //disables scrollwheel zoom of mouse
	disableDefaultUI: true,						//disables everymarker(man,zoom control,pan control)
	//panControl: false,						//disables pan control
	//streetViewControl: false,					//disables man png
	zoomControl: true,     						   //zoom control enables
	zoomControlOptions:
		{
		style: google.maps.ZoomControlStyle.LARGE,  			//enables the dimension
		position: google.maps.ControlPosition.TOP_RIGHT 		 //position enables
		},
//mapTypeControl: false,
//scaleControl: false,
//draggable: false,

	mapTypeId: google.maps.MapTypeId.ROADMAP
}
       




var map = new google.maps.Map(mapCanvas, mapOptions)  ;   
var styledMap = new google.maps.StyledMapType( styles, {name: "Styled Map"} );
map.mapTypes.set('map_style', styledMap);
map.setMapTypeId('map_style');   
var locations= [28.364, 75.587];
var image = 'marker.png';
marker = new google.maps.Marker({ position: new google.maps.LatLng(28.364, 75.5871271),map: map ,icon: image });
}
    

    