[![Build Status](https://img.shields.io/travis/Nase00/pantheon/master.svg?style=flat-square)](https://travis-ci.org/Nase00/pantheon)
[![Coveralls](https://img.shields.io/coveralls/Nase00/pantheon.svg?style=flat-square)](https://coveralls.io/github/Nase00/pantheon)

[![GitHub Release](https://img.shields.io/github/release/Nase00/pantheon.svg?style=flat-square)](https://github.com/Nase00/pantheon/releases)
![license](https://img.shields.io/github/license/Nase00/pantheon.svg?style=flat-square)

*This software is in **alpha**,
and is currently undergoing major changes to make it more configurable, modular, and well-documented for wider consumption.*

Pantheon is an application for managing control of multiple "Internet of Things" (IoT) devices.
It serves a hub or central point of access for multiple, diverse types of services and devices.

Integrated services and devices can be triggered by one or more HTTP requests to an instance of Pantheon.
A single request can contain multiple events, with each event in a request body triggered sequentially.
Events are triggered immediately one after the other, unless a delay is specified.
For example,

```js
// An HTTP request body sent by a cellphone app upon arriving home
[
  // Trigger a separate application to open the building gate
  {
    "type": "EMIT_FORWARD_HTTP_REQUEST",
    "key": "buildingGate",
    "password": "hunter2"
  },

  // Set bulb 1 to brightness 100
  {
    "type": "EMIT_SEND_HUE_COMMAND",
    "id": 1,
    "func": "brightness",
    "arg": 100
  },

  // Turn bulb 2 off
  {
    "type": "EMIT_SEND_HUE_COMMAND",
    "id": 2,
    "func": "turnOff"
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

  // Wait 60 seconds, then trigger script (through Unified Remote) on the PC to open and play music
  {
    "type": "EMIT_SEND_UNIFIED_COMMAND",
    "name": "triggerCommand",
    "id": "Bob.CustomRun",
    "command": "action3",
    "delay": 60000
  }
]
```

Currently supported integrations:

* [Philips Hue](http://www2.meethue.com/en-us/)
* [Unified Remote](https://www.unifiedremote.com/)
* Custom solutions built on the [Particle Photon](particle.io) and [Arduino](https://www.arduino.cc/) platforms,
e.g., [Lamprey](https://github.com/Nase00/lamprey) and [deadbolt-nfc](https://github.com/Nase00/deadbolt-nfc)
* Any device or service that can be controlled by an HTTP request, e.g.,
a Raspberry Pi running [Close-it](https://github.com/Nase00/close-it) to close the circuit on an apartment call box

Because Pantheon does not replace or interfere with preexisting device communication protocols,
products that are integrated will still have their first-party solutions function.
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
* [Environment Configuration](./environment/README.md)
* [Triggering Events](./docs/events.md)
* [Custom State](./docs/state.md)
