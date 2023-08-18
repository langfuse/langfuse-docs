import { BlogIndex } from "../blog/BlogIndex";

export const FromTheBlog = () => (
  <section>
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 ">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <BlogIndex maxItems={3} />
      </div>
    </div>
  </section>
);
