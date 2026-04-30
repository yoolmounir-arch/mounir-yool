export type Level = 'A2' | 'B1';
export type ContentType = 'Story' | 'Article' | 'Dialogue' | 'Daily Life Text';

export interface VocabularyItem {
  german: string;
  arabicMeaning: string;
  exampleGerman: string;
  exampleArabic: string;
}

export interface GeneratedContent {
  title: string;
  level: Level;
  contentType: ContentType;
  topic: string;
  germanText: string;
  arabicTranslation: string;
  vocabulary: VocabularyItem[];
  createdAt: number;
  id: string;
}
