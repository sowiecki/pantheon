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

export const raw = () => JSON.stringify({
  'ID':'Unified.Command','Action':7,'Request':7,'Run':{'Name':'address'},'Source':'web-b15db286-19e0-4ad2-a73a-ecda926cdc55'
})

// export const sendText = () => JSON.stringify({
//   'ID':'Unified.Chrome','Action':7,'Request':7,'Run':{'Name':'address'},'Source':'web-b15db286-19e0-4ad2-a73a-ecda926cdc55'
// });
