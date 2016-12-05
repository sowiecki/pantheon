#define NFC_ALERT_PIN D0
#define TRIGGER_PIN D1

int handleToggle(String pw) {
  if (pw == "") {
    digitalWrite(TRIGGER_PIN, HIGH);
    delay(100);
    digitalWrite(TRIGGER_PIN, LOW);
    return 1;
  }

  return 0;
}

void setup() {
  pinMode(TRIGGER_PIN, INPUT);

  Particle.function("toggle", handleToggle);
}

void loop() {
  bool insidePressed = digitalRead(NFC_ALERT_PIN);

  if (insidePressed) {
    Particle.publish("DEADBOLT_INSIDE_PRESSED");
  }

  delay(100);
}
