from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sensor import SensorReading
from app.schemas.sensor import SensorReadingCreate, SensorReadingResponse


router = APIRouter(
    prefix="/api/v1/readings",
    tags=["Sensor Readings"],
)


@router.post(
    "",
    response_model=SensorReadingResponse,
)
def create_reading(
    reading: SensorReadingCreate,
    db: Session = Depends(get_db),
):
    # Make sure the device exists
    from sqlalchemy import text

    device_exists = db.execute(
        text(
            "SELECT 1 FROM devices WHERE device_id = :device_id"
        ),
        {"device_id": reading.device_id},
    ).first()

    if not device_exists:
        raise HTTPException(
            status_code=404,
            detail=f"Device '{reading.device_id}' not found",
        )

    now = datetime.now(timezone.utc)

    db_reading = SensorReading(
        device_id=reading.device_id,
        measured_at=reading.measured_at,
        received_at=now,
        device_uptime_ms=reading.device_uptime_ms,

        flow_1_lpm=reading.flow_1_lpm,
        flow_2_lpm=reading.flow_2_lpm,

        total_liters_1=reading.total_liters_1,
        total_liters_2=reading.total_liters_2,

        flow_pulses_1=reading.flow_pulses_1,
        flow_pulses_2=reading.flow_pulses_2,

        temperature_1_c=reading.temperature_1_c,
        temperature_2_c=reading.temperature_2_c,

        temperature_1_status=reading.temperature_1_status,
        temperature_2_status=reading.temperature_2_status,

        tds_1_ppm=reading.tds_1_ppm,
        tds_2_ppm=reading.tds_2_ppm,

        tds_voltage_1_v=reading.tds_voltage_1_v,
        tds_voltage_2_v=reading.tds_voltage_2_v,

        turbidity_1_ntu=reading.turbidity_1_ntu,
        turbidity_2_ntu=reading.turbidity_2_ntu,

        turbidity_voltage_1_v=reading.turbidity_voltage_1_v,
        turbidity_voltage_2_v=reading.turbidity_voltage_2_v,

        quality=reading.quality,
        created_at=now,
    )

    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    return db_reading