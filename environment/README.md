# Environment configuration

`config.json` will define what devices and services will be integrated into the application.

| Parameter            | Description                                        | Required? | Default |
|----------------------|----------------------------------------------------|-----------|---------|
| id                   | Secret passcode required for a request to function | Yes       |         |
| proxyHost            | Address of webSocket proxy to connect to           | No        |         |
| users                | Hue users list                                     | No        |         |
TODO finish this after changing APIs

Example of a `config.json`:
```json
{
  "id": "123456",
  "proxyHost": "http://www.digitalocean.com",
  "users": {
    "user#alias Bob": "123456"
  },
  "bridges": {
    "primary": {
      "id": "00123456",
      "internalipaddress": "192.168.1.100"
    }
  },
  "ports": {
    "jFive": "/dev/cu.usbmodem1",
    "serial": "/dev/cu.usbmodem1"
  },
  "photons": {
    "deadbolt": {
      "token": "123456",
      "deviceId": "654321"
    },
    "secretary": {
      "token": "123456",
      "deviceId": "098765"
    },
    "lamprey": {
      "token": "123456",
      "deviceId": "555555"
    }
  },
  "buzzer": {
    "hostname": "192.168.1.123",
    "port": 8080
  },
  "unified": {
    "hostname": "192.168.1.321"
  }
}
```
