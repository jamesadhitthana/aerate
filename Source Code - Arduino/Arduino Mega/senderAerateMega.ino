//James Adhitthana - 00000021759//
//Coba Mega (Gabung semua di mega) = MQ8, mq6, mq135
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <dht.h>    //dht11 library
#include "RTClib.h" //RTC Clock LIbrary
//----------------------------------------------------MQ8----------------------------------------------------//
/************************Hardware Related Macros************************************/
#define MQ8_PIN (A0)                   //define which analog input channel you are going to use
#define MQ8_RL_VALUE (10)              //define the load resistance on the board, in kilo ohms
#define MQ8_RO_CLEAN_AIR_FACTOR (9.21) //RO_CLEAR_AIR_FACTOR=(Sensor resistance in clean air)/RO, \
                                   //which is derived from the chart in datasheet
/***********************Software Related Macros************************************/
#define MQ8_CALIBRATION_SAMPLE_TIMES (50)     //define how many samples you are going to take in the calibration phase
#define MQ8_CALIBRATION_SAMPLE_INTERVAL (500) //define the time interal(in milisecond) between each samples in the \
                                          //cablibration phase
#define MQ8_READ_SAMPLE_INTERVAL (50)         //define how many samples you are going to take in normal operation
#define MQ8_READ_SAMPLE_TIMES (5)             //define the time interal(in milisecond) between each samples in \
                                          //normal operation
/**********************Application Related Macros**********************************/
#define MQ8_GAS_H2 (0)
/*****************************Globals***********************************************/
float MQ8_H2Curve[3] = {2.3, 0.93, -1.44}; //two points are taken from the curve in datasheet.
                                           //with these two points, a line is formed which is "approximately equivalent"
                                           //to the original curve.
                                           //data format:{ x, y, slope}; point1: (lg200, lg8.5), point2: (lg10000, lg0.03)
float MQ8_Ro = 10;                         //MQ8_Ro is initialized to 10 kilo ohms

//----------------------------------------------------MQ6----------------------------------------------------//
/*========Hardware Related Macros=====================*/
#define MQ6_PIN (A1)                 //define which analog input channel you are going to use
#define MQ6_RL_VALUE (20)            //define the load resistance on the board, in kilo ohms
#define MQ6_RO_CLEAN_AIR_FACTOR (10) //RO_CLEAR_AIR_FACTOR=(Sensor resistance in clean air)/RO, \
                                 //which is derived from the chart in datasheet

/*============Software Related Macros ===============*/
#define MQ6_CALIBRATION_SAMPLE_TIMES (50)     //define how many samples you are going to take in the calibration phase
#define MQ6_CALIBRATION_SAMPLE_INTERVAL (500) //define the time interal(in milisecond) between each samples in the \
                                          //cablibration phase
#define MQ6_READ_SAMPLE_INTERVAL (50)         //define how many samples you are going to take in normal operation
#define MQ6_READ_SAMPLE_TIMES (5)             //define the time interal(in milisecond) between each samples in \
                                          //normal operation

/*=============Application Related Macros============*/
#define MQ6_GAS_LPG (0)
#define MQ6_GAS_CH4 (1)

/*===============Globals=============================*/
float MQ6_LPGCurve[3] = {3, 0, -0.4};    //two points are taken from the curve.
                                         //with these two points, a line is formed which is "approximately equivalent"
                                         //to the original curve.
                                         //data format:{ x, y, slope}; point1: (lg1000, lg1), point2: (lg10000, lg0.4)
float MQ6_CH4Curve[3] = {3.3, 0, -0.38}; //two points are taken from the curve.
                                         //with these two points, a line is formed which is "approximately equivalent"
                                         //to the original curve.
                                         //data format:{ x, y, slope}; point1: (lg2000, lg1), point2: (lg5000,  lg0.7)
float MQ6_Ro = 10;                       //MQ6_Ro is initialized to 10 kilo ohms
float MQ6_glp = 0;
const int MQ6_Buzzer = 7;
//----------------------------------------------------MQ135----------------------------------------------------//
#define MQ135_PIN (A2)    //analog feed from MQ135
#define MQ135_co2Zero 100 //125=342->422//135=350//100 =525//55 for original //calibrated CO2 0 level

//----------------------------------------------------MQ7----------------------------------------------------//
#define MQ7_PIN A3  // mendefinisikan bahwa pin yang digunakan \
                    // untuk membaca sensor adalah pin A0
long MQ7_RL = 1000; // 1000 Ohm
long MQ7_Ro = 830;  // Calibrated for James' Sensor (make sure that MQ7_ppm is about 20-ish value)

