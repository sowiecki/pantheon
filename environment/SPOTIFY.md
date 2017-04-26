# Advanced Spotify Integration

For more advanced Spotify control, Pantheon uses Spotify's [authorization code flow](https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow)
to obtain the highest level user permissions. This gives Pantheon the capability to directly control music any of your Spotify devices.

For basic Spotify control, that does not require special permissions,
consult the [Unified Remote](../docs/events.md) integration for indirect control of Spotify applications on Windows, OSX, and Linux devices.

This integration requires registering your instance of the application on [https://developer.spotify.com/my-applications](https://developer.spotify.com/my-applications). Once registered, you must use the parameters provided on the page to set
the [config.json](./README.md).

Once integrated with Spotify, upon startup Pantheon will launch a browser to the Spotify authentication page prompting user authorization. If you are already logged in and have given authorization, a seemingly-blank browser window will open and quickly close.

Unfortunately, there is no way around this behavior for getting user-level authorization; a browser window will always open upon startup of Pantheon.

This does mean that Spotify integration is impossible if the device running Pantheon cannot launch a browser.

## Commands

Spotify commands wrap and are *mostly* equivalent those found in the **v1** [Spotify Web API Reference](https://developer.spotify.com/web-api/endpoint-reference/). The only major difference is that parameters and command names are always camelCased, with the command name being a camelCased variation of the API's path, usually only the last two path segments. E.g., `/v1/me/player/play` becomes `"name": "playerPause"`.

Full example of the `playPause` command used to start playback of a specific album:
```json
{ "type": "EMIT_SEND_SPOTIFY_COMMAND", "name": "playerPlay", "contextUri": "spotify:album:6VH2op0GKIl3WNTbZmmcmI" }
```

## Launching Pantheon over SSH on Linux platforms
When launched over SSH on Linux platforms, Pantheon must use an alternative
([but less safe](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback))
method to authenticate Spotify.
By default, it will try to open the authorization URL using the command `DISPLAY=:0 chromium-browser`.
To use a different display and browser, set the `spotify.display` and `spotify.browser` properties in `config.json`.
