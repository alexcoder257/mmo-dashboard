export interface ITiktokDownloadRequest {
  url: string;
}

export interface ITiktokDownloadResponse {
  downloadUrl: string;
  duration: number;
  filename: string;
  title: string;
}
