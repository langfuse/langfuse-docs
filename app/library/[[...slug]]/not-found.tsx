import Link from "next/link";

export default function LibraryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-fd-muted-foreground">
        The library page you're looking for doesn't exist or has moved.
      </p>
      <Link href="/library" className="text-fd-primary hover:underline">
        Back to Library
      </Link>
    </div>
  );
}
