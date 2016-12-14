[![Dependencies Status](https://david-dm.org/nase00/moirai.svg?style=flat-square)](https://david-dm.org/nase00/moirai)
[![DevDependencies Status](https://david-dm.org/nase00/moirai/dev-status.svg?style=flat-square)](https://david-dm.org/nase00/moirai#info=devDependencies)
[![bitHound](https://img.shields.io/bithound/code/github/Nase00/moirai.svg?style=flat-square)](https://www.bithound.io/github/Nase00/moirai/master/files)

A [Node.js](https://nodejs.org/) server for controlling multiple "Internet of Things" (IoT) devices.

Moirai integrates multiple devices into a single, common API, allowing for incredibly control through a RESTful API.

Once a service is integrated, it can be controlled as part of a sequence of batched events.
For example,

```json
[
  { "type": "EMIT_BUZZ" }, // Triggers Close-it module to open building gate
  { "type": "EMIT_LR_LIGHT_ON" }, // Turns on living room (LR) light
  { "type": "EMIT_PC_ON" }, // Triggers Lamprey module to turn on PC
  { "type": "EMIT_SEND_UNIFIED_COMMAND", "name": "triggerCommand", "value": 3, "delay": 60000 } // Wait 60 seconds, then triggers script on PC to open and play music
]
```

Currently supported integrations:

* [Philips Hue](http://www2.meethue.com/en-us/)
* [Unified Remote](https://www.unifiedremote.com/)
* [Close-it](https://github.com/Nase00/close-it)
* [Custom Firmware](./firmware) built for the [Particle Photon](particle.io) and [Arduino](https://www.arduino.cc/) platforms
