import { useEffect, useMemo } from "react";

import useViewport from "@/lib/hooks/window/useViewport";

import { DEFAULT_SPECTROGRAM_SETTINGS } from "@/lib/constants";
import type { Clip, SpectrogramSettings } from "@/lib/types";
import { getInitialViewingWindow } from "@/lib/utils/windows";

export default function useClipViewport({
  clip,
  spectrogramSettings = DEFAULT_SPECTROGRAM_SETTINGS,
  audioSettings 
}: {
  clip: Clip;
  spectrogramSettings?: SpectrogramSettings;
  audioSettings: any; 
}) {
  const bounds = useMemo(
    () => ({
      time: { min: clip.start_time, max: clip.end_time },
      freq: {
        min: audioSettings.settings.low_freq ?? 0, 
        max: audioSettings.settings.high_freq ?? clip.recording.samplerate / 2, 
      },
    }),
    [clip.recording.samplerate, clip.start_time, clip.end_time, audioSettings.settings.low_freq, audioSettings.settings.high_freq],
  );

  const initial = useMemo(
    () =>
      getInitialViewingWindow({
        startTime: bounds.time.min,
        endTime: bounds.time.max,
        samplerate: clip.recording.samplerate,
        windowSize: spectrogramSettings.window_size,
        overlap: spectrogramSettings.overlap,
      }),
    [
      bounds,
      clip.recording.samplerate,
      spectrogramSettings.window_size,
      spectrogramSettings.overlap,
    ],
  );

  const viewport = useViewport({
    initial,
    bounds,
  });

  const { set: setViewport } = viewport;

  useEffect(() => {
    setViewport(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip.uuid, setViewport]);

  return viewport;
}
