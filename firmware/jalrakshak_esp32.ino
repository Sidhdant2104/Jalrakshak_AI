#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ============================================================
//                  WIFI CONFIGURATION
// ============================================================

const char* WIFI_SSID = "YOUR WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR WIFI_PASSWORD";

// FastAPI running on your PC
const char* API_URL = "http://172.20.10.2:8000/api/v1/readings";

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
//                  10-SECOND AVERAGING
// ============================================================

const int AVERAGING_SAMPLES = 10;

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
//                  AVERAGING VARIABLES
// ============================================================

// Number of 1-second samples collected
int sampleCount = 0;

// Flow
float sumFlow1 = 0.0;
float sumFlow2 = 0.0;

// Temperature
float sumTemperature1 = 0.0;
float sumTemperature2 = 0.0;

int validTemperatureSamples1 = 0;
int validTemperatureSamples2 = 0;

// TDS
float sumTDS1 = 0.0;
float sumTDS2 = 0.0;

float sumTDSVoltage1 = 0.0;
float sumTDSVoltage2 = 0.0;

// Turbidity
float sumTurbidity1 = 0.0;
float sumTurbidity2 = 0.0;

float sumTurbidityVoltage1 = 0.0;
float sumTurbidityVoltage2 = 0.0;

// Flow pulses
unsigned long sumPulses1 = 0;
unsigned long sumPulses2 = 0;

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

// ============================================================
//                  TDS CALCULATION
// ============================================================

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

// ============================================================
//                  TURBIDITY CALCULATION
// ============================================================

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
//                  RESET AVERAGING DATA
// ============================================================

void resetAverages()
{
  sampleCount = 0;

  sumFlow1 = 0.0;
  sumFlow2 = 0.0;

  sumTemperature1 = 0.0;
  sumTemperature2 = 0.0;

  validTemperatureSamples1 = 0;
  validTemperatureSamples2 = 0;

  sumTDS1 = 0.0;
  sumTDS2 = 0.0;

  sumTDSVoltage1 = 0.0;
  sumTDSVoltage2 = 0.0;

  sumTurbidity1 = 0.0;
  sumTurbidity2 = 0.0;

  sumTurbidityVoltage1 = 0.0;
  sumTurbidityVoltage2 = 0.0;

  sumPulses1 = 0;
  sumPulses2 = 0;
}

// ============================================================
//                  SEND AVERAGED DATA TO FASTAPI
// ============================================================

void sendReadingToAPI(
    float averageFlow1,
    float averageFlow2,
    float averageTemperature1,
    float averageTemperature2,
    float averageTDSVoltage1,
    float averageTDSVoltage2,
    float averageTDS1,
    float averageTDS2,
    float averageTurbidityVoltage1,
    float averageTurbidityVoltage2,
    float averageTurbidity1,
    float averageTurbidity2,
    unsigned long totalPulses1,
    unsigned long totalPulses2)
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

  String json = "{";

  json += "\"device_id\":\"";
  json += DEVICE_ID;
  json += "\",";

  json += "\"device_uptime_ms\":";
  json += String(uptime);
  json += ",";

  // 10-second average flow
  json += "\"flow_1_lpm\":";
  json += String(averageFlow1, 2);
  json += ",";

  json += "\"flow_2_lpm\":";
  json += String(averageFlow2, 2);
  json += ",";

  // Cumulative totals
  json += "\"total_liters_1\":";
  json += String(totalLiters1, 2);
  json += ",";

  json += "\"total_liters_2\":";
  json += String(totalLiters2, 2);
  json += ",";

  // Total pulses during 10-second window
  json += "\"flow_pulses_1\":";
  json += String(totalPulses1);
  json += ",";

  json += "\"flow_pulses_2\":";
  json += String(totalPulses2);
  json += ",";

  // Temperature averages
  json += "\"temperature_1_c\":";
  json += String(averageTemperature1, 2);
  json += ",";

  json += "\"temperature_2_c\":";
  json += String(averageTemperature2, 2);
  json += ",";

  json += "\"temperature_1_status\":\"OK\",";
  json += "\"temperature_2_status\":\"OK\",";

  // TDS averages
  json += "\"tds_1_ppm\":";
  json += String(averageTDS1, 1);
  json += ",";

  json += "\"tds_2_ppm\":";
  json += String(averageTDS2, 1);
  json += ",";

  json += "\"tds_voltage_1_v\":";
  json += String(averageTDSVoltage1, 3);
  json += ",";

  json += "\"tds_voltage_2_v\":";
  json += String(averageTDSVoltage2, 3);
  json += ",";

  // Turbidity averages
  json += "\"turbidity_1_ntu\":";
  json += String(averageTurbidity1, 1);
  json += ",";

  json += "\"turbidity_2_ntu\":";
  json += String(averageTurbidity2, 1);
  json += ",";

  json += "\"turbidity_voltage_1_v\":";
  json += String(averageTurbidityVoltage1, 3);
  json += ",";

  json += "\"turbidity_voltage_2_v\":";
  json += String(averageTurbidityVoltage2, 3);
  json += ",";

  json += "\"quality\":\"VALID\"";

  json += "}";

  Serial.println();
  Serial.println("============================================================");
  Serial.println("        SENDING 10-SECOND AVERAGE TO FASTAPI");
  Serial.println("============================================================");

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
      Serial.println(">>> 10-SECOND READING SAVED SUCCESSFULLY <<<");
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
//                  PROCESS 10-SECOND AVERAGE
// ============================================================

