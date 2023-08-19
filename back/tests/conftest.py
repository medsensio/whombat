"""Common fixtures for Whombat tests.""" ""
import logging
import os
import random
import string
from collections.abc import Callable
from pathlib import Path
from typing import AsyncGenerator, Optional

import numpy as np
import pytest
from scipy.io import wavfile
from sqlalchemy.ext.asyncio import AsyncSession

from whombat import api, cache, schemas
from whombat.database import models

# Avoid noisy logging during tests.
logging.getLogger("aiosqlite").setLevel(logging.WARNING)
logging.getLogger("asyncio").setLevel(logging.WARNING)
logging.getLogger("passlib").setLevel(logging.WARNING)


@pytest.fixture(autouse=True)
async def clear_cache():
    """Clear the cache before each test."""
    yield
    cache.clear_all_caches()


def random_string():
    """Generate a random string of fixed length."""
    options = string.ascii_uppercase + string.digits
    return "".join(random.choice(options) for _ in range(10))


def write_random_wav(
    path: Path,
    samplerate: int = 22100,
    duration: float = 0.1,
    channels: int = 1,
) -> None:
    """Write a random wav file to disk."""
    frames = int(samplerate * duration)
    shape = (frames, channels)
    wav = np.random.random(size=shape).astype(np.float32)
    wavfile.write(path, samplerate, wav)


@pytest.fixture
def random_wav_factory(tmp_path: Path):
    """Produce a random wav file."""

    def wav_factory(
        path: Optional[Path] = None,
        samplerate: int = 22100,
        duration: float = 0.1,
        channels: int = 1,
    ) -> Path:
        if path is None:
            path = tmp_path / (random_string() + ".wav")

        dirname = os.path.dirname(path)
        if not os.path.exists(dirname):
            os.makedirs(dirname)

        write_random_wav(
            path=path,
            samplerate=samplerate,
            duration=duration,
            channels=channels,
        )

        return path

    return wav_factory


@pytest.fixture
async def session() -> AsyncGenerator[AsyncSession, None]:
    """Create a session that uses an in-memory database."""
    async with api.sessions.create_session() as sess:
        yield sess


@pytest.fixture
async def user(session: AsyncSession) -> schemas.User:
    """Create a user for tests."""
    user = await api.users.create_user(
        session,
        data=schemas.UserCreate(
            username="test",
            password="test",
            email="test@whombat.com",
        ),
    )
    return user


@pytest.fixture
async def recording(
    session: AsyncSession,
    random_wav_factory: Callable[..., Path],
) -> schemas.Recording:
    """Create a recording for testing."""
    recording = await api.recordings.create_recording(
        session,
        data=schemas.RecordingCreate(path=random_wav_factory()),
    )
    return recording


@pytest.fixture
async def tag(session: AsyncSession) -> schemas.Tag:
    """Create a tag for testing."""
    tag = await api.tags.create_tag(
        session,
        data=schemas.TagCreate(key="test_key", value="test_value"),
    )
    return tag


@pytest.fixture
async def feature_name(session: AsyncSession) -> schemas.FeatureName:
    """Create a feature for testing."""
    feature_name = await api.features.create_feature_name(
        session, data=schemas.FeatureNameCreate(name="test_feature")
    )
    return feature_name


@pytest.fixture
async def note(session: AsyncSession, user: schemas.User) -> schemas.Note:
    """Create a note for testing."""
    note = await api.notes.create_note(
        session,
        data=schemas.NoteCreate(
            message="test_message",
            created_by_id=user.id,
        ),
    )
    return note


@pytest.fixture
async def clip(
    session: AsyncSession,
    recording: schemas.Recording,
) -> schemas.Clip:
    """Create a clip for testing."""
    return await api.clips.create_clip(
        session,
        data=schemas.ClipCreate(
            recording_id=recording.id,
            start_time=0.1,
            end_time=0.2,
        ),
    )


@pytest.fixture
async def dataset(session: AsyncSession, tmp_path: Path) -> schemas.Dataset:
    """Create a dataset for testing."""
    dataset_dir = tmp_path / "test_dataset"
    audio_dir = dataset_dir / "audio"
    audio_dir.mkdir(parents=True)

    dataset, _ = await api.datasets.create_dataset(
        session,
        data=schemas.DatasetCreate(
            name="test_dataset",
            description="test_description",
            audio_dir=audio_dir,
        ),
    )
    return dataset


@pytest.fixture
async def annotation_project(
    session: AsyncSession, tmp_path: Path
) -> schemas.AnnotationProject:
    """Create an annotation project for testing."""
    annotation_project_dir = tmp_path / "test_annotation_project"
    annotation_project_dir.mkdir(parents=True)
    annotation_project = (
        await api.annotation_projects.create_annotation_project(
            session,
            data=schemas.AnnotationProjectCreate(
                name="test_annotation_project",
                description="test_description",
                annotation_instructions="test_instructions",
            ),
        )
    )
    return annotation_project


@pytest.fixture
async def task(
    session: AsyncSession,
    annotation_project: schemas.AnnotationProject,
    clip: schemas.Clip,
) -> schemas.Task:
    """Create a task for testing."""
    task = await api.tasks.create_task(
        session,
        data=schemas.TaskCreate(
            project_id=annotation_project.id,
            clip_id=clip.id,
        ),
    )
    return task


@pytest.fixture
async def task_status_badge(
    session: AsyncSession,
    task: schemas.Task,
    user: schemas.User,
) -> schemas.TaskStatusBadge:
    """Create a task status badge for testing."""
    task = await api.tasks.add_status_badge_to_task(
        session,
        task_id=task.id,
        user_id=user.id,
        state=models.TaskState.assigned,
    )
    task_status_badge = next(
        badge
        for badge in task.status_badges
        if badge.user_id == user.id
        and badge.state == models.TaskState.assigned
    )
    return task_status_badge



@pytest.fixture
async def task_tag(
    session: AsyncSession,
    task: schemas.Task,
    tag: schemas.Tag,
    user: schemas.User,
) -> schemas.TaskTag:
    """Create a task tag for testing."""
    task = await api.tasks.add_tag_to_task(
        session,
        task_id=task.id,
        tag_id=tag.id,
        created_by_id=user.id,
    )
    task_tag = next(
        tag
        for tag in task.tags
        if tag.tag_id == tag.id
        and tag.created_by_id == user.id
    )
    return task_tag