//----------------------------------------------------MQ3----------------------------------------------------//
#define MQ3_PIN A4

//----------------------------------------------------DHT11(Temp/Humidity)----------------------------------------------------//
dht DHT11;
#define DHT11_PIN 7
float dht11Temperature;
float dht11Humidity;

//----------------------------------------------------Sharp GP2Y1010AU0F Dust Sensor----------------------------------------------------//

//#define PRINT_RAW_DATA
#define SHARP_USE_AVG

// Arduino pin numbers.
const int sharpLEDPin = 37; // Arduino digital pin 7 connect to sensor LED.
const int sharpVoPin = A6;  // Arduino analog pin 5 connect to sensor sharpVo.

// For averaging last SHARP_N raw voltage readings.
// #ifdef SHARP_USE_AVG
#define SHARP_N 100
static unsigned long SharpVoRawTotal = 0;
static int SharpVoRawCount = 0;
// #endif // SHARP_USE_AVG

// Set the typical output voltage in Volts when there is zero dust.
static float SharpVoc = 0.6;

// Use the typical sensitivity in units of V per 100ug/m3.
const float SharpK = 0.5;

//----Piezo Buzzer----//
const int piezoPin = 36; //buzzer
//END OF: Piezo Buzzer//

//----LED Lights----//
int ledRed = 33;   // the pin the LED is connected to
int ledGreen = 32; // the pin the LED is connected to
int ledBlue = 34;  // the pin the LED is connected to
//END OF: LED Lights//

//----Buttons----//
const int buttonPin = 35; // the number of the pushbutton pin

// variables will change:
int buttonState = 0; // variable for reading the pushbutton status
bool buttonActivated = true;
//END OF: Buttons//

//----RTC_DS3231 Real Time Clock----//
RTC_DS3231 rtc;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sat"};

//END OF: RTC_DS3231 Real Time Clock//

//----MQ2 Smoke----//
#include <MQ2.h>
int MQ2_PIN = A5;
int MQ2_ppm;
MQ2 mq2(MQ2_PIN);
//END OF: MQ2 Smoke//

//----James Headers----//
LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE); // Set the LCD I2C address
int timeElapsed = 0;
int h2Value = -99;
int debugCounter = 0;
//Setup millis()
int ledRedState = LOW;            // ledRedState used to set the LED
unsigned long previousMillis = 0; // will store last time LED was updated
const long interval = 1000;       // interval at which to blink (milliseconds)

int counterIterations = 0; //This counts how many iterations it has gone through in order to upload using the set Iterations on "uploadEveryXIterations"
//---Upload Iterations (TODO: CHANGE ME TO CHANGE HOW LONG IT WILL WAIT BEFORE UPLOADING THE DATA)---//
//Multipler to upload every 4 seconds
//One iteration = 4 seconds
//So if uploadEveryXIterations=1, then it uploads for every 4 seconds
//If uploadEveryXIterations=2, then it will upload to the database for every 4*2= 8 seconds
//If uploadEveryXIterations=3, then it upload to the database for every 4*3= 12 seconds
//If uploadEveryXIterations=4, then it upload to the database for every 4*4= 16 seconds
//If uploadEveryXIterations=8, then it upload to the database for every 4*8= 32 seconds
int uploadEveryXIterations = 4; //TODO: Change me according to the set iteration times
//--//

