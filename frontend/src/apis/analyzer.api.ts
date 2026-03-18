import type { IAnalyzerUploadResponse } from '@/models/interfaces/analyzer.interface';

import { ANALYZER_API } from '@/constants/route-apis.const';
import { convertToCamelCase } from '@/utils/shared.util';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const analyzerUploadApi = async (file: File): Promise<IAnalyzerUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}${ANALYZER_API.UPLOAD}`, {
    body: formData,
    method: 'POST',
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    return Promise.reject(errorJson);
  }

  const json = await response.json();
  return convertToCamelCase(json) as IAnalyzerUploadResponse;
};
