import { useCallback } from "react";

import { type SoundEventAnnotation } from "@/api/schemas";
import { type SpectrogramWindow } from "@/api/spectrograms";
import drawGeometry from "@/draw/geometry";
import { SECONDARY } from "@/draw/styles";
import { scaleGeometryToViewport } from "@/utils/geometry";

const IDLE_STYLE = {
  borderColor: SECONDARY,
  fillColor: SECONDARY,
  borderWidth: 2,
  fillAlpha: 0.1,
};

export default function useAnnotationDraw({
  window,
  annotations,
}: {
  window: SpectrogramWindow;
  annotations: SoundEventAnnotation[];
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      for (const item of annotations) {
        const geometry = scaleGeometryToViewport(
          { width: ctx.canvas.width, height: ctx.canvas.height },
          // @ts-ignore
          item.sound_event.geometry,
          window,
        );
        drawGeometry(ctx, geometry, IDLE_STYLE);
      }
    },
    [window, annotations],
  );

  return draw;
}
