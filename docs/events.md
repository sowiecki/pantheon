# Events

An *event* is a result of instructing an integrated service or device to do something.

## Batching events
To batch an event or events, issue an HTTP request to your server:

hostname: `yourAppLocationHostName` (When running locally, `http://localhost:4000/api`.)

path: `https://path/to/your/application`

method: `POST`

headers:
```json
{
  "id": "yourSecretPasscodeDefinedInTheConfig",
  "event": "BATCH_EVENTS",
  "Content-Type": "application/json"
}
```

event: Set to `SINGLE_EVENT` to pass a single event object,
or `BATCH_EVENTS` to send an array of sequentially-triggered events.

body: Construct a JSON array of objects with your [events](./docs/EVENTS.md).

Alternatively, you can set the "body" as a header property.
This is useful as a workaround for use cases like [Particle Photon Webhooks](https://docs.particle.io/guide/tools-and-features/webhooks/), which lack support for sending proper HTTP request bodies.
Be sure to set the header key as "body" and the value as a JSON-serialized string of an array of event objects.

## Supported Events
All events accept these properties for convenience:

* `delay`: Delays firing the event for given milliseconds
* `duplicate`: Duplicates the event a given number of times. Every duplicate event runs immediately after any delay.
* `repeat`: Repeats the event *with any given delay* between each repeated event.

### Hue Lighting
*Important*: If your network has multiple discoverable Hue bridges,
you must specify the ip address of the bridge you wish to communicate with
when sending commands. This holds true even if not all bridges are registered with Pantheon!

**type (string)**: `EMIT_SEND_HUE_COMMAND`

**id (number)**: ID of light to switch state for

**ipaddress (string)**: IP address of Hue bridge (if you have more than one on your network)

**func (string)**: A valid function on the light state, see [node-hue-api's documention](https://github.com/peter-murray/node-hue-api#using-lightstate-to-build-states).
Also available: `toggle` to toggle the current light state.

**arg (int)**: A valid number value for light state functions that require it, see [node-hue-api's documention](https://github.com/peter-murray/node-hue-api#using-lightstate-to-build-states).

#### Particle Photon

This event wraps the [Particle callFunction](https://docs.particle.io/reference/javascript/#callfunction) API.

**type (string)**: `EMIT_TRIGGER_PHOTON_FUNCTION`

The following are each required, but can be defined either as property on the device name in `config.json`, or by the event request.
If in the event request, the associated property in `config.json` will be ignored for that instance of the event.

**key (string)**: Key of stored properties within `config.json`.

**name (string)**: Name of the function to call

**argument (string)**: Arguement to provide to function

**deviceId (string)**: See Particle's [Device Management & Ownership docs](https://docs.particle.io/support/troubleshooting/device-management/photon/)

**auth (string)**: See Particle's [Access Tokens docs](https://docs.particle.io/guide/how-to-build-a-product/authentication/#access-tokens)

### Unified Remote
**type (string)**: `EMIT_SEND_UNIFIED_COMMAND`

**name (string)**: See [supported commands](../server/middleware/unified/commands.js)

**[value] (any)**: Type of command to send, e.g. provide text for `sendText`

#### HTTP Request
**type (string)**: `EMIT_FORWARD_HTTP_REQUEST`

**key (string)**: Key of stored properties within `config.json`.

The following are each required, but can be defined either as property on the device name in `config.json`, or by the event request.
If in the event request, the associated property in `config.json` will be ignored for that instance of the event.

**method (string)**: Any valid HTTP method, defaults to `POST`.

Refer to Node.js's [http.request method](https://nodejs.org/api/http.html#http_http_request_options_callback) for other options.

Example of manually sending an event:
```json
{ "type": "EMIT_FORWARD_HTTP_REQUEST", "options": { "path": "/api/doot", "port": 3000, "hostname": "192.168.1.100" }, "body": { "code": "hunter2" } }
```

Example of pre-defining the event parameters, and referencing the key from `config.json`:

##### Request body
```json
{ "type": "EMIT_FORWARD_HTTP_REQUEST", "key": "dootAPI" }
```
##### config.json
```json
{
  ...
  "httpRequests": {
    "dootAPI": {
      "options": {
        "path": "/api/doot",
        "port": 3000,
        "hostname": "192.168.1.100"
      },
      "body": { "code": "hunter2" }
    }
  }
}
```

## Queueing events
To queue an event, add a `conditions` property to the event request.

**conditions (object)**: The state keys and values to wait on before activating the queued event.

If the state condition is already met, the queued event will fire immediately. If not, checks will be performed each time the state is updated from any source to see if the condition is met to trigger the queued event.

Example of queueing an event to play music once a door is opened:
```json
{ "type": "EMIT_SEND_SPOTIFY_COMMAND", "key": "playerPlay", "conditions": { "doorUnlocked": true, "doorAjar": true, "motionDetected": true } }
```
In this example, the above event would be trigger by the following state update (send individually, or batch it with other events):
```json
{"type": "EMIT_CUSTOM_STATE_UPDATE", "path": "httpRequests.dootSensor", "stateUpdates": { "doorUnlocked": true, "doorAjar": true } }
{"type": "EMIT_CUSTOM_STATE_UPDATE", "path": "httpRequests.motionSensor", "stateUpdates": { "motionDetected": true } }
```

## Proxying events
If a `proxyHost` is defined in `./environment/config.json`, event requests can alternatively be directed to the proxy.

[Acheron](https://github.com/Nase00/acheron) is recommended, but any WebSocket server can be set up to forward requests.

The only API difference is that the `hostname` and `path` must point to where the proxy is hosted.
