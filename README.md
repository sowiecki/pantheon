[![Dependencies Status](https://david-dm.org/nase00/moirai.svg?style=flat-square)](https://david-dm.org/nase00/moirai)
[![DevDependencies Status](https://david-dm.org/nase00/moirai/dev-status.svg?style=flat-square)](https://david-dm.org/nase00/moirai#info=devDependencies)
[![bitHound](https://img.shields.io/bithound/code/github/Nase00/moirai.svg?style=flat-square)](https://www.bithound.io/github/Nase00/moirai/master/files)

*This software is in **alpha**, and is currently highly tailored to my use cases and home setup.
I am working to make it more configurable, modular, and secure for wider consumption. The API is undergoing significant changes.*

A [Node.js](https://nodejs.org/) middleman service for controlling multiple "Internet of Things" (IoT) devices.

Moirai integrates diverse services and devices into a single API, allowing for incredibly precise and convenient control.

Integrated services and devices can be controlled through "events" defined as part of a sequence.
These sequences are triggered by HTTP requests to the Moirai service. For example,

```js
// HTTP request body
[
  // Trigger Close-it module to open building gate
  { "type": "EMIT_BUZZ" },

  // Set bulb with ID #1 to brightness level 50
  { "type": "EMIT_HUE_SWITCH", "id": 1, "value": 50 },

  // Trigger a Particle Photon function to power on PC
  {
    "type": "EMIT_TRIGGER_PHOTON_FUNCTION",
    "deviceId": "123123123123123",
    "name": "pc-on",
    "argument": "togglePower",
    "auth": "567890567890"
  },

  // Trigger a Particle Photon function to power on PC speakers with an IR transmitter
  {
    "type": "EMIT_TRIGGER_PHOTON_FUNCTION",
    "deviceId": "567123123123123",
    "name": "pc-sound",
    "argument": "togglePower",
    "auth": "765890567890"
  },

  // Wait 60 seconds, then trigger script on the PC to open and play music
  {
    "type": "EMIT_SEND_UNIFIED_COMMAND",
    "name": "triggerCommand",
    "value": 3,
    "delay": 60000
  }
]
```
The sequence can be triggered by absolutely anything that is capable of sending an HTTP request, such as Google Home, Alexa, or any custom web application.

See the [Events documentation](./docs/events.md) for how to send requests.

Currently supported integrations:

* [Philips Hue](http://www2.meethue.com/en-us/)
* [Unified Remote](https://www.unifiedremote.com/)
* [Close-it](https://github.com/Nase00/close-it)
* [Custom Firmware](./firmware) built for the [Particle Photon](particle.io) and [Arduino](https://www.arduino.cc/) platforms

Products that are actively integrated into a Moirai server will still have their 1st-party solutions function.
E.g., Philips Hue dimmer switches and Unified Remote apps function as expected, even with Moirai running.

Services to control Moirai with:
* Microsoft Kinect connected to a Windows PC running [Aperature](https://github.com/Nase00/aperature)
* A keypad connected to a Raspberry Pi running [Node-HTTP-Macros](https://github.com/Nase00/node-http-macros)

# Getting started
```bash
git clone https://github.com/Nase00/moirai.git
cd moirai
touch ./environment/config.json
```

Before proceeding, populate `config.json` with your [configuration parameters](./environment/README.md).

```bash
npm install
npm start
```
