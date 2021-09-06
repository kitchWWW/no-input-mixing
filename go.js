console.log("wow good job");



var allSounds = []
var noteToSoundMappings = {}
var notesOn = [0]

function init() {
	for (var i = 0; i < 180; i++) {
		var sound = new Pizzicato.Sound({
			source: 'file',
			options: {
				path: './gen_samples/' + i + '.wav',
				loop: true,
			}
		}, function() {
			console.log('sound file loaded!');
		});
		allSounds.push(sound);
	}
}



init();

window.onclick = function(event) {
	start();
}

started = false


function playNoteFake() {
	var deets = document.getElementById("thinggy").value
	playNote(deets);
}

function stopNoteFake() {
	var deets = document.getElementById("thinggy").value
	stopNote(deets);
}

function playNote(note) {
	console.log(note);
	if (noteToSoundMappings[note] == undefined) {
		console.log("here!")
		noteToSoundMappings[note] = Math.floor(Math.random() * 180);
		console.log(noteToSoundMappings[note]);
	}
	if(note != '0'){
		allSounds[noteToSoundMappings[note]].play();
	}
}

function stopNote(note) {
	console.log(note);
	if (noteToSoundMappings[note] == undefined) {
		console.log("note was not started, so we can't stop it " + note)
	} else {
		allSounds[noteToSoundMappings[note]].stop();
	}
}

function yeet(){

}


function start() {
	if (started) {
		return;
	}
	started = true
	let context = Pizzicato.context
	let source = context.createBufferSource()
	source.buffer = context.createBuffer(1, 1, 22050)
	source.connect(context.destination)
	source.start()
}


function onMIDIMessage( event ) {
  var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
  for (var i=0; i<event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }
  console.log(event.data);
  if(event.data[0] == 144){
  	// then it is note on
  	stopNote(''+notesOn)
  	notesOn.push(event.data[1])
  	notesOn.sort()
  	playNote(''+notesOn)
  }
  if(event.data[0] == 128){
  	// then note off
  	stopNote(''+notesOn)
  	const index = notesOn.indexOf(event.data[1]);
	if (index > -1) {
	  notesOn.splice(index, 1);
	}
	notesOn.sort()
  	playNote(''+notesOn)
  }
}

function startLoggingMIDIInput( midiAccess, indexOfPort ) {
  midiAccess.inputs.forEach( function(entry) {entry.onmidimessage = onMIDIMessage;});
}

var midi = null; // global MIDIAccess object
function onMIDISuccess(midiAccess) {
	console.log("MIDI ready!");
	midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
	midi.onstatechange = function(e) {
		// Print information about the (dis)connected MIDI controller
		console.log(e.port.name, e.port.manufacturer, e.port.state);
	};
	startLoggingMIDIInput(midiAccess)

}

function onMIDIFailure(msg) {
	console.log("Failed to get MIDI access - " + msg);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);