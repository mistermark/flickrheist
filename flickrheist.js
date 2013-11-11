(function($){

    $.fn.flickrHeist = function(options) {
        "use strict";

        var settings = $.extend({}, $.fn.flickrHeist.defaults, options);

        //-- Flickr REST url/services
        var FLICKR = {
            REST_URL: 'http://www.flickr.com/services/rest/',
            SEARCH: 'flickr.photos.search',
            GETINFO: 'flickr.photos.getInfo',
            APIKEY: 'ce2cebcf703d8ab2bdbd5342f16ebcaa',
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

        var _init = function(data) {
            vars.status = 'initialized';
            _fetchPhotos();
        };

        var _verifyLocalData = function(data) {
            if(localStorage && localStorage.getItem('flickrHeist')) {
                return true;
            } else {
                return data;
            }
        };

        var _fetchLocalData = function(data) {
            if(_verifyLocalData(data) === true) {
                return JSON.parse(localStorage.getItem('flickrHeist'));
            } else {
                return data;
            }
        };

        var _storeLocalData = function(data) { //JSON data comes in
            
            if(_verifyLocalData(data) !== true || data.creation_date !== vars.today) {
                localStorage.setItem('flickrHeist', JSON.stringify(data));
            }
        };

        var _randomizeItem = function(data) {

            var jsonObj = _fetchLocalData(vars.jsonmodel);

            if(_verifyLocalData() === true && settings.random === true) {
                return Math.floor(Math.random() * jsonObj.real_total);
            }
        };

        //-- Fetch Flicks photos by tag
        var _fetchPhotos = function() {
            vars.status = 'fetching-start';

            if (_verifyLocalData(vars.jsonmodel) !== true) {
                _dropPhoto(_fetchLocalData());
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
                        _storeLocalData(vars.jsonmodel);
                    },
                    complete: function(data) {
                        _dropPhoto(vars.jsonmodel);
                    }
                });
            }
        };

        var _dropPhoto = function(data) {
            vars.status = 'drophoto';

            var template = Handlebars.compile(settings.phototemplate);
            vars.target.html( template( data.items[_randomizeItem(data)] ) );

            _complete(data);
        };

        var _complete = function(data) {
            if( $.isFunction(settings.complete) ) {
                settings.complete.call();
            }
        };

        return _init();

    };

    $.fn.flickrHeist.defaults = {
        tags:               'zeitgeist', //comma separated list
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