//James Adhitthana - UnoWifi Reciever Code that relays the data from Mega to ESP8266--//
void setup()
{
    // Begin the Serial at 9600 Baud
    Serial.begin(9600);
    while (!Serial) //Check Serial Availability (MANDATORY)
        continue;
}

void loop()
{
    String IncomingString = "";  //Set string for incomingString
    boolean StringReady = false; //Set boolean to check if the incoming string is ready or not

    while (Serial.available()) //Check if serial communication is able to be connected to
    {
        IncomingString = Serial.readString(); //Read serial communication between Uno and ESP and store it in the variable
        StringReady = true;
    }

    if (IncomingString != "") //If string is not empty (theres data) then print to serial (send to ESP)
    {
        Serial.print(IncomingString); //Printing to serial means sending to ESP because ESP is monitoring the serial output from UNO
    }
    // else
    // {
    //     Serial.print(","); //DEBUG: loading prompt//
    // }
    delay(100); //Needs a delay of 100ms to be able to recieve the whole incoming string
}