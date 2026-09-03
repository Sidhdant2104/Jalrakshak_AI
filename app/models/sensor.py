from datetime import datetime

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    __table_args__ = (
        # Indexes
        Index(
            "idx_sensor_readings_device_time",
            "device_id",
            text("received_at DESC"),
        ),
        Index(
            "idx_sensor_readings_measured_time",
            text("measured_at DESC"),
        ),

        # Check constraints
        CheckConstraint(
            "flow_1_lpm IS NULL OR flow_1_lpm >= 0::double precision",
            name="sensor_readings_flow_1_lpm_check",
        ),
        CheckConstraint(
            "flow_2_lpm IS NULL OR flow_2_lpm >= 0::double precision",
            name="sensor_readings_flow_2_lpm_check",
        ),
        CheckConstraint(
            "tds_1_ppm IS NULL OR tds_1_ppm >= 0::double precision",
            name="sensor_readings_tds_1_ppm_check",
        ),
        CheckConstraint(
            "tds_2_ppm IS NULL OR tds_2_ppm >= 0::double precision",
            name="sensor_readings_tds_2_ppm_check",
        ),
        CheckConstraint(
            "total_liters_1 IS NULL OR total_liters_1 >= 0::double precision",
            name="sensor_readings_total_liters_1_check",
        ),
        CheckConstraint(
            "total_liters_2 IS NULL OR total_liters_2 >= 0::double precision",
            name="sensor_readings_total_liters_2_check",
        ),
        CheckConstraint(
            "turbidity_1_ntu IS NULL OR turbidity_1_ntu >= 0::double precision",
            name="sensor_readings_turbidity_1_ntu_check",
        ),
        CheckConstraint(
            "turbidity_2_ntu IS NULL OR turbidity_2_ntu >= 0::double precision",
            name="sensor_readings_turbidity_2_ntu_check",
        ),
    )

    reading_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    device_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey(
            "devices.device_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    measured_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    device_uptime_ms: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    # Flow
    flow_1_lpm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    flow_2_lpm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    total_liters_1: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    total_liters_2: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    flow_pulses_1: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    flow_pulses_2: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # Temperature
    temperature_1_c: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    temperature_2_c: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    temperature_1_status: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    temperature_2_status: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # TDS
    tds_1_ppm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    tds_2_ppm: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    tds_voltage_1_v: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    tds_voltage_2_v: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # Turbidity
    turbidity_1_ntu: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    turbidity_2_ntu: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    turbidity_voltage_1_v: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    turbidity_voltage_2_v: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # Overall quality
    quality: Mapped[str] = mapped_column(
        Enum(
            "VALID",
            "INVALID",
            "MISSING",
            "OUT_OF_RANGE",
            "SENSOR_ERROR",
            "FALLBACK",
            name="reading_quality",
            create_type=False,
        ),
        nullable=False,
        default="VALID",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )


class Sensor(Base):
    __tablename__ = "sensors"

    __table_args__ = (
        UniqueConstraint(
            "device_id",
            "sensor_code",
            name="sensors_device_id_sensor_code_key",
        ),
    )

    sensor_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    device_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey(
            "devices.device_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    sensor_code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    sensor_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    sensor_model: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    position: Mapped[str] = mapped_column(
        Enum(
            "INLET",
            "OUTLET",
            "OTHER",
            name="sensor_position",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'OTHER'::sensor_position"),
    )

    gpio_pin: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    unit: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        Enum(
            "ACTIVE",
            "INACTIVE",
            "ERROR",
            "CALIBRATION_REQUIRED",
            name="sensor_status",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'ACTIVE'::sensor_status"),
    )

    installed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )