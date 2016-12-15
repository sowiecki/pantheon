# Environment configuration

`config.json` will define what devices and services will be integrated into the application.

| Parameter            | Description                                        | Required? | Default |
|----------------------|----------------------------------------------------|-----------|---------|
| id                   | Secret passcode required for a request to function | Yes       |         |
| proxyHost            | Address of webSocket proxy to connect to           | No        |         |
| users                | Hue users list                                     | No        |         |
| hue                  | User ID of Hue light assigned in `config.json`, [see here](https://www.developers.meethue.com/documentation/getting-started) on how to register a user to a Hue bridge, and obtain the user ID | No |


TODO finish this after changing APIs

Example of a `config.json`:
```json
{
  "id": "123456",
  "proxyHost": "http://www.digitalocean.com",
  "hue": {
    "userID": "123456"
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
