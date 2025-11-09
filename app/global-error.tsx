'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">出错了</h1>
          <p className="text-muted-foreground mb-4">
            {error.message || '发生了未知错误'}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}