//END OF: James Headers//
void setup()
{
  Serial.begin(9600);  //UART setup, baudrate = 9600bps
                       //--James LCD--//
  lcd.begin(20, 4);    //set units starting from 0
  lcd.setCursor(0, 0); //(x,y) index starts at 0
  lcd.print("Sensors Warming Up!");
  lcd.setCursor(8, 1);
  lcd.print("****");
  lcd.setCursor(4, 2);
  lcd.print("Don't Touch");
  lcd.setCursor(8, 3);
  lcd.print("****");
  //--//

  //----RTC_DS3231 Real Time Clock----//
  if (!rtc.begin())
  {
    //***Serial.println("Couldn't find RTC");
    lcd.print("Couldn't find RTC");
    while (1)
      ;
  }

  if (rtc.lostPower())
  {
    //***Serial.println("RTC lost power, lets set the time!");

    // Following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  //END OF: RTC_DS3231 Real Time Clock//

  //----LED Lights----//
  pinMode(ledRed, OUTPUT);      // Declare the LED as an output
  pinMode(ledGreen, OUTPUT);    // Declare the LED as an output
  pinMode(ledBlue, OUTPUT);     // Declare the LED as an output
  digitalWrite(ledRed, HIGH);   // Turn the LED off
  digitalWrite(ledGreen, HIGH); // Turn the LED on
  digitalWrite(ledBlue, HIGH);  // Turn the LED on

  //----MQ8 H2----//
  //***Serial.print("Calibrating MQ8...\n");
  MQ8_Ro = MQ8Calibration(MQ8_PIN); //Calibrating the sensor. Please make sure the sensor is in clean air
                                    //when you perform the calibration
                                    //***Serial.print("Calibration is done...\n");
                                    //***Serial.print("MQ8_Ro=");
                                    //***Serial.print(MQ8_Ro);
                                    //***Serial.print("kohm");
                                    //***Serial.print("\n");
                                    //END OF: MQ8 H2//

  //----MQ2 Smoke----//
  mq2.begin();
  //END OF: MQ2 Smoke//

  //----MQ6 LPG----//
  pinMode(MQ6_Buzzer, OUTPUT);
  //***Serial.print("Calibrating MQ6...\n");
  MQ6_Ro = MQ6Calibration(MQ6_PIN); //Calibrating the sensor. Please make sure the sensor is in clean air
                                    //when you perform the calibration
  //***Serial.print("Calibration is done...\n");
  //***Serial.print("MQ6_Ro=");
  //***Serial.print(MQ6_Ro);
  //***Serial.print("kohm");
  //***Serial.print("\n");
  //End of MQ6//

  //----MQ135 C02ppm----//
  // pinMode(MQ135_PIN, INPUT); //MQ135 analog feed set for input
  //END OF: MQ135 C02ppm//

  //----MQ7 C0ppm----//
  // long MQ7_RL = 1000; // 1000 Ohm
  // long MQ7_Ro = 830;  // Calibrated for James' Sensor (make sure that MQ7_ppm is about 20-ish value)
  //END OF: MQ135 C02ppm//

  //----MQ3 Alcohol Vapor mgL----//
  // #define MQ3_PIN A4
  //END OF: MQ3 Alcohol Vapor mgL//

  //----DHT11 Temperature Humidity----//
  // empty
  //END OF: DHT11 Temperature Humidity//

  //----Sharp GP2Y1010AU0F Dust ug/m3----//
  pinMode(sharpLEDPin, OUTPUT);
  //END OF: Sharp GP2Y1010AU0F Dust ug/m3//

  //----Buzzer----//
  // pinMode(piezoPin, OUTPUT);
  //END OF: Buzzer//

  //----Button----//
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  //END OF: Button//

  //END OF: LED Lights//
  tone(piezoPin, 750, 500); // Send ready sound signal...
  lcd.clear();
}

void loop()
{
  //----MQ8 H2----//
  //***Serial.print("H2 Concentration:");
  h2Value = MQ8GetGasPercentage(MQ8Read(MQ8_PIN) / MQ8_Ro, MQ8_GAS_H2);
  //***Serial.print(h2Value);
  //***Serial.print("ppm");
  //***Serial.print("\n");
  //END OF: MQ8 H2//

  //----MQ2 Smoke----//
  MQ2_ppm = mq2.readSmoke();
  //END OF: MQ2 Smoke//

  //----MQ6 LPG PPM----//
  //***Serial.print("LPG:");
  MQ6_glp = MQ6GetGasPercentage(MQ6Read(MQ6_PIN) / MQ6_Ro, MQ6_GAS_LPG);
  //***Serial.print(MQ6_glp);
  //***Serial.print("ppm");
  //***Serial.print("        ");

  //***Serial.print("CH4::");
  //***Serial.print(MQ6GetGasPercentage(MQ6Read(MQ6_PIN) / MQ6_Ro, MQ6_GAS_CH4));
  //***Serial.print("ppm");
  //***Serial.print("\n");

  if (MQ6_glp > 0)
  {
    digitalWrite(MQ6_Buzzer, HIGH);
  }
  else
  {
    digitalWrite(MQ6_Buzzer, LOW);
  }
  //END OF: MQ6 PPM----//

  //----MQ135 C02ppm----//
  int MQ135_co2now[10];         //int array for co2 readings
  int MQ135_co2raw = 0;         //int for raw value of co2
  int MQ135_co2comp = 0;        //int for compensated co2
  int MQ135_co2ppm = 0;         //int for calculated ppm
  int MQ135_c02TempAverage = 0; //int for averaging
  for (int x = 0; x < 10; x++)
  { //samplpe co2 10x over 2 seconds
    MQ135_co2now[x] = analogRead(MQ135_PIN);
    delay(200);
  }
  for (int x = 0; x < 10; x++)
  { //add samples together
    MQ135_c02TempAverage = MQ135_c02TempAverage + MQ135_co2now[x];
  }
  MQ135_co2raw = MQ135_c02TempAverage / 10;              //divide samples by 10
  MQ135_co2comp = MQ135_co2raw - MQ135_co2Zero;          //get compensated value
  MQ135_co2ppm = map(MQ135_co2comp, 0, 1023, 400, 5000); //map value for atmospheric levels

  //***Serial.print("CO2 Level");  //print title
  //***Serial.print(" ");          //skip a line
  //***Serial.print(MQ135_co2ppm); //print co2 ppm
  //***Serial.print(" PPM \n");    //print units
  //END OF: MQ135 C02ppm//

  //----MQ7 C0ppm----//
  int MQ7_sensorvalue = analogRead(MQ7_PIN);     // membaca nilai ADC dari sensor
  float MQ7_VRL = MQ7_sensorvalue * 5.00 / 1024; // mengubah nilai ADC ( 0 - 1023 ) menjadi nilai voltase ( 0 - 5.00 volt )

  float MQ7_Rs = (5.00 * MQ7_RL / MQ7_VRL) - MQ7_RL;

  float MQ7_ppm = 100 * pow(MQ7_Rs / MQ7_Ro, -1.53); // MQ7_ppm = 100 * ((rs/ro)^-1.53);
  //***Serial.print("MQ7 CO : ");
  //***Serial.print(MQ7_ppm);
  //***Serial.println(" ppm");
  //END OF: MQ7 C0ppm//

  //----MQ3 Alcohol Vapor mgL----//
  float MQ3_adcValue = 0;
  for (int i = 0; i < 10; i++)
  {
    MQ3_adcValue += analogRead(MQ3_PIN);
    delay(10);
  }
  float MQ3_voltage = (MQ3_adcValue / 10) * (5.0 / 1024.0); //Calculations for voltage
  float MQ3_mgL = 0.67 * MQ3_voltage;                       //Calculations for calibration
  //***Serial.print("MQ3 Alcohol Vapor:");
  //***Serial.print(MQ3_mgL);
  //***Serial.print(" mg/L");
  if (MQ3_mgL > 0.8)
  {
    // lcd.print("Drunk   ");
    //***Serial.println("    Drunk");
    //digitalWrite(buz, HIGH);
    // digitalWrite(led, HIGH);
  }
  else
  {
    // lcd.print("Normal  ");
    //***Serial.println("    Normal");
    // digitalWrite(buz, LOW);
    //  digitalWrite(led, LOW);
  }
  //END OF: MQ3 Alcohol Vapor mgL//

  //----DHT11 Temperature Humidity----//
  int chk = DHT11.read11(DHT11_PIN);
  if (DHT11.temperature > 0)
  {
    dht11Temperature = DHT11.temperature;
    dht11Humidity = DHT11.humidity;
    //***Serial.print("Temperature = ");
    //***Serial.println(dht11Temperature);
    //***Serial.print("Humidity = ");
    //***Serial.println(dht11Humidity);
  }
  else
  {
    //***Serial.print("Temperature SKIPPED (-999) so displaying old temp = ");
    //***Serial.println(dht11Temperature);
    //***Serial.print("Humidity SKIPPED (-999) so displaying old humidity = ");
    //***Serial.println(dht11Humidity);
  }

  // delay(2000);
  //END OF: DHT11 Temperature Humidity//

  //----Sharp GP2Y1010AU0F Dust ug/m3----//
  float sharpVo;
  for (int i = 0; i < 100; i++) //Dust calculate 100x//
  {
    // Turn on the dust sensor LED by setting digital pin LOW.
    digitalWrite(sharpLEDPin, LOW);

    // Wait 0.28ms before taking a reading of the output voltage as per spec.
    delayMicroseconds(280);

    // Record the output voltage. This operation takes around 100 microseconds.
    int sharpVoRaw = analogRead(sharpVoPin);

    // Turn the dust sensor LED off by setting digital pin HIGH.
    digitalWrite(sharpLEDPin, HIGH);

    // Wait for remainder of the 10ms cycle = 10000 - 280 - 100 microseconds.
    delayMicroseconds(9620);
    sharpVo = sharpVoRaw;

    SharpVoRawTotal += sharpVoRaw;
    SharpVoRawCount++;
    if (SharpVoRawCount >= SHARP_N)
    {
      sharpVo = 1.0 * SharpVoRawTotal / SHARP_N;
      SharpVoRawCount = 0;
      SharpVoRawTotal = 0;
      //***Serial.println("Sharp averaged 100x");
    }
    else
    {
      // return;
    }
  }
  //-end of: Dust calculation 100x//

  // Compute the output voltage in Volts.
  sharpVo = sharpVo / 1024.0 * 5.0;

  // Convert to Dust Density in units of ug/m3.
  float sharpdV = sharpVo - SharpVoc;
  if (sharpdV < 0)
  {
    sharpdV = 0;
    SharpVoc = sharpVo;
  }

  float sharpDustDensity = sharpdV / SharpK * 100.0;
  //***Serial.print("Dust: ");
  //***Serial.print(sharpDustDensity);
  //***Serial.print("ug/m3");
  //END OF: Sharp GP2Y1010AU0F Dust ug/m3//

  //---##########James AQI##########---//

  float resultAQI;
  float concentrationDustForAQI = ((10 * sharpDustDensity)) / 10;

  if (concentrationDustForAQI >= 0 && concentrationDustForAQI < 12.1)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 0, 12, 0, 50);
  }
  else if (concentrationDustForAQI >= 12.1 && concentrationDustForAQI < 35.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 12.1, 35.4, 51, 100);
  }
  else if (concentrationDustForAQI >= 35.5 && concentrationDustForAQI < 55.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 35.5, 55.4, 101, 150);
  }
  else if (concentrationDustForAQI >= 55.5 && concentrationDustForAQI < 150.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 55.5, 150.4, 151, 200);
  }
  else if (concentrationDustForAQI >= 150.5 && concentrationDustForAQI < 250.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 150.5, 250.4, 201, 300);
  }
  else if (concentrationDustForAQI >= 250.5 && concentrationDustForAQI < 350.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 250.5, 350.4, 301, 400);
  }
  else if (concentrationDustForAQI >= 350.5 && concentrationDustForAQI < 500.5)
  {
    resultAQI = piecewiseLinear(concentrationDustForAQI, 350.5, 500.4, 401, 500);
  }
  else
  {
    resultAQI = 999;
  }

  //END OF James AQI--//
  //000000000000000000000-James Button and Buzzer Looper-000000000000000000000//

  //-----------------==Check Button Functionality==------------------//
  buttonState = digitalRead(buttonPin);
  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH)
  {
    // turn LED on:
    digitalWrite(ledGreen, HIGH);
    if (buttonActivated == true)
    {
      buttonActivated = false;
      lcd.clear();
    }
    else
    {
      buttonActivated = true;
      lcd.clear();
    }
  }

  if (buttonActivated)
  {
    //do
  }
  else
  {
    tone(piezoPin, 750, 1000); //tone(pin#,freq in hz, duration);
  }
  //END OF: James Check Buttons//

  //----------------------------==DANGEROUS WARNING ALARM Buzzer/Beeper Functionality==----------------------------//
  unsigned long currentMillis = millis();
  if (MQ3_mgL > 0.8 || h2Value > 100 || MQ2_ppm > 425 || MQ135_co2ppm > 800 || MQ6_glp > 100.00 || MQ7_ppm > 25.00 || sharpDustDensity > 25.00 || dht11Temperature > 30.00 || dht11Humidity > 80.00) //Check if value is over threshold
  {
    tone(piezoPin, 1000, 1000); // Send 1KHz sound signal...

    // digitalWrite(ledRed, HIGH); //Turn RED LED ON

    //--
    if (currentMillis - previousMillis >= interval)
    {
      // save the last time you blinked the LED
      previousMillis = currentMillis;

      // if the LED is off turn it on and vice-versa:
      if (ledRedState == LOW)
      {
        ledRedState = HIGH;
      }
      else
      {
        ledRedState = LOW;
      }

      // set the LED with the ledRedState of the variable:
      digitalWrite(ledRed, ledRedState);
    }
    //--
  }
  else
  {
    digitalWrite(ledRed, LOW); // Turn the LED off
  }
  //END OF:DANGEROUS WARNING ALARM Buzzer/Beeper Functionality////

  //--__+_+_+_+_+_+_+_+_+James LCD Looper+_+_+_+_+_+_+_+_+__--//
  //***Serial.println();
  DateTime now = rtc.now(); //Create DateTime from RTC
  lcd.clear();
  if (buttonActivated == false)
  {

    //#0RTC LCD [PAGE2]--//

    //time elapsed
    //#8 H2 to LCD [Page2]
    lcd.setCursor(0, 0);
    lcd.print("H2:");
    lcd.print(h2Value);
    //--//
    lcd.setCursor(0, 1);
    lcd.print("upload every:");
    lcd.print(uploadEveryXIterations * 4);
    lcd.print("sec");
    //date
    lcd.setCursor(0, 2);

    lcd.print(now.day(), DEC);
    lcd.print('/');
    lcd.print(now.month(), DEC);
    lcd.print('/');
    lcd.print(now.year(), DEC);

    lcd.print(" ");

    lcd.print(daysOfTheWeek[now.dayOfTheWeek()]);

    lcd.setCursor(0, 3);

    if (now.hour() < 10)
    {
      lcd.print("0");
    }
    lcd.print(now.hour(), DEC);

    lcd.print(':');
    if (now.minute() < 10)
    {
      lcd.print("0");
    }
    lcd.print(now.minute(), DEC);

    lcd.print(':');

    if (now.second() < 10)
    {
      lcd.print(0);
    }
    lcd.print(now.second(), DEC);

    //END OF: RTC LCD//
    lcd.print(" Count:");//Counter
    lcd.print(timeElapsed);
  }
  else
  {

    topLeft();
    //1#AQI to lcd
    lcd.print("AQI:");
    lcd.print((int)resultAQI); //print in int

    //2#dht11 to lcd
    lcd.print(" T=");
    lcd.print((int)dht11Temperature);
    lcd.print("c");
    lcd.print("H=");
    lcd.print((int)dht11Humidity);
    lcd.print("%");

    //3#Dust to lcd
    lcd.setCursor(0, 1); //second line
    lcd.print("Dst:");
    lcd.print(sharpDustDensity);
    // lcd.print("ug/m3");

    //4#c02 to lcd
    lcd.print(" CO2:");      //print title
    lcd.print(MQ135_co2ppm); //print co2 ppm

    //5#mq7CO to lcd
    lcd.setCursor(0, 2);
    lcd.print("CO:");
    lcd.print(MQ7_ppm); //ppm

    //6#smoke to lcd
    lcd.print(" Smk:");
    lcd.print(MQ2_ppm); //ppm

    //7#lpg to lcd
    lcd.setCursor(0, 3);
    lcd.print("LPG:");
    lcd.print(MQ6_glp); //ppm

    //8#mq3 to lcd
    lcd.print(" Alc:");
    lcd.print(MQ3_mgL); //mg/L
  }
  timeElapsed += 1;
  // delay(1000);
  //END OF: James LCD LOOPER//

  //--------------------+++Sending to Arduino Uno Wifi+++--------------------//
  //----------Create and Send CSV String to ESP8266----------//
  //-------Build CSV String-------//
  String csvMega = "";
  //RTC to String//
  csvMega.concat(now.year());
  csvMega += "-";
  if (now.month() < 10)
  {
    csvMega += "0";
  }
  csvMega.concat(now.month());

  csvMega += "-";
  if (now.day() < 10)
  {
    csvMega += "0";
  }
  csvMega.concat(now.day());
  csvMega += "T";
  if (now.hour() < 10)
  {
    csvMega += "0";
  }
  csvMega.concat(now.hour());
  csvMega += ":";
  if (now.minute() < 10)
  {
    csvMega += "0";
  }
  csvMega.concat(now.minute());
  csvMega += ":";
  if (now.second() < 10)
  {
    csvMega += "0";
  }
  csvMega.concat(now.second());
  //END OF: RTC to String// //0.start

  csvMega += ",";                        //counterDariMega[";
  csvMega.concat(debugCounter);          //1
  csvMega += ",";                        //h2Value[";
  csvMega.concat(h2Value);               //2
  csvMega += ",";                        //mq2SensorValue[";
  csvMega.concat(MQ2_ppm);               //3
  csvMega += ",";                        //MQ6_glp[";
  csvMega.concat(MQ6_glp);               //4
  csvMega += ",";                        //MQ135_co2ppm[";
  csvMega.concat(MQ135_co2ppm);          //5
  csvMega += ",";                        //MQ7_ppm[";
  csvMega.concat(MQ7_ppm);               //6
  csvMega += ",";                        //MQ3_mgL[";
  csvMega.concat(MQ3_mgL);               //7
  csvMega += ",";                        //dhtTemp[";
  csvMega.concat((int)dht11Temperature); //8
  csvMega += ",";                        //dhtHum[";
  csvMega.concat((int)dht11Humidity);    //9
  csvMega += ",";                        //dustDensity[";
  csvMega.concat(sharpDustDensity);      //10
  csvMega += ",true";                    //11.last
  //CSV Length = 12 items
  //END OF: Build CSV String--//
  counterIterations++;
  if (counterIterations >= uploadEveryXIterations)
  {
    digitalWrite(ledBlue, HIGH); // Turn the LED on
    Serial.print(csvMega);       //Print to serial for sending to ESP8266
    //END OF: Create and Send CSV String to ESP8266----------//
    debugCounter++;
    digitalWrite(ledBlue, LOW); // Turn the LED off
    counterIterations = 0;
  }

  //END OF:Sending to Arduino Uno Wifi--//
}
//**END OF: Arduino Loop*******************************************************************************//

