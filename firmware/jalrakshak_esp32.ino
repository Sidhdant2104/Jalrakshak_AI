#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ============================================================
//                  WIFI CONFIGURATION
// ============================================================

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// FastAPI running on your PC
const char* API_URL = "http://192.168.1.52:8000/api/v1/readings";


// ============================================================
//                  DEVICE CONFIGURATION
// ============================================================

const char* DEVICE_ID = "ESP32_001";


// ============================================================
//                  PIN CONFIGURATION
// ============================================================

// SET 1
#define FLOW_PIN_1       18
#define TDS_PIN_1        32
#define TURBIDITY_PIN_1  34

// SET 2
#define FLOW_PIN_2       19
#define TDS_PIN_2        33
#define TURBIDITY_PIN_2  35

// Both DS18B20 sensors share this OneWire bus
#define ONE_WIRE_BUS     4


// ============================================================
//                  CALIBRATION CONSTANTS
// ============================================================

const float FLOW_CALIBRATION = 7.5;

const float TURBIDITY_CLEAR_VOLTAGE = 3.0;

const float VREF = 3.3;
const int ADC_RESOLUTION = 4096;

const int TDS_SAMPLES = 20;
const int TURBIDITY_SAMPLES = 20;


// ============================================================
//                  GLOBAL VARIABLES
// ============================================================

volatile unsigned long pulseCount1 = 0;
volatile unsigned long pulseCount2 = 0;

float flowRate1 = 0.0;
float flowRate2 = 0.0;

float totalLiters1 = 0.0;
float totalLiters2 = 0.0;

unsigned long lastFlowMillis = 0;


// ============================================================
//                  TEMPERATURE SENSOR
// ============================================================

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);


// ============================================================
//                  FLOW INTERRUPTS
// ============================================================

void IRAM_ATTR pulseCounter1()
{
  pulseCount1++;
}

void IRAM_ATTR pulseCounter2()
{
  pulseCount2++;
}


// ============================================================
//                  ANALOG SENSOR FUNCTIONS
// ============================================================

float readAverageVoltage(int pin, int samples)
{
  long sum = 0;

  for (int i = 0; i < samples; i++)
  {
    sum += analogRead(pin);
    delay(5);
  }

  float averageRaw = (float)sum / samples;

  return (averageRaw / (ADC_RESOLUTION - 1)) * VREF;
}


float calculateTDS(float voltage, float temperature)
{
  float compensationCoefficient =
      1.0 + 0.02 * (temperature - 25.0);

  float compensationVoltage =
      voltage / compensationCoefficient;

  float tdsValue =
      (133.42 * pow(compensationVoltage, 3)
      - 255.86 * pow(compensationVoltage, 2)
      + 857.39 * compensationVoltage) * 0.5;

  return (tdsValue < 0) ? 0.0 : tdsValue;
}


float voltageToNTU(float measuredVoltage)
{
  float voltage5V =
      (measuredVoltage / TURBIDITY_CLEAR_VOLTAGE) * 4.2;

  if (voltage5V > 4.2)
  {
    voltage5V = 4.2;
  }

  float ntu = 0.0;

  if (voltage5V >= 2.5)
  {
    ntu =
        -1120.4 * pow(voltage5V, 2)
        + 5742.3 * voltage5V
        - 4352.9;

    if (ntu < 0)
    {
      ntu = 0;
    }
  }
  else
  {
    ntu = 3000.0;
  }

  return ntu;
}


// ============================================================
//                  WIFI CONNECTION
// ============================================================

