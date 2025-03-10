import { z } from 'zod';

// Enum for job status
export const JobStatus = z.enum(['processing', 'done', 'failed']);
export type JobStatus = z.infer<typeof JobStatus>;

// Health check response
export const HealthResponse = z.object({
  status: z.string().describe('Status of the API service'),
});
export type HealthResponse = z.infer<typeof HealthResponse>;

// Conversion response
export const ConversionResponse = z.object({
  job_id: z.string().describe('Unique identifier for the conversion job'),
});
export type ConversionResponse = z.infer<typeof ConversionResponse>;

// Job status responses
export const JobStatusProcessingResponse = z.object({
  status: z.literal('processing'),
});
export type JobStatusProcessingResponse = z.infer<
  typeof JobStatusProcessingResponse
>;

export const JobStatusDoneResponse = z.object({
  status: z.literal('done'),
  url: z
    .string()
    .url()
    .describe('Presigned URL to download the converted file'),
});
export type JobStatusDoneResponse = z.infer<typeof JobStatusDoneResponse>;

export const JobStatusFailedResponse = z.object({
  status: z.literal('failed'),
  error: z
    .string()
    .describe('Error message explaining why the conversion failed'),
});
export type JobStatusFailedResponse = z.infer<typeof JobStatusFailedResponse>;

// Combined job status response type
export const JobStatusResponse = z.discriminatedUnion('status', [
  JobStatusProcessingResponse,
  JobStatusDoneResponse,
  JobStatusFailedResponse,
]);
export type JobStatusResponse = z.infer<typeof JobStatusResponse>;

// Validation error schemas
export const ValidationError = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
});
export type ValidationError = z.infer<typeof ValidationError>;

export const HTTPValidationError = z.object({
  detail: z.array(ValidationError),
});
export type HTTPValidationError = z.infer<typeof HTTPValidationError>;

// File upload schema
export const FileUpload = z.object({
  file: z.instanceof(File).describe('PowerPoint file to convert'),
});
export type FileUpload = z.infer<typeof FileUpload>;