//-------------------------James Functions---------------------------------------------------------//

void topLeft()
{
  lcd.setCursor(0, 0); //Starts from 0
}
//-------------------------------------------------------------------------------------------------//

//----------------------------------------------------MQ6----------------------------------------------------//

/*=============== MQ6ResistanceCalculation ==================
Input:   raw_adc - raw value read from adc, which represents the voltage
Output:  the calculated sensor resistance
Remarks: The sensor and the load resistor forms a voltage divider. Given the voltage
         across the load resistor and its resistance, the resistance of the sensor
         could be derived.
============================================================*/
float MQ6ResistanceCalculation(int raw_adc)
{
  return (((float)MQ6_RL_VALUE * (1023 - raw_adc) / raw_adc));
}

/*===================== MQ6Calibration ======================
Input:   mq_pin - analog channel
Output:  MQ6_Ro of the sensor
Remarks: This function assumes that the sensor is in clean air. It use  
         MQ6ResistanceCalculation to calculates the sensor resistance in clean air 
         and then divides it with MQ6_RO_CLEAN_AIR_FACTOR. MQ6_RO_CLEAN_AIR_FACTOR is about 
         10, which differs slightly between different sensors.
============================================================*/
float MQ6Calibration(int mq_pin)
{
  int i;
  float val = 0;

  for (i = 0; i < MQ6_CALIBRATION_SAMPLE_TIMES; i++)
  { //take multiple samples
    val += MQ6ResistanceCalculation(analogRead(mq_pin));
    delay(MQ6_CALIBRATION_SAMPLE_INTERVAL);
  }
  val = val / MQ6_CALIBRATION_SAMPLE_TIMES; //calculate the average value

  val = val / MQ6_RO_CLEAN_AIR_FACTOR; //divided by MQ6_RO_CLEAN_AIR_FACTOR yields the MQ6_Ro
                                       //according to the chart in the datasheet

  return val;
}
/*==================== MQ6Read ===============================
Input:   mq_pin - analog channel
Output:  Rs of the sensor
Remarks: This function use MQ6ResistanceCalculation to caculate the sensor resistenc (Rs).
         The Rs changes as the sensor is in the different consentration of the target
         gas. The sample times and the time interval between samples could be configured
         by changing the definition of the macros.
============================================================*/
float MQ6Read(int mq_pin)
{
  int i;
  float rs = 0;

  for (i = 0; i < MQ6_READ_SAMPLE_TIMES; i++)
  {
    rs += MQ6ResistanceCalculation(analogRead(mq_pin));
    delay(MQ6_READ_SAMPLE_INTERVAL);
  }

  rs = rs / MQ6_READ_SAMPLE_TIMES;

  return rs;
}

