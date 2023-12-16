"""Whombat REST API routes."""
from fastapi import APIRouter

from whombat.routes.annotation_projects import annotation_projects_router
from whombat.routes.annotation_tasks import annotation_tasks_router
from whombat.routes.audio import audio_router
from whombat.routes.auth import auth_router
from whombat.routes.clip_annotations import clip_annotations_router
from whombat.routes.clip_evaluations import clip_evaluations_router
from whombat.routes.clip_predictions import clip_predictions_router
from whombat.routes.clips import clips_router
from whombat.routes.datasets import dataset_router
from whombat.routes.evaluation_sets import evaluation_sets_router
from whombat.routes.features import features_router
from whombat.routes.model_runs import model_runs_router
from whombat.routes.notes import notes_router
from whombat.routes.plugins import plugin_router
from whombat.routes.recordings import recording_router
from whombat.routes.sound_event_annotations import (
    sound_event_annotations_router,
)
from whombat.routes.sound_event_evaluations import (
    sound_event_evaluations_router,
)
from whombat.routes.sound_event_predictions import (
    sound_event_predictions_router,
)
from whombat.routes.sound_events import sound_events_router
from whombat.routes.spectrograms import spectrograms_router
from whombat.routes.tags import tags_router
from whombat.routes.user_runs import user_runs_router
from whombat.routes.users import users_router

__all__ = [
    "main_router",
]


main_router = APIRouter(prefix="/api/v1")

# Admin
main_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)

# Descriptors
main_router.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)
main_router.include_router(
    tags_router,
    prefix="/tags",
    tags=["Tags"],
)
main_router.include_router(
    features_router,
    prefix="/features",
    tags=["Features"],
)
main_router.include_router(
    notes_router,
    prefix="/notes",
    tags=["Notes"],
)

# Audio Metadata
main_router.include_router(
    recording_router,
    prefix="/recordings",
    tags=["Recordings"],
)
main_router.include_router(
    dataset_router,
    prefix="/datasets",
    tags=["Datasets"],
)

# Audio Content
main_router.include_router(
    audio_router,
    prefix="/audio",
    tags=["Audio"],
)
main_router.include_router(
    spectrograms_router,
    prefix="/spectrograms",
    tags=["Spectrograms"],
)

# Acoustic Objects
main_router.include_router(
    sound_events_router,
    prefix="/sound_events",
    tags=["Sound Events"],
)
main_router.include_router(
    clips_router,
    prefix="/clips",
    tags=["Clips"],
)

# Annotation
main_router.include_router(
    sound_event_annotations_router,
    prefix="/sound_event_annotations",
    tags=["Sound Event Annotations"],
)
main_router.include_router(
    clip_annotations_router,
    prefix="/clip_annotations",
    tags=["Clip Annotations"],
)
main_router.include_router(
    annotation_tasks_router,
    prefix="/annotation_tasks",
    tags=["Annotation Tasks"],
)
main_router.include_router(
    annotation_projects_router,
    prefix="/annotation_projects",
    tags=["Annotation Projects"],
)

# Predictions
main_router.include_router(
    sound_event_predictions_router,
    prefix="/sound_event_predictions",
    tags=["Sound Event Predictions"],
)
main_router.include_router(
    clip_predictions_router,
    prefix="/clip_predictions",
    tags=["Clip Predictions"],
)
main_router.include_router(
    model_runs_router,
    prefix="/model_runs",
    tags=["Model Runs"],
)
main_router.include_router(
    user_runs_router,
    prefix="/user_runs",
    tags=["User Runs"],
)

# Evaluation
main_router.include_router(
    sound_event_evaluations_router,
    prefix="/sound_event_evaluations",
    tags=["Sound Event Evaluations"],
)
main_router.include_router(
    clip_evaluations_router,
    prefix="/clip_evaluations",
    tags=["Clip Evaluations"],
)
main_router.include_router(
    evaluation_sets_router,
    prefix="/evaluation_sets",
    tags=["Evaluation Sets"],
)

# Extensions
main_router.include_router(
    plugin_router,
    prefix="/plugins",
    tags=["Plugins"],
)