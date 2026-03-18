export interface IAnalyzerResult {
  captions: string[];
  contentIdeas: string[];
  hashtags: string[];
  keyInsights: string[];
  summary: string;
  title: string;
}

export interface IAnalyzerUploadResponse {
  analysis: IAnalyzerResult;
  notionPageUrl: string;
}