void processAverage()
{
  if (sampleCount == 0)
  {
    return;
  }

  float averageFlow1 =
      sumFlow1 / sampleCount;

  float averageFlow2 =
      sumFlow2 / sampleCount;

  float averageTemperature1 =
      (validTemperatureSamples1 > 0)
      ? sumTemperature1 / validTemperatureSamples1
      : 25.0;

  float averageTemperature2 =
      (validTemperatureSamples2 > 0)
      ? sumTemperature2 / validTemperatureSamples2
      : 25.0;

  float averageTDSVoltage1 =
      sumTDSVoltage1 / sampleCount;

  float averageTDSVoltage2 =
      sumTDSVoltage2 / sampleCount;

  float averageTDS1 =
      sumTDS1 / sampleCount;

  float averageTDS2 =
      sumTDS2 / sampleCount;

  float averageTurbidityVoltage1 =
      sumTurbidityVoltage1 / sampleCount;

  float averageTurbidityVoltage2 =
      sumTurbidityVoltage2 / sampleCount;

  float averageTurbidity1 =
      sumTurbidity1 / sampleCount;

  float averageTurbidity2 =
      sumTurbidity2 / sampleCount;

  Serial.println();
  Serial.println("############################################################");
  Serial.println("                 10-SECOND AVERAGE");
  Serial.println("############################################################");

  Serial.println("SET 1");
  Serial.println("------------------------------------------------------------");

  Serial.printf(
      "Average Flow       : %.2f L/min\n",
      averageFlow1
  );

  Serial.printf(
      "Total Liters       : %.2f L\n",
      totalLiters1
  );

  Serial.printf(
      "Average Temperature: %.2f °C\n",
      averageTemperature1
  );

  Serial.printf(
      "Average TDS        : %.1f ppm\n",
      averageTDS1
  );

  Serial.printf(
      "Average Turbidity  : %.1f NTU\n",
      averageTurbidity1
  );

  Serial.println();
  Serial.println("SET 2");
  Serial.println("------------------------------------------------------------");

  Serial.printf(
      "Average Flow       : %.2f L/min\n",
      averageFlow2
  );

  Serial.printf(
      "Total Liters       : %.2f L\n",
      totalLiters2
  );

  Serial.printf(
      "Average Temperature: %.2f °C\n",
      averageTemperature2
  );

  Serial.printf(
      "Average TDS        : %.1f ppm\n",
      averageTDS2
  );

  Serial.printf(
      "Average Turbidity  : %.1f NTU\n",
      averageTurbidity2
  );

  Serial.println();
  Serial.printf(
      "Samples averaged   : %d\n",
      sampleCount
  );

  Serial.printf(
      "Flow pulses SET 1  : %lu\n",
      sumPulses1
  );

  Serial.printf(
      "Flow pulses SET 2  : %lu\n",
      sumPulses2
  );

  Serial.println("############################################################");

  // Send ONE database reading
  sendReadingToAPI(
      averageFlow1,
      averageFlow2,
      averageTemperature1,
      averageTemperature2,
      averageTDSVoltage1,
      averageTDSVoltage2,
      averageTDS1,
      averageTDS2,
      averageTurbidityVoltage1,
      averageTurbidityVoltage2,
      averageTurbidity1,
      averageTurbidity2,
      sumPulses1,
      sumPulses2
  );

  // Start a fresh 10-second window
  resetAverages();
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

  resetAverages();

  Serial.println();
  Serial.println("============================================================");
  Serial.println("              JALRAKSHAK WATER MONITORING");
  Serial.println("============================================================");

  Serial.print("DS18B20 sensors found: ");
  Serial.println(sensors.getDeviceCount());

  Serial.println("10-second averaging: ENABLED");

  Serial.println("============================================================");

  // Connect WiFi
  connectWiFi();

  Serial.println();
  Serial.println("System ready.");
  Serial.println("Collecting 10 samples before sending...");
  Serial.println("============================================================");
}

