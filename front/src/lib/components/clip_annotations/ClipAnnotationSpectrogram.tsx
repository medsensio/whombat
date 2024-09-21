import Card from "@/lib/components/ui/Card";
import { memo } from "react";

const ClipAnnotationSpectrogram = memo(
  function ClipAnnotationSpectrogram(props: {
    ViewportToolbar: JSX.Element;
    AnnotationControls: JSX.Element;
    Player: JSX.Element;
    SettingsMenu: JSX.Element;
    ViewportBar: JSX.Element;
    Canvas: JSX.Element;
    SelectedSoundEvent?: JSX.Element;
  }) {
    return (
      <Card>
        <div className="flex flex-row gap-4">
          {props.ViewportToolbar}
          {props.AnnotationControls}
          {props.Player}
          {props.SettingsMenu}
        </div>
        {props.Canvas}
        {props.ViewportBar}
        {props.SelectedSoundEvent}
      </Card>
    );
  },
);

export default ClipAnnotationSpectrogram;
