# Environment configuration

`config.json` will define what devices and services will be integrated into the application.

| Property                 | Type    | Value/Description                                    | Required? | Default |
|--------------------------|---------|------------------------------------------------------|-----------|---------|
| id                       | string  | Id used to identify application over WebSocket proxy | Yes       |         |
| password                 | string  | Secret password required for any request to function | Yes       |         |
| proxyHost                | string  | Address of webSocket proxy to connect to             | No        |         |
| allowUnsecuredLAN        | boolean | Check LAN requests against unhashed password         | No        | false   |
| guest                    | object  | Guest options                                        | No        |         |
| - id                     | string  | Id used to identify application over WebSocket proxy | No        |         |
| - indefinite             | boolean | Keep guest proxy instance alive indefinitely         | No        |         |
| - password               | string  | Password provided to guests                          | No        |         |
| spotify                  | object  | [See here](../docs/spotify.md) for more information  | No        |         |
| - cliendId               | string  | [See here](../docs/spotify.md) for more information  | Yes       |         |
| - clientSecret           | string  | [See here](../docs/spotify.md) for more information  | Yes       |         |
| - blacklistedPermissions | array   | Spotify permissions to deny Pantheon                 | No        |         |
| - browser                | string  | Browser to launch Spotify authentication page with   | No        | 'chromium' |
| - display                | string  | Display to launch browser on                         | No        | 0 |
| - foreeKill              | boolean | Force kills browser by process name (`spotify.browser` config)  | No        | false |
| hueUserIDs               | User IDs for Hue bridges - [see here](https://www.developers.meethue.com/documentation/getting-started) on how to register a user to a Hue bridge, and obtain the user ID | No |
| - [ipaddress]            | string  | User ID registered to bridge on ip address           | No        |         |
| photons                  | object  | Individually listed Particle Photon devices          | No        |         |
| - [name of photon]       | object  | Unique name for Photon device                        | Yes       |         |
| -- token                 | string  | Authentication token for Photon device               | Yes       |         |
| -- deviceId              | string  | ID of Photon Device                                  | Yes       |         |
| -- name                  | string  | Name of function to call                             | No        |         |
| -- argument              | string  | Argument to provide to function call                 | No        |         |
| httpRequests             | object  | Pre-defined HTTP requests                            | No        |         |
| - [name of request]      | object  | Unique name for request                              | Yes       |         |
| -- method                | string  | HTTP method to use, e.g., `POST`, `GET`, etc.        | No        | `POST`  |
| -- ...                   | string  | See Node.js's [http.request method](https://nodejs.org/api/http.html#http_http_request_options_callback) for a list of valid `options` properties | Some ||


Example of a `config.json`:
```json
{
  "id": "123456",
  "password": "hunter2",
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
