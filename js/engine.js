/*property
    Animation, BOUNCE, GeocoderStatus, InfoWindow, Marker, OK, addListener,
    address, content, geo, geocode, geometry, getAnimation, infoWindow, lat,
    lng, location, map, maps, marker, open, position, setAnimation, title,
    wikiName
*/
"use strict";
var geocoder, map;

//***** site map and marker ***************//
function getLongLat(address, callback, callbackError) {
    if (geocoder) {
        geocoder.geocode({
            "address": address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
            }
            else {
                callbackError(status);
            }
        });
    }
}

function markSite(site) {
    if (site.geo) {
        var marker = new google.maps.Marker({
            position: site.geo,
            map: map,
            title: site.address
        });
        marker.addListener("click", function () {
            site.showSiteInfo();
        });
        
        return marker;
    }
    return null;
}
/*
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
*/
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
    
    self.setLongLat = function () {
        getLongLat(address, function (data) {
            self.geo = data;
            self.marker = markSite(self);
        }, function (er) {
            self.geo = null;
            self.marker = markSite(self);
        }
        );
    };
    
    self.showSiteInfo=function() {
        if (self.marker) {
            if (self.infoWindow) {
                self.infoWindow.open(map, self.marker);
            }
            else {
                getWikiInfo(self.wikiName, function (data) {
                    self.infoWindow = new google.maps.InfoWindow({
                        content: data
                    });
                    self.infoWindow.open(map, self.marker);
                }, function (er) {
                    self.infoWindow = new google.maps.InfoWindow({
                        content: "Currently no information available"
                    });
                    self.infoWindow.open(map, self.marker);
                });
            }
            if (self.marker.getAnimation() !== null) {
                self.marker.setAnimation(null);
            } else {
                self.marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        } else {
            alert("Address could not be located");
        }

    }
    return self;
};
//**** End of Site Map and Marker  **************//

// Wikipedia API
function getWikiInfo(name, callback,callbackError) {

    var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext&format=json&formatversion=2&callback=?&titles=" + name;

    $.getJSON(wikiURL, function (data) {
        var info = "";
        $.each(data.query.pages, function (i, item) {
            if (item.extract)
                info = info + "<p><a href='https://en.wikipedia.org/wiki/" + item.title + "'><h3>" + item.title + "</h3></a>" + item.extract + "</p>";
            else {
                info = "<p> No Information found</p>";
            }
        });
        callback(info);
    })
    .fail(function (er){callbackError(er)});

}

// Overall viewmodel for this screen, along with initial state
function OntarioViewModel(sites) {

    var self = this;
    self.sites = sites;
    //controller
    self.filterSiteValue = ko.observable("");
    self.filteredSiteList = ko.computed(function () {
        var query = self.filterSiteValue().toLowerCase();
        return ko.utils.arrayFilter(self.sites, function (site) {
            //console.log(site.marker);            
            if (site.name.toLowerCase().indexOf(query) > -1) {
                if (site.marker) site.marker.setMap(map);
                return true;
            } else {
                if (site.marker) site.marker.setMap(null);
                return false
            };
        });
    });
        /*
    self.filteredSiteList = ko.computed(function () {
        if (self.filteredSiteList) {
            var oldFSL = self.filteredSiteList();
            clearMarker(oldFSL, null);
        }
        
        function getFilteredSite() {
            if (!self.filterSiteValue()) {
                return self.sites;
            } else {
                return ko.utils.arrayFilter(self.sites, function (e) {
                    if (e.name.toLowerCase().indexOf(self.filterSiteValue().toLowerCase()) >= 0) return e;
                });
            }
        }
        
        var newFilteredSite = getFilteredSite();
        markSites(newFilteredSite, map);
        return newFilteredSite;
    });
    */
    self.toggleMenu = function () {
        $("#sidebar").toggleClass("hideAside");
    };
}
var OntarioSites = [
                    new Site("Niagara on the Lake", "Niagara-on-the-Lake, Ontario", "Niagara-on-the-Lake"),
                    new Site("Bruce Peninsula", "Bruce Peninsula, Northern Bruce Peninsula, ON", "Bruce Peninsula"),
                    new Site("Niagara Falls", "Niagara Falls, Ontario", "Niagara Falls"),
                    new Site("Toronto CN Tower", "301 Front St W, Toronto, ON, M5V 2T6", "CN Tower"),
                    new Site("Ottawa Parliament Hill", "Wellington St, Ottawa, ON", "Parliament Hill")
];
OntarioSites.sort(compare);

$(function () {
    var viewModel = new OntarioViewModel(OntarioSites);
    ko.applyBindings(viewModel);
});