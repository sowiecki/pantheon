const int BUTTON_PIN = D0;
const int LED_PIN = D1;
const int SPEAKER_PIN = A0;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  Particle.subscribe("hook-response/Acheron", handleEvent , MY_DEVICES);
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
