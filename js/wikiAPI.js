function getWikiInfo(name, callback) {

    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext&format=json&formatversion=2&callback=?&titles=' + name;

    $.getJSON(wikiURL, function (data) {
        var info = ''
        $.each(data.query.pages, function (i, item) {
            if (item.extract)
                info = info + '<p>' + item.extract + '</p>';
            else {
                info = '<p> No Information found</p>';
            }
        });
        callback(info);
    },
        function (er) {
            callback('Information not currently available');
        }
    );

}