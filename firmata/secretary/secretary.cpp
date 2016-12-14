#include "IRTransmitter/IRTransmitter.h"
#include "codes.h"

#define IR_PIN D6
#define IRLED_PIN D7

IRTransmitter transmitter(IR_PIN, IRLED_PIN);

const int BUTTON_PIN = D0;
const int LED_PIN = D1;
const int SPEAKER_PIN = A0;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  Particle.subscribe("hook-response/Acheron", handleEvent , MY_DEVICES);

  Particle.function("pc-sound", pcSound);
  Particle.function("ht-sound", htSound);
}

int pcSound(String command) {
  if (command == "mute") {
    transmitter.Transmit(pcMute, sizeof(pcMute) / sizeof(pcMute[0]));
  } else if (command == "volumeUp") {
    transmitter.Transmit(pcVolumeUp, sizeof(pcVolumeUp) / sizeof(pcVolumeUp[0]));
  } else if (command == "volumeDown") {
    transmitter.Transmit(pcVolumeDown, sizeof(pcVolumeDown) / sizeof(pcVolumeDown[0]));
  } else if (command == "togglePower") {
    transmitter.Transmit(pcTogglePower, sizeof(pcTogglePower) / sizeof(pcTogglePower[0]));
  }

  return 1;
}

int htSound(String command) {
  if (command == "mute") {
    transmitter.Transmit(htMute, sizeof(htMute) / sizeof(htMute[0]));
  } else if (command == "volumeUp") {
    transmitter.Transmit(htVolumeUp, sizeof(htVolumeUp) / sizeof(htVolumeUp[0]));
  } else if (command == "volumeDown") {
    transmitter.Transmit(htVolumeDown, sizeof(htVolumeDown) / sizeof(htVolumeDown[0]));
  } else if (command == "togglePower") {
    transmitter.Transmit(htTogglePower, sizeof(htTogglePower) / sizeof(htTogglePower[0]));
  }

  return 1;
}

void handleEvent(const char *event, const char *data) {
  Particle.publish(event, data);
}

void loop() {
  bool pressed = digitalRead(BUTTON_PIN);

  if (pressed) {
    Particle.publish("BUZZ");
    digitalWrite(LED_PIN, HIGH);
  }
  else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(100);
}
