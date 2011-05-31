// Add in the site stylesheet
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "../khan-composite.css";
document.documentElement.appendChild( link );

loadScripts( [ "https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
			   "../utils/mersenne-twister.js" ], function() {
	jQuery(function() {
		var exerciseContainer = jQuery("#exercise");
		var exercises = [];

		// build a set of iframes based on our exercise definition list
		jQuery(".exercise-defs").children().each( function() {
			var exercise = $(this);
			exercises.push( 
				makeIframe( 
					exercise.text(),
					parseInt( exercise.data("times"), 10 ) || 1
				)
			);
		});

		// show the first exercise
		exerciseContainer.html( exercises.shift() );
		
		// listen for the exercise subframe to tell us it's done
		window.addEventListener("message", function(message) {
			
			// "next-exercise" is a message sent by the current exercise iframe 
			// indicating that the user has finished
			if ( message.data == "next-exercise" ) {
		
				if ( exercises.length === 0 ) {
					// yay, we're done!
					jQuery("body").html("Yay, done!");
				} else {
					// show the next exercise
					exerciseContainer.html( exercises.shift() );
				}

			}
		});

	});

	// build an iframe for an exercise
	function makeIframe( exercise, times ) {
		times = times || 1;
		var iframe = document.createElement("iframe");
		var url = "/exercises/" + exercise + ".html";

		// let the exercise know that this is a composite
		url += "?composite=" + slugify( jQuery("title").text() );
		url += "&composite_times=" + times;
		iframe.src = url;
		return iframe;
	}

	function slugify( string ) {
		string = string.toLowerCase();
		string = string.replace(/\s+/g, "_");
		return string;
	}
});

function loadScripts( urls, callback ) {
	var loaded = 0,
	 loading = urls.length;
	
	// Ehhh... not a huge fan of this
	this.scriptWait = function( callback ) {
		loading++;
		callback( runCallback );
	};

	var loadOneScript = function(url) {
		var script = document.createElement("script");
		script.src = url;
		script.onload = runCallback;
		document.documentElement.appendChild( script );
	};

	for ( var i = 0; i < loading; i++ ) {
		loadOneScript(urls[i]);
	}

	runCallback( true );
	
	function runCallback( check ) {
		if ( check !== true ) {
			loaded++;
		}
		
		if ( callback && loading === loaded ) {
			callback();
		}
	}
}
