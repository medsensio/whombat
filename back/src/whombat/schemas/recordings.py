"""Schemas for handling Recordings."""

import datetime
from pathlib import Path
from uuid import UUID
import urllib.parse

from pydantic import BaseModel, Field, FilePath, field_validator

from whombat.core import files
from whombat.schemas.base import BaseSchema
from whombat.schemas.features import Feature
from whombat.schemas.notes import Note
from whombat.schemas.tags import Tag
from whombat.schemas.users import SimpleUser
from whombat.system import get_settings

__all__ = [
    "Recording",
    "RecordingCreate",
    "RecordingUpdate",
    "RecordingTag",
    "RecordingNote",
]

use_s3 = get_settings().use_s3

class RecordingCreate(BaseModel):
    """Data for Recording creation."""

    date: datetime.date | None = None
    """The date of the recording."""

    time: datetime.time | None = None
    """The time of the recording."""

    latitude: float | None = Field(default=None, ge=-90, le=90)
    """The latitude of the recording."""

    longitude: float | None = Field(default=None, ge=-180, le=180)
    """The longitude of the recording."""

    time_expansion: float = Field(default=1.0, gt=0)
    """The time expansion factor of the recording."""

    rights: str | None = None
    """A text describing the usage rights of the recording."""

    path: str | FilePath
    """The path to the audio file. Could be a local file path or an S3 key."""
    
    @field_validator("path")
    def is_an_audio_file(cls, v):
        """Validate that the given path is an audio file."""

        if use_s3:
            # Validate the S3 path (ensure it doesn't include the 's3://' prefix)
            # if v.startswith("s3://"):
            #     raise ValueError("S3 path should not include the 's3://' prefix.")

            # Ensure the path ends with .wav for audio validation
            if not v.endswith(".wav"):
                raise ValueError("S3 file path does not point to a valid .wav audio file.")
        else:
            # For local file paths, check if the file exists and is an audio file
            if not isinstance(v, FilePath):
                raise ValueError("Path must be a valid local file path.")
            if not files.is_audio_file(v):
                raise ValueError("Local file path does not point to a valid audio file.")

        return v

class Recording(BaseSchema):
    """Schema for Recording objects returned to the user."""

    uuid: UUID
    """The UUID of the recording."""

    id: int = Field(..., exclude=True)
    """The database id of the recording."""

    path: Path
    """The path to the audio file, relative to the audio directory."""

    date: datetime.date | None
    """The date of the recording."""

    time: datetime.time | None
    """The time of the recording."""

    latitude: float | None
    """The latitude of the recording."""

    longitude: float | None
    """The longitude of the recording."""

    time_expansion: float
    """The time expansion factor of the recording."""

    hash: str
    """The md5 hash of the audio file."""

    duration: float
    """The duration of the audio file in seconds.

    This is the duration of the original audio file, not the time
    expanded version. This can vary depending on the time expansion
    factor. If the stored file has a duration of 10 seconds and a time
    expansion factor is 2, this means that the original recording was 5
    seconds long. So the duration of the original recording is 5
    seconds, not 10.
    """

    channels: int
    """The number of channels in the audio file."""

    samplerate: int
    """The sample rate of the audio file in Hz.

    This is the sample rate of the original audio file, not the time
    expanded version. This can vary depending on the time expansion
    factor. If the stored file has a sample rate of 44100 Hz and a time
    expansion factor is 2, this means that the original recording had a
    sample rate of 88200 Hz. So the sample rate of the original
    recording is 88200 Hz, not 44100 Hz.
    """

    rights: str | None
    """A text describing the usage rights of the recording."""

    tags: list[Tag] = Field(default_factory=list)
    """The tags associated with the recording."""

    features: list[Feature] = Field(default_factory=list)
    """The features associated with the recording."""

    notes: list[Note] = Field(default_factory=list)
    """The notes associated with the recording."""

    owners: list[SimpleUser] = Field(default_factory=list)
    """The users that own the recording."""


class RecordingUpdate(BaseModel):
    """Schema for Recording objects updated by the user."""

    date: datetime.date | None = None
    """The date of the recording."""

    time: datetime.time | None = None
    """The time of the recording."""

    latitude: float | None = Field(default=None, ge=-90, le=90)
    """The latitude of the recording."""

    longitude: float | None = Field(default=None, ge=-180, le=180)
    """The longitude of the recording."""

    path: FilePath | None = None
    """New path to the audio file."""

    time_expansion: float | None = Field(default=None, gt=0)
    """New time expansion factor of the recording."""

    rights: str | None = None
    """A text describing the usage rights of the recording."""


class RecordingTag(BaseSchema):
    """Schema for RecordingTag objects."""

    recording_uuid: UUID
    """The UUID of the recording."""

    tag: Tag
    """The tag associated with the recording."""


class RecordingNote(BaseSchema):
    """Schema for RecordingNote objects."""

    recording_uuid: UUID

    note: Note
