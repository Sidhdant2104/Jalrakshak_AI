from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    CheckConstraint,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class SensorCalibration(Base):
    __tablename__ = "sensor_calibrations"

    calibration_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    sensor_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("sensors.sensor_id", ondelete="CASCADE"),
        nullable=False,
    )

    calibration_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    calibration_factor: Mapped[float | None] = mapped_column(Float)
    calibration_offset: Mapped[float | None] = mapped_column(Float)
    reference_value: Mapped[float | None] = mapped_column(Float)

    calibration_notes: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )


class MeasurementFeature(Base):
    __tablename__ = "measurement_features"

    __table_args__ = (
        UniqueConstraint(
            "reading_id",
            name="measurement_features_reading_id_key",
        ),
        Index(
            "idx_features_device_time",
            "device_id",
            text("calculated_at DESC"),
        ),
    )

    feature_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    reading_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "sensor_readings.reading_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    device_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey(
            "devices.device_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    flow_difference_lpm: Mapped[float | None] = mapped_column(Float)
    flow_loss_percentage: Mapped[float | None] = mapped_column(Float)
    flow_ratio: Mapped[float | None] = mapped_column(Float)
    estimated_water_loss_liters: Mapped[float | None] = mapped_column(Float)

    temperature_difference_c: Mapped[float | None] = mapped_column(Float)

    tds_difference_ppm: Mapped[float | None] = mapped_column(Float)
    tds_change_percentage: Mapped[float | None] = mapped_column(Float)

    turbidity_difference_ntu: Mapped[float | None] = mapped_column(Float)
    turbidity_change_percentage: Mapped[float | None] = mapped_column(Float)

    flow_rate_change_lpm: Mapped[float | None] = mapped_column(Float)
    tds_rate_of_change: Mapped[float | None] = mapped_column(Float)
    turbidity_rate_of_change: Mapped[float | None] = mapped_column(Float)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )


class Anomaly(Base):
    __tablename__ = "anomalies"

    __table_args__ = (
        Index(
            "idx_anomalies_device_time",
            "device_id",
            text("detected_at DESC"),
        ),
    )

    anomaly_id: Mapped[int] = mapped_column(
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

    reading_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "sensor_readings.reading_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    anomaly_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    parameter: Mapped[str | None] = mapped_column(
        String(100)
    )

    observed_value: Mapped[float | None] = mapped_column(Float)
    expected_value: Mapped[float | None] = mapped_column(Float)
    anomaly_score: Mapped[float | None] = mapped_column(Float)

    severity: Mapped[str] = mapped_column(
        Enum(
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
            name="event_severity",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'MEDIUM'::event_severity"),
    )

    description: Mapped[str | None] = mapped_column(Text)

    resolved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )


class AIModel(Base):
    __tablename__ = "ai_models"

    __table_args__ = (
        UniqueConstraint(
            "model_name",
            "model_version",
            name="ai_models_model_name_model_version_key",
        ),
    )

    model_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    model_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    model_type: Mapped[str | None] = mapped_column(
        String(100)
    )

    purpose: Mapped[str | None] = mapped_column(
        String(150)
    )

    trained_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    training_data_start: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    training_data_end: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    accuracy: Mapped[float | None] = mapped_column(Float)
    precision_score: Mapped[float | None] = mapped_column(Float)
    recall_score: Mapped[float | None] = mapped_column(Float)
    f1_score: Mapped[float | None] = mapped_column(Float)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )


class DeviceHealth(Base):
    __tablename__ = "device_health"

    health_id: Mapped[int] = mapped_column(
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

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    wifi_rssi: Mapped[int | None] = mapped_column(Integer)
    uptime_seconds: Mapped[int | None] = mapped_column(BigInteger)
    free_heap_bytes: Mapped[int | None] = mapped_column(BigInteger)
    device_temperature_c: Mapped[float | None] = mapped_column(Float)

    firmware_version: Mapped[str | None] = mapped_column(
        String(50)
    )

    overall_status: Mapped[str | None] = mapped_column(
        String(50)
    )

    notes: Mapped[str | None] = mapped_column(Text)


class WaterQualityEvent(Base):
    __tablename__ = "water_quality_events"

    __table_args__ = (
        Index(
            "idx_quality_events_device_time",
            "device_id",
            text("detected_at DESC"),
        ),
    )

    water_quality_event_id: Mapped[int] = mapped_column(
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

    reading_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "sensor_readings.reading_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    parameter: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    inlet_value: Mapped[float | None] = mapped_column(Float)
    outlet_value: Mapped[float | None] = mapped_column(Float)
    difference: Mapped[float | None] = mapped_column(Float)
    change_percentage: Mapped[float | None] = mapped_column(Float)

    severity: Mapped[str] = mapped_column(
        Enum(
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
            name="event_severity",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'MEDIUM'::event_severity"),
    )

    confidence: Mapped[float | None] = mapped_column(Float)

    detection_method: Mapped[str | None] = mapped_column(
        String(100)
    )

    description: Mapped[str | None] = mapped_column(Text)


class Alert(Base):
    __tablename__ = "alerts"

    __table_args__ = (
        Index(
            "idx_alerts_device_status",
            "device_id",
            "status",
        ),
    )

    alert_id: Mapped[int] = mapped_column(
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

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    alert_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        Enum(
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
            name="event_severity",
            create_type=False,
        ),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    message: Mapped[str | None] = mapped_column(Text)

    source: Mapped[str | None] = mapped_column(
        String(100)
    )

    status: Mapped[str] = mapped_column(
        Enum(
            "ACTIVE",
            "ACKNOWLEDGED",
            "RESOLVED",
            name="alert_status",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'ACTIVE'::alert_status"),
    )

    acknowledged_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    __table_args__ = (
        Index(
            "idx_predictions_device_time",
            "device_id",
            text("predicted_at DESC"),
        ),
    )

    prediction_id: Mapped[int] = mapped_column(
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

    model_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "ai_models.model_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    reading_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "sensor_readings.reading_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    predicted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    prediction_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    prediction: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    confidence: Mapped[float | None] = mapped_column(Float)
    probability: Mapped[float | None] = mapped_column(Float)

    explanation: Mapped[str | None] = mapped_column(Text)

    input_window_start: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    input_window_end: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )


class LeakEvent(Base):
    __tablename__ = "leak_events"

    __table_args__ = (
        Index(
            "idx_leak_events_device_time",
            "device_id",
            text("start_time DESC"),
        ),
    )

    leak_event_id: Mapped[int] = mapped_column(
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

    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    end_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    duration_seconds: Mapped[float | None] = mapped_column(Float)

    average_flow_difference_lpm: Mapped[float | None] = mapped_column(Float)

    maximum_flow_difference_lpm: Mapped[float | None] = mapped_column(Float)

    average_loss_percentage: Mapped[float | None] = mapped_column(Float)

    estimated_water_loss_liters: Mapped[float | None] = mapped_column(Float)

    severity: Mapped[str] = mapped_column(
        Enum(
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
            name="event_severity",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'MEDIUM'::event_severity"),
    )

    confidence: Mapped[float | None] = mapped_column(Float)

    detection_method: Mapped[str | None] = mapped_column(
        String(100)
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'OPEN'"),
    )

    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )