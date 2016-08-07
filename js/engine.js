'use strict'

// Overall viewmodel for this screen, along with initial state
function OntarioViewModel(sites) {

    var self = this;
    self.sites = sites;
    //controller
    self.filterSiteValue = ko.observable('');

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
    self.markMap = function (t) {
        if (t.infoWindow) {
            t.infoWindow.open(map, t.marker);
        }

    }
    self.toggleMenu = function () {

        $('#sidebar').toggleClass('hideAside');
    }

}

