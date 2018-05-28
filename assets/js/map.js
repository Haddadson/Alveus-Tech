var map;
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: -19.9206343, lng: -43.9201332},
     zoom: 16,

   });

   var marker = new google.maps.Marker({
     position: {lat: -19.9206343, lng: -43.9201332}, //Latitude e longitude do marcador
     map: map,
     animation: google.maps.Animation.DROP, // Animaçã do marcador caindo de cima
     title: 'Alveus Tech', // Título ao colocar o mouse em cima

     //Marcador personalizado
     icon: {
       url: '../assets/img/alveus-map-marker.png',
       scaledSize: new google.maps.Size(75, 120)
     }
   });
}
