'use client';

import * as React from 'react';
import { FileText, Upload, X } from 'lucide-react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { Button, Progress } from '@/components/ui';

interface FileDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesAccepted?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  maxSize?: number;
  progress?: number;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesAccepted,
  onUpload,
  maxSize = 52428800, // 50MB in bytes
  progress,
  disabled = false,
  className,
  ...props
}: FileDropzoneProps) {
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );

        setFiles(newFiles);
        onFilesAccepted?.(newFiles);

        if (onUpload) {
          toast.promise(onUpload(newFiles), {
            loading: 'Converting your presentation...',
            success: () => {
              setFiles([]);
              return 'Conversion complete!';
            },
            error: 'Conversion failed. Please try again.',
          });
        }
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          if (file.size > maxSize) {
            toast.error(
              `"${file.name}" exceeds the ${formatBytes(maxSize)} file size limit`,
            );
          } else {
            toast.error(
              `"${file.name}" is not supported. Please use PowerPoint files (.ppt, .pptx) only.`,
            );
          }
        });
      }
    },
    [onFilesAccepted, onUpload, maxSize],
  );

  // Cleanup function to revoke object URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if ('preview' in file) {
          URL.revokeObjectURL((file as File & { preview: string }).preview);
        }
      });
    };
  }, [files]);

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <Dropzone
        onDrop={onDrop}
        accept={{
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            ['.pptx'],
        }}
        maxSize={maxSize}
        maxFiles={1}
        multiple={false}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative flex flex-col items-center justify-center h-52 w-full rounded-lg border-2 border-dashed px-5 py-6 text-center transition cursor-pointer',
              isDragActive
                ? 'border-primary backdrop-blur-md bg-white/20 dark:bg-slate-900/20'
                : isDragReject
                  ? 'border-destructive bg-destructive/5'
                  : 'border-muted-foreground/25 hover:bg-white/10 hover:backdrop-blur-md hover:dark:bg-slate-900/10 hover:shadow-lg',
              disabled && 'pointer-events-none opacity-60',
              className,
            )}
            {...props}
          >
            <input {...getInputProps()} />

            <div className='flex flex-col items-center justify-center gap-4'>
              <div
                className={cn(
                  'rounded-full p-3',
                  isDragReject ? 'bg-destructive/10' : 'bg-primary/10',
                )}
              >
                <Upload
                  className={cn(
                    'h-8 w-8',
                    isDragReject ? 'text-destructive' : 'text-primary',
                  )}
                  aria-hidden='true'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <p className='font-medium'>
                  {isDragActive
                    ? isDragReject
                      ? 'This file type is not supported'
                      : 'Drop your file here'
                    : 'Drag & drop your PowerPoint file here'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {isDragReject
                    ? 'Please use .ppt or .pptx files only'
                    : 'or click to browse your files'}
                </p>
              </div>

              <p className='text-xs text-muted-foreground mt-2'>
                Supports .ppt, .pptx files up to {formatBytes(maxSize)}
              </p>
            </div>
          </div>
        )}
      </Dropzone>

      {files.length > 0 && (
        <div className='mt-4 border rounded-md p-3 flex items-center gap-2'>
          <FileText
            className='h-10 w-10 text-muted-foreground'
            aria-hidden='true'
          />
          <div className='flex flex-1 flex-col gap-1'>
            <p className='text-sm font-medium'>{files[0].name}</p>
            <p className='text-xs text-muted-foreground'>
              {formatBytes(files[0].size)}
            </p>
            {progress !== undefined && (
              <Progress value={progress} className='h-1 mt-1' />
            )}
          </div>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={() => setFiles([])}
          >
            <X className='h-4 w-4' aria-hidden='true' />
            <span className='sr-only'>Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
}