/*=======================  MQ6GetGasPercentage ==================
Input:   rs_ro_ratio - Rs divided by MQ6_Ro
         gas_id      - target gas type
Output:  ppm of the target gas
Remarks: This function passes different curves to the MQ6GetPercentage function which 
         calculates the ppm (parts per million) of the target gas.
===============================================================*/
int MQ6GetGasPercentage(float rs_ro_ratio, int gas_id)
{
  if (gas_id == MQ6_GAS_LPG)
  {
    return MQ6GetPercentage(rs_ro_ratio, MQ6_LPGCurve);
  }
  else if (gas_id == MQ6_GAS_CH4)
  {
    return MQ6GetPercentage(rs_ro_ratio, MQ6_CH4Curve);
  }

  return 0;
}

/*========================  MQ6GetPercentage ===================
Input:   rs_ro_ratio - Rs divided by MQ6_Ro
         pcurve      - pointer to the curve of the target gas
Output:  ppm of the target gas
Remarks: By using the slope and a point of the line. The x(logarithmic value of ppm) 
         of the line could be derived if y(rs_ro_ratio) is provided. As it is a 
         logarithmic coordinate, power of 10 is used to convert the result to non-logarithmic 
         value.
===============================================================*/
int MQ6GetPercentage(float rs_ro_ratio, float *pcurve)
{
  return (pow(10, (((log(rs_ro_ratio) - pcurve[1]) / pcurve[2]) + pcurve[0])));
}