void connectWiFi()
{
  Serial.println();
  Serial.println("============================================================");
  Serial.println("                    WIFI CONNECTION");
  Serial.println("============================================================");

  Serial.print("Connecting to: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 30)
  {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("WiFi connected!");
    Serial.print("ESP32 IP address: ");
    Serial.println(WiFi.localIP());

    Serial.print("FastAPI server: ");
    Serial.println(API_URL);
  }
  else
  {
    Serial.println("WiFi connection FAILED.");
  }

  Serial.println("============================================================");
}


// ============================================================
//                  SEND DATA TO FASTAPI
// ============================================================

void sendReadingToAPI(
    float temperature1,
    float temperature2,
    float tdsVoltage1,
    float tdsVoltage2,
    float tds1,
    float tds2,
    float turbidityVoltage1,
    float turbidityVoltage2,
    float turbidity1,
    float turbidity2,
    unsigned long pulses1,
    unsigned long pulses2)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("WiFi disconnected. Reconnecting...");

    connectWiFi();

    if (WiFi.status() != WL_CONNECTED)
    {
      Serial.println("Could not reconnect. Reading not sent.");
      return;
    }
  }

  HTTPClient http;

  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  unsigned long uptime = millis();

  String temperatureStatus1 =
      (temperature1 == DEVICE_DISCONNECTED_C) ? "ERROR" : "OK";

  String temperatureStatus2 =
      (temperature2 == DEVICE_DISCONNECTED_C) ? "ERROR" : "OK";

  String json = "{";

  json += "\"device_id\":\"";
  json += DEVICE_ID;
  json += "\",";

  json += "\"device_uptime_ms\":";
  json += String(uptime);
  json += ",";

  json += "\"flow_1_lpm\":";
  json += String(flowRate1, 2);
  json += ",";

  json += "\"flow_2_lpm\":";
  json += String(flowRate2, 2);
  json += ",";

  json += "\"total_liters_1\":";
  json += String(totalLiters1, 2);
  json += ",";

  json += "\"total_liters_2\":";
  json += String(totalLiters2, 2);
  json += ",";

  json += "\"flow_pulses_1\":";
  json += String(pulses1);
  json += ",";

  json += "\"flow_pulses_2\":";
  json += String(pulses2);
  json += ",";

  json += "\"temperature_1_c\":";
  json += String(temperature1, 2);
  json += ",";

  json += "\"temperature_2_c\":";
  json += String(temperature2, 2);
  json += ",";

  json += "\"temperature_1_status\":\"";
  json += temperatureStatus1;
  json += "\",";

  json += "\"temperature_2_status\":\"";
  json += temperatureStatus2;
  json += "\",";

  json += "\"tds_1_ppm\":";
  json += String(tds1, 1);
  json += ",";

  json += "\"tds_2_ppm\":";
  json += String(tds2, 1);
  json += ",";

  json += "\"tds_voltage_1_v\":";
  json += String(tdsVoltage1, 3);
  json += ",";

  json += "\"tds_voltage_2_v\":";
  json += String(tdsVoltage2, 3);
  json += ",";

  json += "\"turbidity_1_ntu\":";
  json += String(turbidity1, 1);
  json += ",";

  json += "\"turbidity_2_ntu\":";
  json += String(turbidity2, 1);
  json += ",";

  json += "\"turbidity_voltage_1_v\":";
  json += String(turbidityVoltage1, 3);
  json += ",";

  json += "\"turbidity_voltage_2_v\":";
  json += String(turbidityVoltage2, 3);
  json += ",";

  json += "\"quality\":\"VALID\"";

  json += "}";

  Serial.println();
  Serial.println("Sending reading to FastAPI...");
  Serial.println(json);

  int httpResponseCode = http.POST(json);

  Serial.print("HTTP Response Code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0)
  {
    String response = http.getString();

    Serial.println("API Response:");
    Serial.println(response);

    if (httpResponseCode >= 200 && httpResponseCode < 300)
    {
      Serial.println(">>> READING SAVED SUCCESSFULLY <<<");
    }
    else
    {
      Serial.println(">>> API REJECTED THE READING <<<");
    }
  }
  else
  {
    Serial.print("HTTP request failed: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  http.end();
}


// ============================================================
//                  SETUP
// ============================================================

void setup()
{
  Serial.begin(115200);

  delay(1000);

  // ADC configuration
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  // Flow sensors
  pinMode(FLOW_PIN_1, INPUT_PULLUP);
  pinMode(FLOW_PIN_2, INPUT_PULLUP);

  attachInterrupt(
      digitalPinToInterrupt(FLOW_PIN_1),
      pulseCounter1,
      RISING
  );

  attachInterrupt(
      digitalPinToInterrupt(FLOW_PIN_2),
      pulseCounter2,
      RISING
  );

  // Temperature sensors
  sensors.begin();
  sensors.setWaitForConversion(false);

  lastFlowMillis = millis();

  Serial.println();
  Serial.println("============================================================");
  Serial.println("              JALRAKSHAK WATER MONITORING");
  Serial.println("============================================================");

  Serial.print("DS18B20 sensors found: ");
  Serial.println(sensors.getDeviceCount());

  Serial.println("============================================================");

  // Connect WiFi
  connectWiFi();

  Serial.println();
  Serial.println("System ready.");
  Serial.println("============================================================");
}


// ============================================================
//                  MAIN LOOP
// ============================================================

void loop()
{
  unsigned long currentMillis = millis();

  if (currentMillis - lastFlowMillis >= 1000)
  {
    // --------------------------------------------------------
    // FLOW CALCULATION
    // --------------------------------------------------------

    noInterrupts();

    unsigned long pulses1 = pulseCount1;
    unsigned long pulses2 = pulseCount2;

    pulseCount1 = 0;
    pulseCount2 = 0;

    interrupts();

    float intervalSeconds =
        (currentMillis - lastFlowMillis) / 1000.0;

    lastFlowMillis = currentMillis;

    flowRate1 =
        (pulses1 / intervalSeconds) / FLOW_CALIBRATION;

    flowRate2 =
        (pulses2 / intervalSeconds) / FLOW_CALIBRATION;

    totalLiters1 +=
        (flowRate1 / 60.0) * intervalSeconds;

    totalLiters2 +=
        (flowRate2 / 60.0) * intervalSeconds;


    // --------------------------------------------------------
    // TEMPERATURE
    // --------------------------------------------------------

    sensors.requestTemperatures();

    float temperature1 =
        sensors.getTempCByIndex(0);

    float temperature2 =
        sensors.getTempCByIndex(1);

    float tempComp1 =
        (temperature1 == DEVICE_DISCONNECTED_C)
        ? 25.0
        : temperature1;

    float tempComp2 =
        (temperature2 == DEVICE_DISCONNECTED_C)
        ? 25.0
        : temperature2;


    // --------------------------------------------------------
    // TDS
    // --------------------------------------------------------

    float tdsVoltage1 =
        readAverageVoltage(TDS_PIN_1, TDS_SAMPLES);

    float tdsVoltage2 =
        readAverageVoltage(TDS_PIN_2, TDS_SAMPLES);

    float tds1 =
        calculateTDS(tdsVoltage1, tempComp1);

    float tds2 =
        calculateTDS(tdsVoltage2, tempComp2);


    // --------------------------------------------------------
    // TURBIDITY
    // --------------------------------------------------------

    float turbidityVoltage1 =
        readAverageVoltage(
            TURBIDITY_PIN_1,
            TURBIDITY_SAMPLES
        );

    float turbidityVoltage2 =
        readAverageVoltage(
            TURBIDITY_PIN_2,
            TURBIDITY_SAMPLES
        );

    float turbidity1 =
        voltageToNTU(turbidityVoltage1);

    float turbidity2 =
        voltageToNTU(turbidityVoltage2);


    // --------------------------------------------------------
    // SERIAL DASHBOARD
    // --------------------------------------------------------

    Serial.println();
    Serial.println("============================================================");
    Serial.println("                 WATER MONITORING DASHBOARD");
    Serial.println("============================================================");

    Serial.println("SET 1");
    Serial.println("------------------------------------------------------------");

    Serial.printf(
        "Flow       : %.2f L/min\n",
        flowRate1
    );

    Serial.printf(
        "Total      : %.2f L\n",
        totalLiters1
    );

    if (temperature1 == DEVICE_DISCONNECTED_C)
    {
      Serial.println(
          "Temperature: ERROR"
      );
    }
    else
    {
      Serial.printf(
          "Temperature: %.2f °C\n",
          temperature1
      );
    }

    Serial.printf(
        "TDS        : %.1f ppm (%.3f V)\n",
        tds1,
        tdsVoltage1
    );

    Serial.printf(
        "Turbidity  : %.1f NTU (%.3f V)\n",
        turbidity1,
        turbidityVoltage1
    );


    Serial.println();
    Serial.println("SET 2");
    Serial.println("------------------------------------------------------------");

    Serial.printf(
        "Flow       : %.2f L/min\n",
        flowRate2
    );

    Serial.printf(
        "Total      : %.2f L\n",
        totalLiters2
    );

    if (temperature2 == DEVICE_DISCONNECTED_C)
    {
      Serial.println(
          "Temperature: ERROR"
      );
    }
    else
    {
      Serial.printf(
          "Temperature: %.2f °C\n",
          temperature2
      );
    }

    Serial.printf(
        "TDS        : %.1f ppm (%.3f V)\n",
        tds2,
        tdsVoltage2
    );

    Serial.printf(
        "Turbidity  : %.1f NTU (%.3f V)\n",
        turbidity2,
        turbidityVoltage2
    );

    Serial.println("============================================================");


    // --------------------------------------------------------
    // SEND TO FASTAPI
    // --------------------------------------------------------

    sendReadingToAPI(
        temperature1,
        temperature2,
        tdsVoltage1,
        tdsVoltage2,
        tds1,
        tds2,
        turbidityVoltage1,
        turbidityVoltage2,
        turbidity1,
        turbidity2,
        pulses1,
        pulses2
    );
  }
}