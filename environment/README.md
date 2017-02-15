# Environment configuration

`config.json` will define what devices and services will be integrated into the application.

| Property             | Value/Description                                    | Required? | Default |
|----------------------|------------------------------------------------------|-----------|---------|
| id                   | Secret passcode required for any request to function | Yes       |         |
| proxyHost            | Address of webSocket proxy to connect to             | No        |         |
| hueUserIDs           | User IDs for Hue bridges - [see here](https://www.developers.meethue.com/documentation/getting-started) on how to register a user to a Hue bridge, and obtain the user ID | No |
| - [ipaddress]        | User ID registered to bridge on ip address           | No        |         |
| photons              | Individually listed Particle Photon devices          | No        |         |
| - token              | Authentication token for Photon device               | Yes       |         |
| - deviceId           | ID of Photon Device                                  | Yes       |         |
| - name               | Name of function to call                             | No        |         |
| - argument           | Argument to provide to function call                 | No        |         |
| httpRequests         | Pre-defined HTTP requests                             | No        |         |
| - method             | HTTP method to use, e.g., `POST`, `GET`, etc.        | No        | `POST`  |
| - ...                | See Node.js's [http.request method](https://nodejs.org/api/http.html#http_http_request_options_callback) for a list of valid `options` properties | Some ||


Example of a `config.json`:
```json
{
  "id": "123456",
  "proxyHost": "http://www.digitalocean.com",
  "hueUserIDs": {
    "192.168.1.100": "123456"
  },
  "ports": {
    "jFive": "/dev/cu.usbmodem1",
    "serial": "/dev/cu.usbmodem1"
  },
  "photons": {
    "deadbolt": {
      "token": "123456",
      "deviceId": "654321",
      "argument": "open",
      "password": "hunter2"
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
  "httpRequests": {
    "buzz": {
      "options": {
        "path": "/api/press",
        "port": 3000,
        "hostname": "192.168.1.100"
      },
      "body": { "code": "hunter" }
    }
  },
  "unified": {
    "hostname": "192.168.1.321"
  }
}
```
