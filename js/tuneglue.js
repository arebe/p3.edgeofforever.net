$(document).ready(function(){
	console.log('ready!');
	$('#canvas').addClass('wheel_background');

	var bpm_incoming = 180;
	$('#bpm_incoming span').html(bpm_incoming);

	var key_incoming = 'A flat';
	$('#key_incoming span').html(key_incoming);

	var transition_time = '90 sec';
	$('#transition_time span').html(transition_time);

});