// ============================================================
//                  MAIN LOOP
// ============================================================

void loop()
{
  unsigned long currentMillis = millis();

  // Take one sensor sample approximately every second
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

    // Only average valid temperature readings
    if (temperature1 != DEVICE_DISCONNECTED_C)
    {
      sumTemperature1 += temperature1;
      validTemperatureSamples1++;
    }

    if (temperature2 != DEVICE_DISCONNECTED_C)
    {
      sumTemperature2 += temperature2;
      validTemperatureSamples2++;
    }

    // Temperature compensation for TDS
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
        readAverageVoltage(
            TDS_PIN_1,
            TDS_SAMPLES
        );

    float tdsVoltage2 =
        readAverageVoltage(
            TDS_PIN_2,
            TDS_SAMPLES
        );

    float tds1 =
        calculateTDS(
            tdsVoltage1,
            tempComp1
        );

    float tds2 =
        calculateTDS(
            tdsVoltage2,
            tempComp2
        );

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
    // ADD CURRENT SAMPLE TO 10-SECOND WINDOW
    // --------------------------------------------------------

    sampleCount++;

    // Flow
    sumFlow1 += flowRate1;
    sumFlow2 += flowRate2;

    // TDS
    sumTDS1 += tds1;
    sumTDS2 += tds2;

    sumTDSVoltage1 += tdsVoltage1;
    sumTDSVoltage2 += tdsVoltage2;

    // Turbidity
    sumTurbidity1 += turbidity1;
    sumTurbidity2 += turbidity2;

    sumTurbidityVoltage1 += turbidityVoltage1;
    sumTurbidityVoltage2 += turbidityVoltage2;

    // Flow pulses
    sumPulses1 += pulses1;
    sumPulses2 += pulses2;

    // --------------------------------------------------------
    // SHOW SAMPLE PROGRESS
    // --------------------------------------------------------

    Serial.println();
    Serial.println("------------------------------------------------------------");

    Serial.printf(
        "Sample %d / %d\n",
        sampleCount,
        AVERAGING_SAMPLES
    );

    Serial.printf(
        "Flow: %.2f / %.2f L/min\n",
        flowRate1,
        flowRate2
    );

    Serial.printf(
        "Temperature: %.2f / %.2f °C\n",
        temperature1,
        temperature2
    );

    Serial.printf(
        "TDS: %.1f / %.1f ppm\n",
        tds1,
        tds2
    );

    Serial.printf(
        "Turbidity: %.1f / %.1f NTU\n",
        turbidity1,
        turbidity2
    );

    Serial.println("------------------------------------------------------------");

    // --------------------------------------------------------
    // AFTER 10 SAMPLES
    // --------------------------------------------------------

    if (sampleCount >= AVERAGING_SAMPLES)
    {
      processAverage();
    }
  }
}