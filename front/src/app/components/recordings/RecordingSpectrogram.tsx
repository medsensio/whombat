import Player from "@/app/components/audio/Player";
import Canvas from "@/app/components/spectrograms/Canvas";
import SettingsMenu from "@/app/components/spectrograms/SettingsMenu";
import ViewportBar from "@/app/components/spectrograms/ViewportBar";
import ViewportToolbar from "@/app/components/spectrograms/ViewportToolbar";
import useAudioSettings from "@/app/hooks/settings/useAudioSettings";
import useSpectrogramSettings from "@/app/hooks/settings/useSpectrogramSettings";
import RecordingSpectrogramBase from "@/lib/components/recordings/RecordingSpectrogram";
import useSpectrogramAudio from "@/lib/hooks/spectrogram/useSpectrogramAudio";
import useSpectrogramState from "@/lib/hooks/spectrogram/useSpectrogramState";
import useRecordingViewport from "@/lib/hooks/window/useRecordingViewport";
import type { Recording } from "@/lib/types";
import { useHotkeys } from "react-hotkeys-hook";

export default function RecordingSpectrogram({
  recording,
}: {
  recording: Recording;
}) {
  const state = useSpectrogramState();

  const audioSettings = useAudioSettings();

  const spectrogramSettings = useSpectrogramSettings();

  const viewport = useRecordingViewport({
    recording,
    spectrogramSettings: spectrogramSettings.settings,
  });

  const audio = useSpectrogramAudio({
    viewport,
    recording,
    audioSettings: audioSettings.settings,
  });

  useHotkeys("space", audio.togglePlay, {
    preventDefault: true,
    description: "Toggle playing",
  });

  useHotkeys("z", state.enableZooming, {
    description: "Enable spectrogram zooming",
  });

  useHotkeys("x", state.enablePanning, {
    description: "Enable spectrogram panning",
  });

  useHotkeys("b", viewport.back, {
    description: "Go back to previous view",
  });

  return (
    <RecordingSpectrogramBase
      ViewportToolbar={<ViewportToolbar state={state} viewport={viewport} />}
      Player={
        <Player
          audio={audio}
          samplerate={recording.samplerate}
          onChangeSpeed={(speed) =>
            audioSettings.dispatch({ type: "setSpeed", speed })
          }
        />
      }
      SettingsMenu={
        <SettingsMenu
          samplerate={recording.samplerate}
          audioSettings={audioSettings}
          spectrogramSettings={spectrogramSettings}
        />
      }
      ViewportBar={<ViewportBar viewport={viewport} />}
      Canvas={
        <Canvas
          audioSettings={audioSettings.settings}
          spectrogramSettings={spectrogramSettings.settings}
          state={state}
          recording={recording}
          audio={audio}
          viewport={viewport}
        />
      }
    />
  );
}
