from datetime import datetime

from pydantic import BaseModel, Field


class SensorReadingCreate(BaseModel):
    """
    Data received from the ESP32.
    """

    device_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    measured_at: datetime | None = None

    device_uptime_ms: int | None = Field(
        default=None,
        ge=0,
    )

    # Flow
    flow_1_lpm: float | None = Field(
        default=None,
        ge=0,
    )

    flow_2_lpm: float | None = Field(
        default=None,
        ge=0,
    )

    total_liters_1: float | None = Field(
        default=None,
        ge=0,
    )

    total_liters_2: float | None = Field(
        default=None,
        ge=0,
    )

    flow_pulses_1: int | None = Field(
        default=None,
        ge=0,
    )

    flow_pulses_2: int | None = Field(
        default=None,
        ge=0,
    )

    # Temperature
    temperature_1_c: float | None = None
    temperature_2_c: float | None = None

    temperature_1_status: str | None = None
    temperature_2_status: str | None = None

    # TDS
    tds_1_ppm: float | None = Field(
        default=None,
        ge=0,
    )

    tds_2_ppm: float | None = Field(
        default=None,
        ge=0,
    )

    tds_voltage_1_v: float | None = None
    tds_voltage_2_v: float | None = None

    # Turbidity
    turbidity_1_ntu: float | None = Field(
        default=None,
        ge=0,
    )

    turbidity_2_ntu: float | None = Field(
        default=None,
        ge=0,
    )

    turbidity_voltage_1_v: float | None = None
    turbidity_voltage_2_v: float | None = None

    # Overall quality
    quality: str = "VALID"


class SensorReadingResponse(BaseModel):
    """
    Response returned after storing a reading.
    """

    reading_id: int
    device_id: str
    measured_at: datetime | None
    received_at: datetime
    quality: str

    model_config = {
        "from_attributes": True
    }