# nofft.js
nofft.js is a Javascript library that makes it *super easy* to create MIDI-responsive visuals, instruments, games, and art.

It can be used to easily map the envelope of a sound to the envelope of a corresponding visual event.

To get an idea of what it can do, open this live example and bang on your MIDI controller: https://billcf.github.io/nofft/examples/css-example.html

## Quick Start

To include it in your application:

```html
<script src="../src/nofft.js"></script>
<script src="../lib/tween.js"></script>
```

Initialize:

```javascript
nofft.init();
```

...and then make sure to update it inside your render loop:

```javascript
function render() 
{								
	nofft.update();
	
	// do stuff
	
	requestAnimationFrame(render);					
}										
```
		
## MIDI Notes

You can respond to note events on a particular channel, or if you don't care about the channel, you can opt to respond to events coming in on *any* channel. 


### Examples

To respond to the **start** of a note on **any channel**:

```javascript
nofft.anyChannel.onNote = function(channel,note,velocity) 
{ 
	console.log("Just received a note ON message for note "+note+" with velocity "+velocity+" on channel "+channel);
};
```

To respond to the **end** of a note on **channel 1**:

```javascript
nofft.channel[1].onNoteOff = function(channel,note) 
{
	console.log("Just received a note OFF message for note "+note+" on channel "+channel);
};
```

## Envelopes

You can track the envelope of each individual note as it rises and falls:

### Examples

To get the **current envelope value** of note 64 on channel 1:

```javascript
nofft.channel[1].note[64];
```

To get the current envelope value of the **last played note** on channel 4:

```javascript
nofft.channel[4].anyNote;
```

To get the current envelope value of the last played note on **any channel**:

```javascript
nofft.anyChannel.anyNote;
```

To set the **attack** of the envelope so it **rises suddenly**:

```javascript
nofft.anyChannel.attack = 0;
```

To set the **attack** of the envelope so it **fades in**:

```javascript
nofft.anyChannel.attack = 1;
```

To set the **release** of the envelope so it **drops suddenly**:

```javascript
nofft.anyChannel.release = 0;
```

To set the **release** of the envelope so it **falls slowly**:

```javascript
nofft.anyChannel.release = 1;
```

## Controllers

MIDI controllers are also supported.

### Examples

To respond to a MIDI controller event on any channel:

```javascript
nofft.anyChannel.onController = function(channel,controlNumber,controlValue) 
{
	console.log("Just received a controller message for controller number "+controlNumber+" with value "+controlValue+" on channel "+channel);
};
```

To get the current value of controller 74 on channel 1:

```javascript
nofft.channel[1].controller[74];
```




