[![Dependencies Status](https://david-dm.org/nase00/moirai.svg?style=flat-square)](https://david-dm.org/nase00/moirai)
[![DevDependencies Status](https://david-dm.org/nase00/moirai/dev-status.svg?style=flat-square)](https://david-dm.org/nase00/moirai#info=devDependencies)
[![bitHound](https://img.shields.io/bithound/code/github/Nase00/moirai.svg?style=flat-square)](https://www.bithound.io/github/Nase00/moirai/master/files)

A [Node.js](https://nodejs.org/) server for controlling multiple "Internet of Things" (IoT) devices.

Moirai integrates multiple products and devices into a single API, allowing for incredible control.

Once a service is integrated, it can be controlled as part of a sequence of batched events.
For example, using JSON to set up a sequence for arriving home:

```js
[
  { "type": "EMIT_BUZZ" }, // Triggers Close-it module to open building gate
  { "type": "EMIT_LR_LIGHT_ON" }, // Turns on living room (LR) light
  { "type": "EMIT_PC_ON" }, // Triggers Lamprey module to turn on PC
  { "type": "EMIT_SEND_UNIFIED_COMMAND", "name": "triggerCommand", "value": 3, "delay": 60000 } // Wait 60 seconds, then triggers script on PC to open and play music
]
```
The sequence can be triggered by absolutely anything that is capable of sending an HTTP request, such as Google Home, Alexa, or any custom web application.

Currently supported integrations:

* [Philips Hue](http://www2.meethue.com/en-us/)
* [Unified Remote](https://www.unifiedremote.com/)
* [Close-it](https://github.com/Nase00/close-it)
* [Custom Firmware](./firmware) built for the [Particle Photon](particle.io) and [Arduino](https://www.arduino.cc/) platforms

Products that are actively integrated into a Moirai server will still have their 1st-party solutions function.
E.g., Philips Hue dimmer switches and Unified Remote apps function as expected, even with Moirai running.

Other services to control Moirai with:
* Microsoft Kinect connected to a Windows PC running [Aperature](https://github.com/Nase00/aperature)
* A keypad connected to a Raspberry Pi running [Node-HTTP-Macros](https://github.com/Nase00/node-http-macros)

# Alpha Status

This software is in alpha, and is currently highly tailored to my use cases and home setup.
I am working to make it more configurable, modular, secure, and documented for wider consumption.
