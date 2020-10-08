//James Adhitthana - Firebase ESP Upload //CSV Only//
#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>
//--WifiManager--//
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h> //https://github.com/tzapu/WiFiManager
//--//
#define FIREBASE_HOST "TODO: CHANGE ME"                    //Firebase host domain
#define FIREBASE_AUTH "TODO: CHANGE ME" //Firebase authentication key //TODO: CHANGE ME
// #define WIFI_SSID "TS-A4-06"
// #define WIFI_PASSWORD "bagusaccess"

//-------Define Firebase Data objects-------//
FirebaseData firebaseDataCounter;
FirebaseData firebaseDataCSV;
//END OF: Define Firebase Data objects--//

String path = "/arduino";            //parent node path
String pathDataRaw = "/arduino/raw"; //path for raw data to be saved in

int debugCounter = 0; //Set counter for debugging on the firebase database (this counter tells how many times the ESP8266 uploaded its data [can be overriden])
void setup()
{
    //-------Setup Serial Comms Receiver-------//
    Serial.begin(9600); //Changed to 9600 FROM 115200 which is ESP's original baud rate
    Serial.println();
    Serial.println();
    //END OF: Setup Serial Comms Receiver--//

    //-------Connect Wifi-------//
    //--WifiManager--//
    Serial.print("Connecting to Wi-Fi");
    WiFiManager wifiManager;                          //-----unblockme james
    // wifiManager.resetSettings();                      //reset saved WifiManager settings (DANGEROUS)
    wifiManager.autoConnect("aerate", "aeratejames"); //set AP name as aerate and password as aeratejames [used when previous wifi cannot be found]
    //**wifiManager.autoConnect("aerate");//Tested

    Serial.println("Connected to Wifi Successfully :)");
    //END OF: WifiManager--//

    // // WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    // Serial.print("Connecting to Wi-Fi");
    // while (WiFi.status() != WL_CONNECTED)
    // {
    //     Serial.print(">wifi>");
    //     delay(300);
    // }
    // Serial.println();
    // Serial.print("Connected with IP: ");
    // Serial.println(WiFi.localIP());
    // Serial.println();
    // //END OF: Connect Wifi--//

    //-------Setup Firebase Connection-------//
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);
    //END OF: Setup Firebase Connection--//
}

void loop()
{
    //-------------------Setup Receiver-------------------//
    String IncomingString = "";  //Set string for incomingString
    boolean StringReady = false; //Set boolean to check if the incoming string is ready or not

    while (Serial.available()) //Check if serial communication is able to be connected to
    {
        IncomingString = Serial.readString(); //Read serial communication between Uno and ESP and store it in the variable
        StringReady = true;
    }

    if (StringReady) //If string is recieved and ready to be used
    {
        Serial.print("[ESP8266 Received String]: ");
        Serial.println(IncomingString);

        //-------Upload and Set Counter Data in Firebase-------//
        if (Firebase.setInt(firebaseDataCounter, path + "/" + "counter", debugCounter)) //Upload and check if successful
        {
            Serial.print("[firebase-SUCCESS]:set 'debugCounter' to ");
            Serial.println(debugCounter);
        }
        else //Upload failure error handling//
        {
            Serial.print("[FAILED]: Could not set counter - ");
            Serial.println(firebaseDataCounter.errorReason());
        }
        //END OF: Upload and Set Counter Data in Firebase--//

        //*-*-*-*-*-*-*-*-*-*-*-*-Process CSV File*-*-*-*-*-*-*-*-*-*-*-*-//
        String pathCsvDataIteration = IncomingString.substring(0, IncomingString.indexOf(',')); //Target Parent/Key to upload the CSV to
        String pathCsvDataDate = IncomingString.substring(0, IncomingString.indexOf('T'));
        // 2020-03-01T22:47:04 //get fist 9 chars

        //--Set csvData--//
        if (Firebase.setString(firebaseDataCSV, pathDataRaw + "/" + pathCsvDataDate + "/" + pathCsvDataIteration, IncomingString)) //Upload and check if successful
        {
            Serial.println("[firebase-SUCCESS]:Successfuly uploaded Csv Data");
        }
        else //Upload failure error handling//
        {
            Serial.print("[FAILED]: Could not set Csv Data - ");
            Serial.println(firebaseDataCSV.errorReason());
        }
        // //END OF: Process CSV File--//
        debugCounter++;
    }
    //END OF: Setup Receiver--------------//

    // //-------James Looper-------//
    yield();    //Must have to prevent WDT (Watch Dog Timer) from resetting
    delay(100); //Needs a delay of 100ms to be able to recieve the whole incoming string
    // //END OF: James Looper--//
}