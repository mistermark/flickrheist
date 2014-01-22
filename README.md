# FlickrHeist
#### FlickrHeist is a plugin that allows you to use pictures hosted on Flickr to be used for your website's background.

Everybody wants to have some pretty pictures on their website, especially big ones and pretty ones. But not everyone can make beautiful pictures or wants to buy some off of a stock images platform...

### Introducing “FlickrHeist”

Using the awesome photo-taking society at Flickr everybody can have beautiful photos on their website now with FlickrHeist. Just throw in the easy snippet to kick-off and provide your Fickr API key and a tag to filter on and you're ready to go.

On this very website you can see a live demo of the plugin using the filter tag ‘dapper’ and grabbing photos of a resolution using the tag ‘url_c’ (800px on the longest side).

### The Story

While making a theme for the [Ghost](https://ghost.org) blogging platform I got inspired by the look and feel of [Medium](https://medium.com)'s sidebar look and decided to bring this same feeling to my theme. At first I wanted to use Instagram to grab pictures of, filtered by tag, but quickly found the size of the largest size images on Instagram didn't quite cut it. The images were too small. Hence brought me to explore the Flickr API and build my plugin on that.

### The Bare Necessities

For the basic plugin to work there were a few quirks that needed figuring out, and required, for a real v1.0 release. Flickr states in their [Community Guidelines](http://www.flickr.com/guidelines.gne) the following:

> “Flickr makes it possible to post content hosted on Flickr to other web sites. However, pages on other web sites that display content hosted on flickr.com must provide a link from each photo or video back to its page on Flickr. This provides a way to get more information about the content and the photographer.”

And to adhere to this was the first requirement for a v1.0 release of this here plugin. The other ones I basically stated myself:

And these were the requirements I put myself to before releasing the plugin to the wild:

1. Pull a picture from Flickr and display it as background image on the selected DOM element.
2. Grab the meta information from the image and display the photographer's name and country alongside the image for credits.
3. Give the user the option to fill in a custom tag and select the image quality to use.

Along the road of enlightening and towards the completion of the FlickrHeist I came across more useful options that I would want to change if I would be using the plugin for myself. That's when I added some more options to the plugin (listed below).

### The Simple Setup

For everyone to use this plugin it's fairly easy to set up. All you need is the following files to get started:

* [jQuery](http://jquery.com/download/)
* [HandlebarsJS](http://handlebarsjs.com)
* flickrheist.js (right here on github)

Right now Handlebars.JS is used at a minimum, but I've got plans on exploiting this baby even further to optimize even more.

To initialize the plugin you'll only need to call the following in your main Javescript file:

    $('#some-div').flickrHeist({
      apikey: 'ABCDEFGHIJKLMOPQRSTUVWXYZ123456',
      tags: 'zeitgeist',
      size: 'url_c' //800px longest side
    });

Oh, yeah... I almost forgot. You also need to have your own Flickr API key in order for this plugin to work. You can grab your own Flickr API key right [here](http://www.flickr.com/services/api/).

### The Nitty Gritty

Below is the full list of options available and what values they take along with a brief explanation what it is and what it does.

* `apikey`: (required) Your Flickr API key goes right here. Without it, this whole party won't start
* `tags`: (string) A single tag, or a comma separated array of tags to filter the pictures you want to 'heist'
* `safe_search`: (boolean) Allow (NSFW) images to appear in your 'heist', or not.
* `number_photos`: (integer) The maximum number of images to grab. Useful when you want random images to rotate between
* `sortby`: (string) The order in which to sort returned photos. Accepts: `date-posted-asc`, `date-posted-desc`, `date-taken-asc`, `date-taken-desc`, `interestingness-desc`, `interestingness-asc`, and `relevance`.
* `random`: (boolean) To pick a random picture from the returned array of images to show.
* `size`: (string) Select what size image to return for use as the background. Available options:
 * `url_s`: small square 75x75
 * `url_q`: large square 150x150
 * `url_t`: thumbnail, 100 on longest side
 * `url_m`: small, 240 on longest side
 * `url_n`: small, 320 on longest side
 * `url`: medium, 500 on longest side
 * `url_z`: medium 640, 640 on longest side
 * `url_c`: medium 800, 800 on longest side (only exist if picture is uploaded after March 1st 2012)
 * `url_b`: large, 1024 on longest side
 * `url_o`: original image, either a jpg, gif or png, depending on source format 
* `min_date`: (epoch date) Filter by minimum date to make sure you get a good quality picture 'heisted'. Example: `'1330560000'` (Thu, 01 Mar 2012 00:00:00 GMT)
* `debug`: (boolean) Handy for live loading of data, instead of reading from localStorage. Also can be triggered using the URL parameter `flickrheist=debug`
* `phototemplate`: (string) HTML template used to render the HTML for the image. Default: `'<div class="cover-image" style="background-image: url({{details.src}})">'`.
* `creditstemplate`: (string) Same as the `phototemplate`, just for the credits of the picture. Default: `'<div class="cover-details"><ul class="clearfix"><li class="cover-owner"><a href="{{url}}" title="{{title}}">{{owner}}</a></li><li class="cover-location">{{location}}</li></ul></div>'`
* `complete`: (function) A little something to do whatever you want when the loading is done.

(Photo Source URLs: [Flickr App Garden](http://www.flickr.com/services/api/misc.urls.html))

### The Examples

* [www.markdejong.com](http://www.markdejong.com)

_(more coming soon)_

### The Support

FlickrHeist hasn't been fully tested on all browsers yet, but is currently working on the most recent, modern browsers.

Any support issues van be handled here on GitHub.

### The Creator

Yours truly,
[Mark de Jong](http://www.markdejong.com)