//----------------------------------------------------MQ8----------------------------------------------------//
float MQ8ResistanceCalculation(int raw_adc)
{
  /****************** MQ8ResistanceCalculation ****************************************
Input:   raw_adc - raw value read from adc, which represents the voltage
Output:  the calculated sensor resistance
Remarks: The sensor and the load resistor forms a voltage divider. Given the voltage
         across the load resistor and its resistance, the resistance of the sensor
         could be derived.
************************************************************************************/
  return (((float)MQ8_RL_VALUE * (1023 - raw_adc) / raw_adc));
}

float MQ8Calibration(int mq_pin)
/***************************** MQ8Calibration ****************************************
Input:   mq_pin - analog channel
Output:  MQ8_Ro of the sensor
Remarks: This function assumes that the sensor is in clean air. It use  
         MQ8ResistanceCalculation to calculates the sensor resistance in clean air 
         and then divides it with MQ8_RO_CLEAN_AIR_FACTOR. MQ8_RO_CLEAN_AIR_FACTOR is about 
         10, which differs slightly between different sensors.
************************************************************************************/
{
  int i;
  float val = 0;

  for (i = 0; i < MQ8_CALIBRATION_SAMPLE_TIMES; i++)
  { //take multiple samples
    val += MQ8ResistanceCalculation(analogRead(mq_pin));
    delay(MQ8_CALIBRATION_SAMPLE_INTERVAL);
  }
  val = val / MQ8_CALIBRATION_SAMPLE_TIMES; //calculate the average value

  val = val / MQ8_RO_CLEAN_AIR_FACTOR; //divided by MQ8_RO_CLEAN_AIR_FACTOR yields the MQ8_Ro
                                       //according to the chart in the datasheet

  return val;
}

