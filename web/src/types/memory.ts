export interface Memory {
  id: string;
  text: string;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
  eventDate: string; // ISO 8601 UTC — user-set or defaults to createdAt
  image?: string; // Firebase Storage URL
  people?: string[]; // free-text names
  tags?: string[]; // user-applied tags
  mood?: number; // numeric, maps to emoji in UI later
  audioUrl?: string; // voice recording URL
  transcript?: string; // transcription of audio
}
