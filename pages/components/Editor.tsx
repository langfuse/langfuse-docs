"use client";

import { useEffect, useState, useTransition } from "react";
// import { Post } from "@prisma/client";
// import { updatePost, updatePostMetadata } from "@/lib/actions";
import { Editor as NovelEditor } from "novel";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
// import LoadingDots from "./icons/loading-dots";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { cx } from "class-variance-authority";

// type PostWithSite = Post & { site: { subdomain: string | null } | null };

interface Post {
  id: string,
  title: string,
  description: string,
  content: string,
  slug: string,
  image: string,
  createdAt: string,
  updatedAt: string,
  published: boolean,
  user: string,
}

export default function Editor() {
  useEffect(() => {

  }, []);
  
  let [isPendingSaving, startTransitionSaving] = useTransition();
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<Post>({
    id: '1',
    title: '',
    description: '',
    content: '',
    slug: 'absd',
    image: '',
    createdAt: '',
    updatedAt: '',
    published: false,
    user: ''
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        startTransitionSaving(async () => {
          // await updatePost(data);
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [data, startTransitionSaving]);

  return (
    <div className="flex justify-center bg-black/20 fixed left-0 top-0 w-[100%] z-50 items-center pt-[80px] overflow-y-scroll h-[100vh]">
      <div className="relative bg-white min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
        <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
          <div className="rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500">
            {isPendingSaving ? "Saving..." : "Saved"}
          </div>
          <button
            onClick={() => {
              const formData = new FormData();
              // console.log(data.published, typeof data.published);
              formData.append("published", String(!data.published));
              startTransitionPublishing(async () => {
                // await updatePostMetadata(formData, post.id, "published").then(
                //   () => {
                //     toast.success(
                //       `Successfully ${
                //         data.published ? "unpublished" : "published"
                //       } your post.`,
                //     );
                //     setData((prev) => ({ ...prev, published: !prev.published }));
                //   },
                // );
              });
            }}
            className={cn(
              "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
              isPendingPublishing
                ? "cursor-not-allowed bg-[#7C3CEC] text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                : "bg-[#7C3CEC] text-white hover:bg-[#874DEE] hover:text-white active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
            )}
            disabled={isPendingPublishing}
          >
            {isPendingPublishing ? (
              '...'
            ) : (
              <p>{data.published ? "Unpublish" : "Publish"}</p>
            )}
          </button>
        </div>
        <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
          <input
            type="text"
            placeholder="Title"
            defaultValue={data?.title || ""}
            autoFocus
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
          <TextareaAutosize
            placeholder="Description"
            defaultValue={data?.description || ""}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
        </div>
        <NovelEditor
        className="relative block"
        defaultValue={data?.content || undefined}
        onUpdate={(editor) => {
          console.log(data);
          setData((prev) => ({
            ...prev,
            content: editor?.storage.markdown.getMarkdown(),
          }));
        }}
        onDebouncedUpdate={() => {
          if (
            data.title === '' &&
            data.description === '' &&
            data.content === ''
          ) {
            return;
          }
          startTransitionSaving(async () => {
            // await updatePost(data);
          });
        }}
      />
      </div>
    </div>
  );
}