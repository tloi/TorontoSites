﻿var geocoder = new google.maps.Geocoder();
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
function markSite(site) {
    if (site.geo) {
        var marker = new google.maps.Marker({
            position: site.geo,
            map: map,
            title: site.address
        });
        getWikiInfo(site.wikiName, function (data) {
            site.infoWindow = new google.maps.InfoWindow({
                content: data
            });
            marker.addListener('click', function () {
                site.infoWindow.open(map, marker);
            });
        });


        return marker;
    };
    return null;

}

function clearMarker(sites) {
    for (var x = 0; x < sites.length; x++) {
        if (sites[x].marker) sites[x].marker.setMap(null);
    }
}


function markSites(sites, map) {
    for (var x = 0; x < sites.length; x++) {
        if (sites[x].marker) sites[x].marker.setMap(map);
    }
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

var Site = function (name, address, wikiName) {
    var self = this;
    self.name = name;
    self.address = address;
    self.wikiName = wikiName;
    getLongLat(address, function (data) {
        self.geo = data;
        self.marker = markSite(self);
    });
    return self;
};