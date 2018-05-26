var map;
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: -19.9206343, lng: -43.9201332},
     zoom: 16,

   });

   var marker = new google.maps.Marker({
     position: {lat: -19.9206343, lng: -43.9201332}, // lat/long of marker
     map: map,
     animation: google.maps.Animation.DROP, // drops marker in from top
     title: 'Alveus Tech', // title on hover over marker
     // icon: {
     //   url: '../assets/img/alveus-map-marker.png',
     //   scaledSize: new google.maps.Size(75, 120)
     // }
   });
}
