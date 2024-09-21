import { DatasetSchema, RecordingStateSchema } from "@/lib/schemas";
import type { Dataset, RecordingState } from "@/lib/types";
import { AxiosInstance } from "axios";
import { z } from "zod";

import { GetManySchema, Page, downloadContent } from "./common";

export function registerDatasetAPI({
  instance,
  endpoints = DEFAULT_ENDPOINTS,
}: {
  instance: AxiosInstance;
  endpoints?: typeof DEFAULT_ENDPOINTS;
}) {
  async function getMany(query: GetDatasetsQuery): Promise<DatasetPage> {
    const params = GetDatasetsQuerySchema.parse(query);
    const { data } = await instance.get(endpoints.getMany, { params });
    return DatasetPageSchema.parse(data);
  }

  async function create(data: DatasetCreate): Promise<Dataset> {
    const body = DatasetCreateSchema.parse(data);
    const { data: res } = await instance.post(endpoints.create, body);
    return DatasetSchema.parse(res);
  }

  async function get(uuid: string): Promise<Dataset> {
    const { data } = await instance.get(endpoints.get, {
      params: { dataset_uuid: uuid },
    });
    return DatasetSchema.parse(data);
  }

  async function getDatasetState(uuid: string): Promise<RecordingState[]> {
    const { data } = await instance.get(endpoints.state, {
      params: { dataset_uuid: uuid },
    });
    return z.array(RecordingStateSchema).parse(data);
  }

  async function updateDataset(
    dataset: Dataset,
    data: DatasetUpdate,
  ): Promise<Dataset> {
    const body = DatasetUpdateSchema.parse(data);
    const { data: res } = await instance.patch(endpoints.update, body, {
      params: { dataset_uuid: dataset.uuid },
    });
    return DatasetSchema.parse(res);
  }

  async function deleteDataset(dataset: Dataset): Promise<Dataset> {
    const { data } = await instance.delete(endpoints.delete, {
      params: { dataset_uuid: dataset.uuid },
    });
    return DatasetSchema.parse(data);
  }

  async function downloadDataset(uuid: string, format: "json" | "csv") {
    let endpoint =
      format === "csv" ? endpoints.downloadCsv : endpoints.downloadJson;
    const { data } = await instance.get(endpoint, {
      params: { dataset_uuid: uuid },
    });
    let filetype = format === "csv" ? "text/csv" : "application/json";
    downloadContent(data, `${uuid}.${format}`, filetype);
  }

  async function importDataset(data: DatasetImport): Promise<Dataset> {
    const formData = new FormData();
    const file = data.dataset[0];
    formData.append("dataset", file);
    formData.append("audio_dir", data.audio_dir);
    const { data: res } = await instance.post(endpoints.import, formData);
    return DatasetSchema.parse(res);
  }

  return {
    getMany,
    create,
    get,
    getState: getDatasetState,
    update: updateDataset,
    delete: deleteDataset,
    download: downloadDataset,
    import: importDataset,
  } as const;
}

export const DatasetFilterSchema = z.object({
  search: z.string().optional(),
});

export type DatasetFilter = z.input<typeof DatasetFilterSchema>;

export const DatasetCreateSchema = z.object({
  uuid: z.string().uuid().optional(),
  name: z.string().min(1),
  audio_dir: z.string(),
  description: z.string().optional(),
});

export type DatasetCreate = z.input<typeof DatasetCreateSchema>;

export const DatasetUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export type DatasetUpdate = z.input<typeof DatasetUpdateSchema>;

export const DatasetPageSchema = Page(DatasetSchema);

export type DatasetPage = z.infer<typeof DatasetPageSchema>;

export const GetDatasetsQuerySchema = z.intersection(
  GetManySchema,
  DatasetFilterSchema,
);

export type GetDatasetsQuery = z.input<typeof GetDatasetsQuerySchema>;

export const DatasetImportSchema = z.object({
  dataset: z.instanceof(FileList),
  audio_dir: z.string(),
});

export type DatasetImport = z.infer<typeof DatasetImportSchema>;

const DEFAULT_ENDPOINTS = {
  getMany: "/api/v1/datasets/",
  create: "/api/v1/datasets/",
  state: "/api/v1/datasets/detail/state/",
  get: "/api/v1/datasets/detail/",
  update: "/api/v1/datasets/detail/",
  delete: "/api/v1/datasets/detail/",
  downloadJson: "/api/v1/datasets/detail/download/json/",
  downloadCsv: "/api/v1/datasets/detail/download/csv/",
  import: "/api/v1/datasets/import/",
};
