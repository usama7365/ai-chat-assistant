export interface Document {
  id: string;
  content: string;
  embedding?: number[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}