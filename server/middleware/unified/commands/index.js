export const sendText = (value) => JSON.stringify({
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
