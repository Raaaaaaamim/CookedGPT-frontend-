export interface ApiKey {
  id: string;
  apiKey: string;
  type: "OPENROUTER" | "OPENAI" | "GEMINI";
  updatedAt: string;
  createdAt: string;
}
