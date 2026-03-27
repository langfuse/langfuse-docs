import Link from "next/link";
import { NotFoundAnimation } from "@/components/NotFoundAnimation";

export default function NotFound() {
  return (
    <div className="text-center sm:py-20">
      <NotFoundAnimation />
      <h1 className="mt-6 text-2xl font-bold">404: Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you were looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-primary underline underline-offset-4"
      >
        Go back home
      </Link>
    </div>
  );
}
