# FlickrHeist
#### FlickrHeist is a plugin that allows you to use pictures hosted on Flickr to be used for your website's background.

## Basic setup
### Requirements
1. [jQuery](http://jquery.com/download/)
For a basic you will need to have the latest version of jQuery running as a basic JS framework.
2. [HandlebarsJS](http://handlebarsjs.com)
As a simple HTML templating engine FlickrHeist is using HandlebarsJS to render everything is plain usable HTML. No specific reason why I chose this one, but just because they have the most awesome logo.

### Installation
- Clone the repository from [here](https://github.com/mistermark/flickrheist) or download the zip and place the JS files in your specified directory.
- Include the files from the plugin, jQuery and HandlebarsJS, in your header section (or bottom of the page for non-blocking the loading of the rest of the page).
- Call the function `$('#cover-image').flickrHeist()` to trigger the plugin as where to drop the background image.

### Options
The FlickrHeist plugin comes with a few options to configure the plugin to your own taste. Below are the options available and a brief explanation.
- `tags`: A comma separated list to pull photos from Flickr tagged with this/these tags. Example: `'zeitgeist,movember,panda'`.
- `safe_search`: A flag to get photos from Flickr that are safe for public viewing. Accepts only `'0'` or `'1'`.
- `number_photos`: How many photos to get from Flickr. Choose a larger number if option `random` is set to `true`. Example: `'31'`.
- `sortby`: The way it will sort the fetched photos. Example: `interestingness-desc`. Accepts the following parameters: `date-posted-asc`, `date-posted-desc`, `date-taken-asc`, `date-taken-desc`, `interestingness-desc`, `interestingness-asc`, `relevance`.
- `random` (boolean): If this is set to `true` it will choose a random image from the range of image fetched.
- `size`: Selects the size of the photo from Flickr to be used as the background-image. Accepted parameters are:
-- `url_sq`: 75x75px thumbnail image
-- `url_t`: 100px on longest side
-- `url_s`: 240px on longest side
-- `url_q`: 150x150px thumbnail image
-- `url_m`: 500px on longest side
-- `url_n`: 320px on longest side
-- `url_z`: 640px on longest side
-- `url_c`: 800px on longest side (only exist with uploads created after March 1st 2012)
-- `url_l`: 1024px on longest side (before May 25th 2010 large photos only exist for very large original images)
-- `url_o`: original size image (either a jpg, gif or png, depending on source format) (not recommended due to the unpredictable size of the original uploaded image)
- `min_date`: A UNIX timestamp as a minimum date to grab photos from Flickr that are uploaded after this date. Example: `'1330560000'`, or `new Date('2013-03-01, 00:00:00').getTime()`
- `debug` (boolean): Testdrive your settings without having the plugin loading the stored data, but directly loading every time you change something.
- `phototemplate`: HTML template for rendering the photo with it's background. Example: `'<div class="cover-image" style="background-image: url({{details.src}})">'`.
- `creditstemplate` (work in progress): HTML template for rendering the credits with the photo (like every photo on Flickr that's used outside of the Flickr domain ought to have).
- `complete`: A callback for executing a function after everything is done and ready. Example: `function() { alert('Hello world!'); }`.

## Support & Examples
Support van be offered through the use of Github Issues.

Examples of the use of the plugin can be found:
- http://www.markdejong.com

If you want your website to be listed as an example in the list above, please contact me.

## Browser Support
Currently this plugin has only been tested in the most recent version of browsers: Safari 7.0, Google Chrome 31 and Firefox 25. Other browsers still have to pass the test.

## Authors
[Mark de Jong](https://github.com/mistermark)