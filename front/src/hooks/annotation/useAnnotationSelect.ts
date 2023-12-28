import { useCallback } from "react";
import { type RefObject } from "react";

import { type SoundEventAnnotation } from "@/api/schemas";
import { type SpectrogramWindow } from "@/api/spectrograms";
import drawGeometry from "@/draw/geometry";
import { WARNING } from "@/draw/styles";
import useHoveredAnnotation from "@/hooks/annotation/useHoveredAnnotation";
import useClick from "@/hooks/motions/useClick";
import { type MouseState } from "@/hooks/motions/useMouse";
import { scaleGeometryToViewport } from "@/utils/geometry";

import { type SelectAnnotationEvent } from "@/machines/annotate";

const SELECT_STYLE = {
  borderColor: WARNING,
  fillColor: WARNING,
  borderWidth: 2,
  fillAlpha: 0.2,
};

export default function useAnnotationSelect({
  ref,
  mouse,
  annotations,
  window,
  send,
  active,
}: {
  ref: RefObject<HTMLCanvasElement>;
  mouse: MouseState;
  annotations: SoundEventAnnotation[];
  window: SpectrogramWindow;
  send: (event: SelectAnnotationEvent | { type: "IDLE" }) => void;
  active: boolean;
}) {
  const hovered = useHoveredAnnotation({
    mouse,
    annotations,
    window,
    active,
  });

  const handleClick = useCallback(() => {
    if (!active) return;
    if (hovered == null) {
      send({ type: "IDLE" });
    } else {
      send({
        type: "SELECT_ANNOTATION",
        annotation: hovered,
      });
    }
  }, [hovered, active, send]);

  useClick({
    ref,
    onClick: handleClick,
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!active || hovered == null) return;

      ctx.canvas.style.cursor = "pointer";

      const geometry = scaleGeometryToViewport(
        { width: ctx.canvas.width, height: ctx.canvas.height },
        // @ts-ignore
        hovered.sound_event.geometry,
        window,
      );

      drawGeometry(ctx, geometry, SELECT_STYLE);
    },
    [window, hovered, active],
  );

  return draw;
}
