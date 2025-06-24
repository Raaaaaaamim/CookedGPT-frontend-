// interfaces/Model.ts

export enum PERFORMANCE {
  AVERAGE = "AVERAGE",
  GOOD = "GOOD",
  EXCELLENT = "EXCELLENT",
}

export enum MODEL_TYPE {
  OPENAI = "OPENAI",
  OPENROUTER = "OPENROUTER",
  GEMINI = "GEMINI",
}

export interface Model {
  id: string;
  name: string;
  performance: PERFORMANCE;
  type: MODEL_TYPE;
  pro: boolean;
  speed: number;
  accuracy: number;
}

export interface ModelSelectorProps {
  model: Model;
  isSelected: boolean;
  onPress: (model: Model) => void;
}
