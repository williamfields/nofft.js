/**
 * nofft.js - Licensed under the MIT license
 * https://github.com/williamfields/nofft.js
 */
 
var NOFFT = function() 
{			
	"use strict";
	
	var self = this;				
	
	// Note handling
	this.ignoreNoteOff = false;		
	
	// Controllers
	this.releaseController = 72;
	this.attackController = 73;
	
	// Envelope settings			
	this.minimumEnvelope = 0;
	this.maximumEnvelope = 1;						
	this.velocityCurve = 2;
	
	// Attack
	this.minimumAttack = 10;
	this.maximumAttack = 5000;
	this.attackCurve = 4;
	this.attackEasing = TWEEN.Easing.Linear.None;  // For options see: http://tweenjs.github.io/tween.js/examples/03_graphs.html
	
	// Release		
	this.minimumRelease = 100;
	this.maximumRelease = 8000;
	this.releaseCurve = 5;
	this.releaseEasing = TWEEN.Easing.Exponential.Out;
	
	var ANY_CHANNEL = 17;  // Special channel that is triggered for events on all channels
	
	this.channel = new Array(18);
	
	for (var c=1; c<18; c++)
	{					
		this.channel[c] = 
		{		
			attack: 0.0,
			release: 0.5,
			note: [],
			controller: [],
			lastController: 0,  // Last touched controller number
			anyController: 0, // Last touched controller value
			lastNote: 0,
			anyNote: 0,
			tweens: [],
			onNoteInternal: function(chan,note,vel,trueChannel)
			{													
				this.lastNote = note;
			
				// If tween is already running, then stop it.
				if (this.tweens[note] !== undefined)  
				{									
					this.tweens[note].stop();
				}

				if (self.ignoreNoteOff)
				{					
					// Attack
					var pos = { env:self.minimumEnvelope };			
					var attackTween = tween(
					{ 
						from:pos,
						to:{ env:self.maximumEnvelope*Math.pow(vel,self.velocityCurve) },
						speed:Math.max(self.maximumAttack*Math.pow(this.attack,self.attackCurve),self.minimumAttack),
						update:function() 
						{	
							if (note == self.channel[chan].lastNote) 
							{ 
								self.channel[chan].anyNote = pos.env; 
							} 
							self.channel[chan].note[note] = pos.env; 
						},			
						mode:self.attackEasing
					});			
					
					// Release
					var pos2 = { env:self.maximumEnvelope*Math.pow(vel,self.velocityCurve) };
					var releaseTween = tween(
					{ 
						from:pos2,
						to:{ env:self.minimumEnvelope },
						speed:Math.max(self.maximumRelease*Math.pow(this.release,self.releaseCurve),self.minimumRelease),
						update:function() 
						{	
							if (note == self.channel[chan].lastNote) 
							{ 
								self.channel[chan].anyNote = pos2.env; 
							} 
							self.channel[chan].note[note] = pos2.env; 
						},		
						mode:self.releaseEasing,
						start:false,
						delay:10
					});			
								
					// Chain tweens together
					attackTween.chain(releaseTween);	
				}
				else
				{					
					// Attack
					var pos = { env:self.minimumEnvelope };
					this.tweens[note] = tween(
					{ 					
						from:pos,
						to:{ env:self.maximumEnvelope*Math.pow(vel,self.velocityCurve) },
						speed:Math.max(self.maximumAttack*Math.pow(this.attack,self.attackCurve),self.minimumAttack),
						update:function() 
						{	
							if (note == self.channel[chan].lastNote) 
							{ 
								self.channel[chan].anyNote = pos.env; 
							} 
							self.channel[chan].note[note] = pos.env; 
						},
						mode:self.attackEasing
					});					
				}
				
				// Call user-defined note-on function
				this.onNote(trueChannel,note,vel); 
			},
			onNoteOffInternal: function(chan,note,trueChannel) 
			{							
				// If tween is already running, then stop it.
				if (this.tweens[note] !== undefined) 
				{			
					this.tweens[note].stop();			
				}

				// Create new tween
				var pos = { env:self.channel[chan].note[note] };
				this.tweens[note] = tween(
				{ 
					from:pos,
					to:{ env:self.minimumEnvelope },
					speed:self.maximumRelease*Math.pow(this.release,self.releaseCurve),
					update:function() 
					{								
						if (note == self.channel[chan].lastNote) 
						{ 
							self.channel[chan].anyNote = pos.env; 
						} 
						self.channel[chan].note[note] = pos.env; 
					},				
					mode:self.releaseEasing
				});		
				
				// Call user-defined note-off function
				this.onNoteOff(trueChannel,note); 
			},
			onControllerInternal: function(chan,cnum,cval,trueChannel) 
			{ 
				if (cnum == self.attackController) { this.attack = cval; }
				else if (cnum == self.releaseController) { this.release = cval; }

				this.lastController = cnum;
				this.anyController = cval; 

				this.controller[cnum] = cval;
				
				// Call user-defined controller function
				this.onController(trueChannel,cnum,cval); 
			},			
			onNote: function(chan,note,vel) { }, // User defined
			onNoteOff: function(chan,note) { }, // User defined
			onController: function(chan,cnum,cval) { },  // User defined
		};
		
		// Init note and controller values
		for (var i=0; i<128; i++)
		{
			this.channel[c].note[i] = 0;
			this.channel[c].controller[i] = 0;					
		}
	}	
	
	
	this.anyChannel = this.channel[ANY_CHANNEL];
		
		
	this.init = function()
	{			
		if (!navigator.requestMIDIAccess) 
		{					
			console.log("Browser does not support WebMIDI!");					
			return false;
		} 
		else 
		{			
			navigator.requestMIDIAccess({ sysex:false }).then(onMidiAccess, errorCallback);	
			return true;
		}										
	};
		
		
	this.update = function()
	{
		TWEEN.update(); 
	}
	
	
	function onMidiAccess(midi) 
	{		
		var inputs = midi.inputs.values();
		
		for (var input=inputs.next(); input && !input.done; input=inputs.next())
		{
			if (typeof input.value !== "undefined")
			{
				console.log("MIDI input: " +input.value.name);
				input.value.onmidimessage = onMidiMessage;  // TODO: Should be able to choose which device instead of opening all
			}
		}						
	}
	
	
	function errorCallback(err) 
	{
		alert("The MIDI system failed to start:" + err);
	}
	
			
	function onMidiMessage(msg)	
	{																					
		var status = msg.data[0] & 240;
		var chan = msg.data[0] - status + 1;		
																																			
		if (status <= 159)  // Note event  
		{    					
			var note = msg.data[1];
			var velocity = msg.data[2];
		
			if (velocity > 0)	
			{						
				// Note on
				self.channel[chan].onNoteInternal(chan, note, velocity/127, chan);
				self.anyChannel.onNoteInternal(ANY_CHANNEL, note, velocity/127, chan);
			}	
			else 
			{				
				// Note off				
				self.channel[chan].onNoteOffInternal(chan, note, chan);
				self.anyChannel.onNoteOffInternal(ANY_CHANNEL, note, chan);
			}
		}
		else if (status == 176)  // Controller event
		{							
			var controllerNumber = msg.data[1];
			var controllerValue = msg.data[2];								
			self.channel[chan].onControllerInternal(chan, controllerNumber, controllerValue/127, chan);
			self.anyChannel.onControllerInternal(ANY_CHANNEL, controllerNumber, controllerValue/127, chan);
		}						
	}				
	
	
	function tween(args) 
	{	
		args = args || {};
		
		var from = typeof args.from != 'undefined' ? args.from : 0;
		var target = typeof args.to != 'undefined' ? args.to : 1;
		var speed = typeof args.speed != 'undefined' ? args.speed : 1000;
		var update = typeof args.update != 'undefined' ? args.update : function() { log("No tween update function defined."); };
		var mode = typeof args.mode != 'undefined' ? args.mode : TWEEN.Easing.Linear.None;
		var start = typeof args.start !== 'undefined' ? args.start : true;
		var delay = typeof args.delay !== 'undefined' ? args.delay : 0;
		
		var myTween = new TWEEN.Tween(from).to(target,speed);
		myTween.onUpdate(update);						
		myTween.easing(mode);
		
		if (delay > 0) { myTween.delay(delay); }
		
		if (start) { myTween.start(); }
		
		return myTween;
	}

};