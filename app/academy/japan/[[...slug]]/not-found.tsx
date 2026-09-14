import Link from "next/link";

export default function JaAcademyNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">ページが見つかりません</h1>
      <p className="text-fd-muted-foreground">
        お探しのページは存在しないか、移動されました。
      </p>
      <Link href="/academy/japan" className="text-fd-primary hover:underline">
        Academy トップへ
      </Link>
    </div>
  );
}
