/*** Global variables ***/
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
		var keys = ["6A", "7B", "5B"];
		return keys;
	}

	function energy_boost_keys(key_outgoing){
		var keys = ["8B", "1B"];
		return keys;
	}
});