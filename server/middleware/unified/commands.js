export const sendText = ({ value }) => JSON.stringify({
  ID: 'Relmtech.Keyboard',
  Action: 7,
  Request: 7,
  Run: {
    Extras: {
      Values:
      [{ Value: value }]
    },
    Name: 'toggle'
  }
});

export const launchGoogleMusic = () => JSON.stringify({
  ID: 'Unified.GoogleMusic',
  Action: 7,
  Request: 7,
  Run: {
    Name: 'launch'
  }
});

export const focusAddress = () => JSON.stringify({
  ID: 'Unified.Chrome',
  Action: 7,
  Request: 7,
  Run: {
    Name: 'address'
  }
});

export const triggerCommand = ({ value }) => JSON.stringify({
  ID: 'Examples.CustomRun',
  Action: 7,
  Request: 7,
  Run: {
    Name: `command${value}`
  }
});

export const spotifyPlayPause = () => JSON.stringify({
  ID: 'Unified.Spotify',
  Action: 7,
  Request: 7,
  Run: { Name: 'play_pause' }
});

export const spotifyNextTrack = () => JSON.stringify({
  ID: 'Unified.Spotify',
  Action: 7,
  Request: 7,
  Run: { Name: 'next' }
});

export const spotifyPrevTrack = () => JSON.stringify({
  ID: 'Unified.Spotify',
  Action: 7,
  Request: 7,
  Run: { Name: 'previous' }
});
