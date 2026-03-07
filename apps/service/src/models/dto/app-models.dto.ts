export class UpdateDefaultModelsDto {
  llm?: string;
  embedding?: string;
  tts?: string;
  stt?: string;
  rerank?: string;
  datasetTextLLM?: string;
  datasetImageLLM?: string;
}

export class ToggleActiveDto {
  model: string;
  isActive: boolean;
}
