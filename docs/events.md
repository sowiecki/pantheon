# Batching events
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

body: Construct a JSON array of objects with your [events](./docs/EVENTS.md).

# Supported Events
### Hue Lighting
*Currently, RGB is not supported*

**type (string)**: `EMIT_HUE_SWITCH`

**id (number)**: ID of light to switch state for

**value (number|string)**: `'toggle'`, `'on'`, `'off'`, or provide an integer to set a specific brightness

### Particle Photon

This event wraps the [Particle callFunction](https://docs.particle.io/reference/javascript/#callfunction) API.

**type (string)**: `EMIT_TRIGGER_PHOTON_FUNCTION`

The following are each required, but can be defined either as property on the device name in `config.json`, or by the event request.
If in the event request, the associated property in `config.json` will be ignored for that instance of the event.

**name (string)**: Name of the function to call

**argument (string)**: Arguement to provide to function

**deviceId (string)**: See Particle's [Device Management & Ownership docs](https://docs.particle.io/support/troubleshooting/device-management/photon/)

**auth (string)**: See Particle's [Access Tokens docs](https://docs.particle.io/guide/how-to-build-a-product/authentication/#access-tokens)

### Unified Remote
**type (string)**: `EMIT_SEND_UNIFIED_COMMAND`

**name (string)**: See [supported commands](../server/middleware/unified/commands.js)

**[command] (any)**: Type of command to send, e.g. provide text for `sendText`

# Proxying requests
If a `proxyHost` is defined in `./environment/config.json`, requests can alternatively be directed to the proxy.

[Acheron](https://github.com/Nase00/acheron) is recommended, but any WebSocket server can be set up to forward requests.

The only API difference is that the `hostname` and `path` must point to where the proxy is hosted.
