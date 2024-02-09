import { BlogIndex } from "../blog/BlogIndex";

export const FromTheBlog = () => (
  <section>
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2>Blog</h2>
          <p className="mt-2 text-lg leading-8 text-primary/70">
            The latest updates and releases from AssistMe
          </p>
        </div>
        <BlogIndex maxItems={3} />
      </div>
    </div>
  </section>
);
