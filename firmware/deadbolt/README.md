Arduino firmata for deadbolt NFC lock control.

Before compiling, create file `authorized-ids.h` with the following:

```c
const unsigned long int authorizedIDs[] = {
  12345678, // Example NFC ID
  87654321 // Example NFC ID
};
```
