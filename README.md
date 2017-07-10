# nofft.js
nofft.js is a Javascript library that makes it *super easy* to create MIDI-responsive visuals, instruments, games, and art.

To get an idea of what it can do, open this live example and bang on your MIDI controller: http://williamfields.com/nofft.js/examples/css-example.html

## Quick Start

To include it in your application:

```html
<script src="../src/nofft.js"></script>
<script src="../lib/tween.js"></script>
```

To initialize it:

```javascript
nofft.init();
```

## MIDI Notes

You can respond to note events on a particular channel, or if you don't care about the channel, you can opt to respond to events coming in on any channel. 


### Examples

To respond to the **start** of a note on **any channel**:

```javascript
nofft.anyChannel.onNote = function(channel,note,velocity) { /* do stuff */ };
```

To respond to the **end** of a note on **channel 1**:

```javascript
nofft.channel[1].onNoteOff = function(channel,note,velocity) { /* do stuff */ };
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
nofft.anyChannel.onController = function(channel,controlNumber,controlValue) { /* do stuff */ };
```

To get the current value of controller 74 on channel 1:

```javascript
nofft.channel[1].controller[74];
```




