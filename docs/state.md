# Custom Application State (Advanced)

## Adding custom state

Pantheon can be configured to maintain custom state, and update this state in response to triggered events.
How you and your applications use and consume this custom state is completely up to you.

An example use case would be saving the state of a door lock, for example one using [deadbolt-nfc](https://github.com/Nase00/deadbolt-nfc).
If we want to know whether the door is locked or unlocked, first we must set up Pantheon to save this custom state.
When defining the door lock service, we add an additional `$state` property,
and add the state key we want to use, in this case `isLocked`:

```js
// config.json
{
  "httpRequests": {
    "doorLock": {
      "options": {
        "path": "/api/toggle",
        "port": 8080,
        "hostname": "192.168.1.123",
        "headers": {
          "password": "hunter2"
        }
      },

      "$state": {
        // Custom state key
        "isLocked": {
          "type": "bool",

          // Initial state will include { isLocked: true }
          "default": "true",

          // Function that declares how to handle updates to this state property
          "$handler": "function (value) { return !value; }"
        }
      }
    }
  }
}
```

With this configuration, when Pantheon is run it will include the `isLocked` state and initialize it with `true`.
To update this state, the `$state` key must be specified as part of the event object.

Continuing with the door lock example, we can update the `isLocked` state property by specifying it when we trigger the `doorLock` event:

```js
// HTTP request body
[
  { "type": "EMIT_FORWARD_HTTP_REQUEST", "key": "doorLock", "$state": ["isLocked"] }
]
```

The `$handler` we provided was a simple function to flip the state property's value.

## Using custom state

Pantheon's current state can be queried by issuing a POST request against `/api/state` with the `id` set in `config.json` included as a header.
Finishing up the door lock example, we can use this service to set up an application that lets us know whether the door is locked or unlocked.

```js
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/state',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    id: 'hunter2'
  }
};

const req = http.request(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', (data) => {
    console.log('state', JSON.parse(data));
  });
});
```

This should give us the following response object:

```js
{
  devicesReducer: {
    isLocked: true,
  },
  occurrencesReducer: {}
}
```
