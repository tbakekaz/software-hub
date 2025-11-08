"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <main className="container mx-auto px-4 py-20 text-center space-y-3">
      <h1 className="text-2xl font-semibold">出错了</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </main>
  );
}




