# Supported Events
### Hue Lighting
**type (string)**: `EMIT_HUE_SWITCH`

**id (string)**: ID of Hue light assigned in `config.json`

**value (number|string)**: `'toggle'`, `'on'`, `'off'`, or provide an integer to set a specific brightness

### Particle Photon

**type (string)**: `EMIT_TRIGGER_PHOTON_FUNCTION`

### Unified Remote
**type (string)**: `EMIT_SEND_UNIFIED_COMMAND`

**name (string)**: See [supported commands](../server/middleware/unified/commands.js)

**[value] (any)**: Value for specific command, e.g. provide text for `sendText`
