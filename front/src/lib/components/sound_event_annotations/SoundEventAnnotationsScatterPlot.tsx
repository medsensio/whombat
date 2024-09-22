import api from "@/app/api";
import useSoundEventAnnotation from "@/app/hooks/api/useSoundEventAnnotation";
import type { ScatterPlotData } from "@/lib/api/sound_event_annotations";
import Empty from "@/lib/components/Empty";
import SoundEventAnnotationSpectrogram from "@/lib/components/sound_event_annotations/SoundEventAnnotationSpectrogram";
import Card from "@/lib/components/ui/Card";
import Loading from "@/lib/components/ui/Loading";
import useScatterPlot from "@/lib/hooks/useScatterPlot";
import usePagedQuery from "@/lib/hooks/utils/usePagedQuery";
import type {
  SoundEventAnnotationFilter,
  SpectrogramParameters,
} from "@/lib/types";
import { useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { useMount } from "react-use";

export default function AnnotationsScatterPlot(props: {
  filter: SoundEventAnnotationFilter;
  parameters?: SpectrogramParameters;
  onParametersSave?: (parameters: SpectrogramParameters) => void;
}) {
  const { items, query } = usePagedQuery<
    ScatterPlotData,
    SoundEventAnnotationFilter
  >({
    name: "sound_event_annotations_scatter",
    queryFn: api.soundEventAnnotations.getScatterPlotData,
    pageSize: 1000,
    filter: props.filter,
  });

  const annotations = useMemo(() => items || [], [items]);

  const [selectedAnnotation, setSelectedAnnotation] =
    useState<ScatterPlotData | null>(null);

  if (query.isFetching) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <ScatterPlot
          annotations={annotations}
          onSelect={setSelectedAnnotation}
        />
      </div>
      <Card>
        {selectedAnnotation == null ? (
          <Empty>
            <p>Select a sound event to view its spectrogram.</p>
          </Empty>
        ) : (
          <Spectrogram
            parameters={props.parameters}
            onParametersSave={props.onParametersSave}
            annotation={selectedAnnotation}
          />
        )}
      </Card>
    </div>
  );
}

function groupBySpecies(data: ScatterPlotData) {
  return data.tags?.find((tag) => tag.key === "Species")?.value || "unknown";
}

function ScatterPlot({
  annotations,
  onSelect,
}: {
  annotations: ScatterPlotData[];
  onSelect?: (annotation: ScatterPlotData) => void;
}) {
  useMount(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const { data, layout, onClick } = useScatterPlot({
    annotations,
    onClick: onSelect,
    groupBy: groupBySpecies,
  });

  return (
    <Plot
      className="overflow-hidden w-full h-96 rounded-lg"
      data={data}
      layout={layout}
      onClick={onClick}
      useResizeHandler={true}
      config={{
        responsive: true,
      }}
    />
  );
}

function Spectrogram(props: {
  annotation: ScatterPlotData;
  parameters?: SpectrogramParameters;
  onParametersSave?: (parameters: SpectrogramParameters) => void;
}) {
  const {
    isLoading,
    data: soundEventAnnotation,
    recording: { isLoading: isLoadingRecording, data: recording },
  } = useSoundEventAnnotation({
    uuid: props.annotation.uuid,
    withRecording: true,
  });

  if (isLoading || isLoadingRecording) {
    return <Loading />;
  }

  if (soundEventAnnotation == null || recording == null) {
    return <Empty>Annotation not found</Empty>;
  }

  return (
    <SoundEventAnnotationSpectrogram
      recording={recording}
      soundEventAnnotation={soundEventAnnotation}
      parameters={props.parameters}
      onParametersSave={props.onParametersSave}
      height={300}
      withBar={false}
    />
  );
}
