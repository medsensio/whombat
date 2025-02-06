import { useMemo } from "react";

import useViewport from "@/lib/hooks/window/useViewport";

import { DEFAULT_SPECTROGRAM_SETTINGS } from "@/lib/constants";
import type { Recording, SpectrogramSettings } from "@/lib/types";
import { getInitialViewingWindow } from "@/lib/utils/windows";

export default function useRecordingViewport({
  recording,
  startTime = 0,
  endTime,
  spectrogramSettings = DEFAULT_SPECTROGRAM_SETTINGS,
  audioSettings 
}: {
  recording: Recording;
  startTime?: number;
  endTime?: number;
  spectrogramSettings?: SpectrogramSettings;
  audioSettings: any; 
}) {
  const bounds = useMemo(
    () => ({
      time: { min: startTime, max: endTime || recording.duration },
      freq: {
        min: audioSettings.settings.low_freq ?? 0, 
        max: audioSettings.settings.high_freq ?? recording.samplerate / 2, 
      },
    }),
    [recording.duration, recording.samplerate, startTime, endTime, audioSettings.settings.low_freq, audioSettings.settings.high_freq] 
  );

  const initial = getInitialViewingWindow({
    startTime: bounds.time.min,
    endTime: bounds.time.max,
    samplerate: recording.samplerate,
    windowSize: spectrogramSettings.window_size,
    overlap: spectrogramSettings.overlap,
  });

  const viewport = useViewport({
    initial,
    bounds,
  });

  return viewport;
}
