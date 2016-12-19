[![GitHub Release](https://img.shields.io/github/release/Nase00/pantheon.svg?style=flat-square)](https://github.com/Nase00/pantheon/releases)
![license](https://img.shields.io/github/license/Nase00/pantheon.svg?style=flat-square)

[![Dependencies Status](https://david-dm.org/nase00/pantheon.svg?style=flat-square)](https://david-dm.org/nase00/pantheon)
[![DevDependencies Status](https://david-dm.org/nase00/pantheon/dev-status.svg?style=flat-square)](https://david-dm.org/nase00/pantheon#info=devDependencies)
[![bitHound](https://img.shields.io/bithound/code/github/Nase00/pantheon.svg?style=flat-square)](https://www.bithound.io/github/Nase00/pantheon/master/files)

*This software is in **alpha**,
and is currently undergoing major changes to make it more configurable, modular, and well-documented for wider consumption.*

Pantheon is an application for easily managing control of multiple "Internet of Things" (IoT) devices.

Integrated services and devices can be triggered as "events" by an HTTP request to an instance of Pantheon.
A single request can contain multiple events, described in a sequence of how they should be performed.
For example,

```js
// An HTTP request body sent by a cellphone app a by user upon arriving home
[
  // Trigger a separate application to open the building gate
  {
    "type": "EMIT_FORWARD_HTTP_REQUEST",
    "key": "buildingGate",
    "password": "hunter2"
  },

  // Turn on bulb with ID of 1
  {
    "type": "EMIT_HUE_SWITCH",
    "id": 1,
    "value": "on"
  },

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

Currently supported integrations:

* [Philips Hue](http://www2.meethue.com/en-us/)
* [Unified Remote](https://www.unifiedremote.com/)
* Custom solutions built on the [Particle Photon](particle.io) and [Arduino](https://www.arduino.cc/) platforms,
e.g., [see included custom firmwares](./firmware)
* Any device or service that can be controlled by an HTTP request, e.g.,
a Raspberry Pi running [Close-it](https://github.com/Nase00/close-it) to close the circuit on an apartment call box

Products that are integrated into a Pantheon server will still have their 1st-party solutions function.
E.g., Philips Hue dimmer switches and Unified Remote apps function as normal, even with Pantheon running.

Here are some examples of applications that pair well with Pantheon:
* [Aperature](https://github.com/Nase00/aperature) - Map Microsoft Kinect gestures to HTTP requests
* [Node-HTTP-Macros](https://github.com/Nase00/node-http-macros) - Map hotkeys to HTTP requests

# Getting started
```bash
git clone https://github.com/Nase00/pantheon.git
cd pantheon
touch ./environment/config.json
```

Before proceeding, populate `config.json` with your [configuration parameters](./environment/README.md).

```bash
npm install
npm start
```

# Documentation
* [Triggering Events](./docs/events.md)
* [Environment configuration](./environment/README.md)
