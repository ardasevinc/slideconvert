export async function convertFile(
  file: File,
  signal: AbortSignal,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve(new Blob(['converted content'], { type: 'application/pdf' }));
    }, 5000);

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Conversion aborted'));
    });
  });
}
