# Security

# WebSocket Proxy

Requests received through a connected WebSocket Proxy must contain a valid hashed password.

# HTTP/HTTPS requests over LAN

By default, requests received through an HTTP or HTTPS must contain a valid hashed password. This can be disabled by setting `allowUnsecuredLAN` to `true` in the [environment config](../environment/README.md).

## Guest access configuration

To enable guest access, send a state update event:

```json
{"type": "EMIT_CUSTOM_STATE_UPDATE", "stateUpdates": { "guestEnabled": true } }
```

By default, guest access keeps itself alive for 5 minutes once it has been enabled. The connection is destroyed after 5 minutes and must be manually re-established. To keep it alive indefinitely, set `guest.indefinite` to `true` in the [environment config](../environment/README.md).
