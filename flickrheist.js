/**
 * FlickrHeist photo plugin
 */
(function($){

    $.fn.flickrHeist = function(options) {
        "use strict";

        var settings = $.extend({}, $.fn.flickrHeist.defaults, options);

        //-- Flickr REST url/services
        var FLICKR = {
            REST_URL: 'http://www.flickr.com/services/rest/',
            SEARCH: 'flickr.photos.search',
            GETINFO: 'flickr.photos.getInfo',
            APIKEY: settings.apikey,
            FORMAT: 'json'
        };

        //-- Flickr URL parameters
        FLICKR.PARAMS = {
            SEARCH: {
                'api_key': FLICKR.APIKEY,
                'method': FLICKR.SEARCH, //replace with required REST service
                'format': FLICKR.FORMAT,
                'tags': settings.tags,
                'safe_search': settings.safe_search,
                'pages': '1',
                'per_page': settings.number_photos,
                'nojsoncallback': '1',
                'sort': settings.sortby,
                'extras': settings.size + ',geo,owner_name',
                'has_geo': '1',
                'min_upload_date': settings.min_date
            },
            GETINFO: {
                'api_key': FLICKR.APIKEY,
                'photo_id': null,
                'format': FLICKR.FORMAT,
            }            
        };

        //-- Plugin system vars
        var vars = {
            status:         null,
            target:         this,
            today:          new Date().setHours(0,0,0,0),
            jsonmodel:      {
                'creation_date': null,
                'real_total': null,
                'items': []
            },
            photoSearchUrl: FLICKR.REST_URL + '?' + $.param(FLICKR.PARAMS.SEARCH)
        };
        vars.jsonmodel.creation_date = vars.today;

        /**
         * Start this party!
         */
        var _init = function(data) {
            vars.status = 'initialized';
            _fetchPhotos();
        };


        /**
         * Check if LocalStorage exists for 'flickrHeist'
         */
        var _verifyLocalStorageData = function(data) {
            if(localStorage && localStorage.getItem('flickrHeist')) {
                return true;
            } else {
                return data;
            }
        };

        /**
         * Are we running 'debug' here?
         */
        var _theBugger = function () {
            if(window.location.search.indexOf("flickrheist=debug")) {
                settings.debug++;
            }
            if (settings.debug === true) {
                settings.debug++;
            }
            return settings.debug;
        };


        /**
         * Get JSON from LocalStorage
         */
        var _fetchLocalStorageData = function() {
            return JSON.parse(localStorage.getItem('flickrHeist'));
        };


        /**
         * Store JSON to LocalStorage
         */
        var _storeLocalStorageData = function(data) { //JSON data coming in
            if(_verifyLocalStorageData(data) !== true || data.creation_date !== vars.today) {
                localStorage.setItem('flickrHeist', JSON.stringify(data));
            }
        };


        /**
         * Generate a random number from length of items
         */
        var _randomizeItem = function(data) {
            return Math.floor(Math.random() * data.real_total);
        };


        /**
         * Fetch Flicks photos by tag
         */
        var _fetchPhotos = function() {

            if (_verifyLocalStorageData(vars.jsonmodel) === true && _theBugger() <= 0) {

                _dropPhoto(_fetchLocalStorageData());

            } else {

                $.ajax({
                    url: vars.photoSearchUrl,
                    dataType: 'json',
                    data: JSON,
                    error: function(data, error, res) {
                        throw new Error(error);
                    },
                    success: function(data) {
                        vars.jsonmodel.real_total = 0;
                        $.each(data.photos.photo, function(i, item) {
                            if (item[settings.size] !== undefined) {
                                vars.jsonmodel.real_total++;
                                vars.jsonmodel.items.push({
                                    'id': item.id,
                                    'details': {
                                        'src': item[settings.size],
                                        'title': item.title,
                                        'ownername': '',
                                        'place_id': item.place_id,
                                        'geo': {
                                            'city': '',
                                            'country': ''
                                        },
                                        'page_url': ''
                                    }
                                });
                            }
                        });
                        _storeLocalStorageData(vars.jsonmodel);
                    },
                    complete: function(data) {
                        _dropPhoto(vars.jsonmodel);
                    }
                });
            }
        };

        //-- Fetch Flickr photo info
        var _fetchPhotoInfo = function() {
            var flickrPhotoGetInfoParams = {
                'method': FLICKR.GETINFO,
                'api_key': FLICKR.PARAMS.api_key,
                'photo_id': photo_id,
                'format': FLICKR.PARAMS.format,
                'nojsoncallback': '1'
            },
                flickrPhotoInfoParams = $.param(flickrPhotoGetInfoParams),
                flickrPhotoInfoUrl = FLICKR.REST_URL + '?' + flickrPhotoInfoParams;

            $.ajax({
                url: flickrPhotoInfoUrl,
                dataType: 'json',
                data: JSON,
                error: function(data) {
                    console.info('PhotoInfo: error');
                },
                success: function(data) {
                    console.info('PhotoInfo: success');
                    $.each(photos.items, function(i, object) {
                        if (object.id === photo_id) {

                            photos.items[i].details.page_url = data.photo.urls.url[0]._content;

                            if (data.photo.location.locality) photos.items[i].details.geo.city = data.photo.location.locality._content;
                            if (data.photo.location.country) photos.items[i].details.geo.country = data.photo.location.country._content;

                            if (data.photo.owner.realname) {
                                photos.items[i].details.ownername = data.photo.owner.realname;
                            } else {
                                photos.items[i].details.ownername = data.photo.owner.username;
                            }
                        }
                    });
                },
                complete: function(data) {
                    console.info('PhotoInfo: complete');
                    var $photoDetails = $('<ul/>'),
                        $photoOwner = $('<li><a href="' + photos.items[settings.random].details.page_url + '" title="' + photos.items[settings.random].details.title._content + '"><i class="fi-social-flickr"></i>' + photos.items[settings.random].details.ownername + '</a></li>'),
                        $photoLocation = $('<li><i class="fi-marker"></i>' + photos.items[settings.random].details.geo.city + ', ' + photos.items[settings.random].details.geo.country + '</li>');

                    $photoDetails.append($photoOwner, $photoLocation);
                    $('.cover-details', $targetDOM).html($photoDetails);

                    $targetDOM.removeClass('cover-loading');

                    localStorage.setItem('zeitgeistFlickrPhotosRequest', JSON.stringify(photos));
                }
            });
        };

        var _dropPhoto = function(data) {
            
            var template = Handlebars.compile(settings.phototemplate);
            vars.target.html( template( data.items[_randomizeItem(data)] ) );

            _complete();
        };

        var _complete = function() {
            if( $.isFunction(settings.complete) ) {
                settings.complete.call();
            }
        };

        return _init();

    };

    $.fn.flickrHeist.defaults = {
        apikey:             null,
        tags:               'zeitgeist', //comma separated list
        refresh:            24,
        safe_search:        '0', //safe_search on/off
        number_photos:      '31',
        sortby:             'interestingness-desc', //date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, relevance
        random:             true,
        size:               'url_c', //s=75x75,q=150x150, t=100 on longest side, m=240 on longest side,n=320 on longest side, -=500 on longest side,z=640 on longest side,c=800 on longest side(only exist with uploads from after March 1st 2012),b=1024 on longest side(Before May 25th 2010 large photos only exist for very large original images),o=original
        min_date:           '1330560000', //Thu, 01 Mar 2012 00:00:00 GMT
        debug:              true,
        phototemplate:      '<div class="cover-image" style="background-image: url({{details.src}})">',
        creditstemplate:    '<div class="cover-details"><ul class="clearfix">'+
            '<li class="cover-owner">{{details.title}}</li><li class="cover-location">{{details.place_id}}</li></ul></div>',
        complete:           null
    };

}(jQuery));
