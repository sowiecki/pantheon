#include "IRTransmitter/IRTransmitter.h"

#define IR_PIN D6
#define IRLED_PIN D7
#define MUTE

// Raw data can be sniffed using an IR-receiver and e.g. https://github.com/z3t0/Arduino-IRremote/blob/master/examples/IRrecvDumpV2/IRrecvDumpV2.ino
unsigned int volumeUp[77] = {4500,4500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,500, 500,500, 500,1500, 500,1500, 500,1500, 500,1500, 550,500, 500,500, 500,500, 500,500, 500,4500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,1500, 500,500, 500,1500, 500,1500, 500,1500, 500,500, 500,500, 500,500, 500,500, 550,1500, 500,500, 500,500, 500,500, 500,1500, 500};  // UNKNOWN CF2F9DAB
unsigned int volumeDown[77] = {4500,4500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,500, 500,500, 500,1550, 500,1500, 500,1500, 500,1500, 500,500, 500,500, 500,500, 500,500, 500,4500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 550,1500, 500,1500, 500,500, 500,1500, 500,1500, 500,1500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500};  // UNKNOWN B2BBAC69
unsigned int mute[77] = {4500,4500, 500,500, 500,500, 500,500, 500,500, 500,1550, 450,1500, 500,500, 500,500, 500,1500, 500,1500, 550,1500, 500,1500, 500,500, 500,500, 500,500, 500,500, 500,4500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,1500, 500,500, 550,500, 500,1500, 500,1500, 500,1500, 500,500, 500,500, 500,500, 500,1500, 500};  // UNKNOWN 123CD34B
unsigned int togglePower[77] = {4500,4500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,500, 500,500, 500,1500, 500,1500, 500,1500, 500,1550, 500,500, 500,500, 500,500, 500,500, 500,4500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,500, 500,1500, 500,1500, 500,1500, 500,500, 500,1500, 500,1500, 500,1500, 500,1500, 500,500, 500,500, 550,500, 500,1500, 500};  // UNKNOWN CA31DA45

IRTransmitter transmitter(IR_PIN, IRLED_PIN);

const int BUTTON_PIN = D0;
const int LED_PIN = D1;
const int SPEAKER_PIN = A0;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  Particle.subscribe("hook-response/Acheron", handleEvent , MY_DEVICES);

  Particle.function("pc-sound", pcSound);
}

int pcSound(String command) {
  if (command == "mute") {
    transmitter.Transmit(mute, sizeof(mute) / sizeof(mute[0]));
  } else if (command == "volumeUp") {
    transmitter.Transmit(volumeUp, sizeof(volumeUp) / sizeof(volumeUp[0]));
  } else if (command == "volumeDown") {
    transmitter.Transmit(volumeDown, sizeof(volumeDown) / sizeof(volumeDown[0]));
  } else if (command == "togglePower") {
    transmitter.Transmit(togglePower, sizeof(togglePower) / sizeof(togglePower[0]));
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
