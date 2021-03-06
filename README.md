# hero-slideshow

## A Jquery slideshow plugin of heroic proportions.

Hero-slideshow is a jQuery slideshow plugin written for the website of the PBS documentary "10 Buildings That Changed America." It will automatically display images to fill the width of the browser, up to 1600 pixels wide. 

### Features
* responsive design. The slideshow resizes to 100% width (up to 1600px) and is intended to be used in a responsive design setting.
* uses CSS3 Transitions where available, with jQuery Animate as a fallback for Internet Explorer, etc.
* deferred loading of images. The heroic images that are used in this slideshow can cause pages to be quite large. In order to make the page display more quickly, the images are loaded after document.ready. (this technique could probably be improved upon).
* serve a smaller image to smaller screens. Smaller screens get a half-size version of the image.

### Usage

Write slideshow markup as shown:
```html
	<div class="hero-ctn">
		<div class="slides">
			<div class="slide">
				<div class="caption">
					<h2><span class="number">9</span> Vanna Venturi House</h2>
					<h3>Philadelphia, Pennsylvania<br>
						Robert Venturi , 1964</h3>
				</div>
				<img data-original="file.jpg" src="placeholder.png">
				<div class="lower-caption">
					<p>Caption
						<span class="credit">Photo Credit: John Doe</span>
					</p>
				</div>
			</div>
			<!-- more slides here --> 
		</div>

		<div class="prev-next">
			<a class="action reverse" href="#"><i class="icon icon-circle-arrow-left"></i></a>
			<a class="action forward" href="#"><i class="icon icon-circle-arrow-right"></i></a>
		</div>
	</div>
	<div class="hero-nav-ctn">
		<div class="container">
			<div class="row">
				<div class="span12">		
					<ul class="slideNav">
						<li>
							<div class="navLabel">1</div>
							<img src="thumbnail.jpg">
						</li>
						<!-- more slide thumbnails here -->
					</ul>
				</div>
			</div>
		</div>
	</div>
```

and initialize the slideshow on document.ready:

```javascript
jQuery('document').ready(function($){
	$('.hero-ctn').heroSlideshow();
});
```

### Dependencies

As a jQuery plugin, this slideshow requires jQuery. May work with zepto, but it hasn't been tested.

As written, the markup does rely upon [Twitter Bootstrap](http://twitter.github.io/bootstrap/) for its responsive grid system and [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for navigation icons, but it could easily be rewritten to avoid that dependency.