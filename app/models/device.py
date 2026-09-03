from datetime import datetime

from sqlalchemy import DateTime, Enum, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Device(Base):
    __tablename__ = "devices"

    device_id: Mapped[str] = mapped_column(
        String(100),
        primary_key=True,
    )

    device_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    device_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        server_default=text("'ESP32'"),
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    firmware_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        Enum(
            "ACTIVE",
            "INACTIVE",
            "MAINTENANCE",
            "ERROR",
            name="device_status",
            create_type=False,
        ),
        nullable=False,
        server_default=text("'ACTIVE'::device_status"),
    )

    installed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    last_seen_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("now()"),
    )