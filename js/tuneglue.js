/*** Global variables ***/
// canvas
var context;
var canvas;

// user input variables:
var bpm_outgoing;
var key_outgoing;
var response;

// error checking vars:
var bpm_is_legit = false;
var camelot_code_is_legit = false;

// output vars
var bpm_incoming;
var keys_incoming; // this is an array
var transition_time;

// object containing camelot codes & corresponding keys
var camelot_code_key = {
		codes: ["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A",
				"1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B"],

		keys: ["A-Flat Minor", "E-Flat Minor", "B-Flat Minor", "F Minor", "C Minor", 
				  "G Minor", "D Minor", "A Minor", "E Minor", "B Minor", "F-Sharp Minor", 
				  "D-Flat Minor", "B Major", "F-Sharp Major", "D-Flat Major", "A-Flat Major",
				  "E-Flat Major", "B-Flat Major", "F Major", "C Major", "G Major", "D Major",
				  "A Major", "E Major"]
};

// load page
$(document).ready(function(){
	console.log('ready!');
	$('#canvas').addClass('wheel_background');
	canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d');
});

// bpm error checking
$('#bpm').focusout(function(){
	// retrieve user input
	bpm_outgoing = $(this).val();
	// check if BPM is within acceptable range
	if (bpm_outgoing < 40 || bpm_outgoing > 280){
		$('#bpm_error').css('display', 'block');
		bpm_is_legit = false;
	}
	else if(bpm_outgoing <=280 && bpm_outgoing >= 40){
		$('#bpm_error').css('display', 'none');
		bpm_is_legit = true;
	}
});

// key error checking
$('#camelot_code').focusout(function(){
	// retrieve user input
	key_outgoing = $(this).val().toUpperCase();	
	// reset camelot code checker
	camelot_code_is_legit = false;
	// check if user-input outgoing key is a legit camelot code
	for(var i = 0; i < camelot_code_key.codes.length; i++){
		if(key_outgoing == camelot_code_key.codes[i]){
			camelot_code_is_legit = true;
		}
	}
	if(camelot_code_is_legit == false){
		$('#camelot_code_error').css('display', 'block');
	}
	else{
		$('#camelot_code_error').css('display', 'none');
	}
});

// response radio button input
$('input[name=response]').click(function(){
	var label = $(this).next();
	response = label.html();
});

// analyze track button
$('#analyze').click(function(){
	//clear canvas
	canvas.width = canvas.width;
	// different behavior based on response selected
	// key_incoming array to be harmonic or energy_boost
	// bpm_incoming is + or - an amount 
	// transition_time varies
	// first check for errors
	if(bpm_is_legit && camelot_code_is_legit){
		switch(response){
		case 'zone out':
			bpm_incoming = parseInt(bpm_outgoing) - 10;
			keys_incoming = harmonic_keys(key_outgoing);
			transition_time = '90 sec';
			break;
		case 'chill':
			bpm_incoming = parseInt(bpm_outgoing) - 5;
			keys_incoming = harmonic_keys(key_outgoing);
			transition_time = '30 sec';
			break;
		case 'maintain groove':
			bpm_incoming = parseInt(bpm_outgoing);
			keys_incoming = harmonic_keys(key_outgoing);
			transition_time = '60 sec';
			break;
		case 'energy boost':
			bpm_incoming = parseInt(bpm_outgoing);
			keys_incoming = energy_boost_keys(key_outgoing);
			transition_time = '15 sec';
			break;
		case 'next level':
			bpm_incoming = parseInt(bpm_outgoing) + 5;
			keys_incoming = harmonic_keys(key_outgoing);
			transition_time = '60 sec';
			break;
		case 'catalyze':
			bpm_incoming = parseInt(bpm_outgoing) + 10;
			keys_incoming = energy_boost_keys(key_outgoing);
			transition_time = '10 sec';
			break;	
		}
		// output to screen
		$('#bpm_incoming span').html(bpm_incoming);
		$('#keys_incoming span').html(keys_incoming);
		$('#transition_time span').html(transition_time);
	}
	else{
		$('#bpm_incoming span').html('');
		$('#keys_incoming span').html('');
		$('#transition_time span').html('');
	}
	
	// analyze outgoing track key and return suggested keys
	function harmonic_keys(key_outgoing){
		// parse outoing key code into alpha and numeric parts
		var key_n = parse_code(key_outgoing)[0];
		var key_a = parse_code(key_outgoing)[1];
		var key_other = parse_code(key_outgoing)[2];
		
		// show and rotate overlay
		if (key_a =='A'){
			overlay('/images/harmonic_overlay_a.png', key_n);
	    }
		else if(key_a == 'B'){
			overlay('/images/harmonic_overlay_B.png', key_n);
		}

		// keys[0] =  -1; keys[1] = n; keys[2] = +1; keys[3] = n in/out
		var keys = [];
		// first key is a step backwards around the wheel
		keys[0] = (key_n > 1) ? (key_n - 1 + key_a) : (12 + key_a);
		// second key is same as outgoing track
		keys[1] = key_outgoing;
		// third key is one step up the wheel
		keys[2] = (key_n < 12) ? (key_n + 1 + key_a) : (1 + key_a);
		// fourth key is a radial step
		keys[3] = key_n + key_other;
		
		return list_keys(keys);
	}

	function energy_boost_keys(key_outgoing){
		// parse outoing key code into alpha and numeric parts
		var key_n = parse_code(key_outgoing)[0];
		var key_a = parse_code(key_outgoing)[1];

		// show and rotate overlay
		if (key_a =='A'){
			overlay('/images/energy_overlay_a.png', key_n+2);
	    }
		else if(key_a == 'B'){
			overlay('/images/energy_overlay_B.png', key_n+2);
		}

		// keys[0] =  +2; keys[1] = +7
		var keys = [];
		// first key is 2 steps around the wheel
		keys[0] = (key_n < 11) ? (key_n + 2 + key_a) : ((key_n + 2) % 12 + key_a);
		// second key is 7 steps around the wheel
		keys[1] = (key_n < 6) ? (key_n + 7 + key_a) : ((key_n + 7) % 12+ key_a);

		return list_keys(keys);
	}
	
	// parse camelot code into alpha and numeric parts
	function parse_code(key_outgoing){
		var key_n = parseInt(key_outgoing);
		var key_a = /[AB]/.exec(key_outgoing);
		// set var for inner / outer motion in wheel
		var key_other = (key_a == 'A') ? 'B' : 'A';

		return [key_n, key_a, key_other];
	}	

	// format the keys as a comma-separated list
	function list_keys(keys){
		var keylist = "";
		for (var i = 0; i < keys.length; i++){
			if (i == keys.length - 1){
				keylist += keys[i];
			}
			else{
				keylist += keys[i] + ", ";
			}
		}
		return keylist;
	}
	
	// calculate rotation and display dark overlay on wheel
	function overlay(img_url, key_n){
		var rot_degrees = (key_n % 12)*(360/12);
		var img_overlay = new Image();
		img_overlay.addEventListener('load', function(){
			drawImageRot(img_overlay, 0, 0, 600, 600, rot_degrees);
		    }, false);
		img_overlay.src = img_url;
	}

});

/* image rotate function borrowed from:
 http://stackoverflow.com/questions/2677671/how-do-i-rotate-a-single-object-on-an-html-5-canvas */
function drawImageRot(img,x,y,width,height,deg){
	//Convert degrees to radian 
	var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    context.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    context.rotate(rad);

    //draw the image    
    context.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    context.rotate(rad * ( -1 ) );
    context.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}