float MQ8Read(int mq_pin)
{ /*****************************  MQ8Read *********************************************
Input:   mq_pin - analog channel
Output:  Rs of the sensor
Remarks: This function use MQ8ResistanceCalculation to caculate the sensor resistenc (Rs).
         The Rs changes as the sensor is in the different consentration of the target
         gas. The sample times and the time interval between samples could be configured
         by changing the definition of the macros.
************************************************************************************/
  int i;
  float rs = 0;

  for (i = 0; i < MQ8_READ_SAMPLE_TIMES; i++)
  {
    rs += MQ8ResistanceCalculation(analogRead(mq_pin));
    delay(MQ8_READ_SAMPLE_INTERVAL);
  }

  rs = rs / MQ8_READ_SAMPLE_TIMES;

  return rs;
}

int MQ8GetGasPercentage(float rs_ro_ratio, int gas_id)
{
  /*****************************  MQ8GetGasPercentage **********************************
Input:   rs_ro_ratio - Rs divided by MQ8_Ro
         gas_id      - target gas type
Output:  ppm of the target gas
Remarks: This function passes different curves to the MQ8GetPercentage function which 
         calculates the ppm (parts per million) of the target gas.
************************************************************************************/
  if (gas_id == MQ8_GAS_H2)
  {
    return MQ8GetPercentage(rs_ro_ratio, MQ8_H2Curve);
  }
  return 0;
}

int MQ8GetPercentage(float rs_ro_ratio, float *pcurve)
{
  /*****************************  MQ8GetPercentage **********************************
Input:   rs_ro_ratio - Rs divided by MQ8_Ro
         pcurve      - pointer to the curve of the target gas
Output:  ppm of the target gas
Remarks: By using the slope and a point of the line. The x(logarithmic value of ppm) 
         of the line could be derived if y(rs_ro_ratio) is provided. As it is a 
         logarithmic coordinate, power of 10 is used to convert the result to non-logarithmic 
         value.
************************************************************************************/
  return (pow(10, (((log(rs_ro_ratio) - pcurve[1]) / pcurve[2]) + pcurve[0])));
}

//James piecewiselinear (For AQI calculation)
float piecewiseLinear(float concentration, int concentrationLow, int concentrationHigh, int indexLow, int indexHigh)
{
  return (indexHigh - indexLow) / (concentrationHigh - concentrationLow) * (concentration - concentrationLow) + indexLow;
}