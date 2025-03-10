import { z } from 'zod';
import {
  ConversionResponse,
  JobStatusResponse,
  FileUpload,
} from './schemas/api.schema';

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
};

// Common headers for all API requests
const getHeaders = (includeContentType = true) => {
  const headers: Record<string, string> = {
    'X-API-Key': API_CONFIG.API_KEY,
  };

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// Error handling
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to handle API responses
async function handleResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      `API error: ${response.statusText}`,
      response.status,
      errorData,
    );
  }

  const data = await response.json();
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ApiError('Invalid response data', response.status, {
      error,
      data,
    });
  }
}

/**
 * Convert a PowerPoint file to PDF
 */
export async function convertPowerPoint(
  file: File,
  signal?: AbortSignal,
): Promise<ConversionResponse> {
  // Validate the file
  FileUpload.parse({ file });

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_CONFIG.BASE_URL}/convert`, {
    method: 'POST',
    headers: getHeaders(false),
    body: formData,
    signal,
  });

  return handleResponse(response, ConversionResponse);
}

/**
 * Check the status of a conversion job
 */
export async function getConversionStatus(
  jobId: string,
  signal?: AbortSignal,
): Promise<z.infer<typeof JobStatusResponse>> {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/status/${jobId}`, {
    method: 'GET',
    headers: getHeaders(),
    signal,
  });

  return handleResponse(response, JobStatusResponse);
}

// React Query mutation functions
export const apiMutations = {
  convertPowerPoint: {
    mutationFn: (file: File) => convertPowerPoint(file),
  },
};

// React Query query functions
export const apiQueries = {
  getConversionStatus: (jobId: string) => ({
    queryKey: ['conversion', jobId],
    queryFn: () => getConversionStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (data: z.infer<typeof JobStatusResponse> | undefined) => {
      // Refetch every second if the job is still processing
      return data?.status === 'processing' ? 1000 : false;
    },
  }),
};
