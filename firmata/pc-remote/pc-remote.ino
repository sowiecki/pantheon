int moboPower = D7;
int moboReset = D1;

void setup() {
  pinMode(moboPower, OUTPUT);
  pinMode(moboReset, OUTPUT);

  Spark.function("pc-power", pcPower);

  digitalWrite(moboPower, LOW);
  digitalWrite(moboReset, LOW);
}

int pcPower(String command) {
  if (command == "togglePower") {
    digitalWrite(moboPower, HIGH);
    delay(100);
    digitalWrite(moboPower, LOW);
    return 1;
  }
  else if (command == "reset") {
    digitalWrite(moboReset, HIGH);
    delay(100);
    digitalWrite(moboReset, LOW);
    return 0;
  }
  else {
    return -1;
  }
}

