var geocoder = new google.maps.Geocoder();
// Create a map object and specify the DOM element for display.
var map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 43.6534922,
        lng: -79.3839729
    },
    scrollwheel: false,
    zoom: 6
});


function getLongLat(address, callback) {
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            callback({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            });
        }
    });
}