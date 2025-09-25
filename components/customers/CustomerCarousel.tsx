import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";
import { useMemo, useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CustomerStory {
  route: string;
  frontMatter: {
    title: string;
    description: string;
    customerLogo?: string;
    customerLogoDark?: string;
    customerQuote?: string;
    quoteAuthor?: string;
    quoteRole?: string;
    quoteCompany?: string;
    quoteAuthorImage?: string;
    showInCustomerIndex?: boolean;
  };
  meta?: {
    title: string;
  };
  name: string;
}

interface CustomerCarouselStandaloneProps {
  path?: string;
  title?: string;
  description?: string;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  showDots?: boolean;
  loop?: boolean;
  className?: string;
}

export const CustomerCarouselStandalone = ({
  path = "/customers",
  title,
  description,
  autoAdvance = false,
  autoAdvanceInterval = 5000,
  showDots = true,
  loop = false,
  className = "",
}: CustomerCarouselStandaloneProps) => {
  const customerStories = useMemo(() => {
    const stories = (getPagesUnderRoute(path) as Array<CustomerStory>)
      .filter((page) => page.frontMatter?.showInCustomerIndex !== false);
    
    // For infinite loop, duplicate items to ensure smooth looping
    if (loop && stories.length > 0) {
      return [...stories, ...stories, ...stories];
    }
    
    return stories;
  }, [path, loop]);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState<boolean[]>([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    
    // If looping is enabled, start at the middle set of items first
    if (loop) {
      const originalStories = (getPagesUnderRoute(path) as Array<CustomerStory>)
        .filter((page) => page.frontMatter?.showInCustomerIndex !== false);
      if (originalStories.length > 0) {
        api.scrollTo(originalStories.length);
      }
    }
    
    // Set initial state after potential scroll with a small delay to ensure rendering
    const timeoutId = setTimeout(() => {
      const initialCurrent = api.selectedScrollSnap() + 1;
      setCurrent(initialCurrent);

      // Initialize visibility state - center one item with partial side items
      const initialIsInView = customerStories.map((_, index) => {
        const currentIndex = initialCurrent - 1;
        // Show current item fully, and adjacent items partially
        return index >= currentIndex - 1 && index <= currentIndex + 1;
      });
      setIsInView(initialIsInView);
    }, 100);

    // Set up the select event handler
    const handleSelect = () => {
      const newCurrent = api.selectedScrollSnap() + 1;
      setCurrent(newCurrent);
      
      // Update visibility for fade effect - center one item with partial side items
      const newIsInView = customerStories.map((_, index) => {
        const currentIndex = newCurrent - 1;
        // Show current item fully, and adjacent items partially
        return index >= currentIndex - 1 && index <= currentIndex + 1;
      });
      setIsInView(newIsInView);
    };

    api.on("select", handleSelect);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      api.off("select", handleSelect);
    };
  }, [api, loop, path, customerStories]);

  if (customerStories.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Carousel */}
      <div className="w-full max-w-6xl mx-auto">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: loop,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {customerStories.map((story, index) => (
              <CarouselItem key={story.route} className="pl-4 basis-1/2">
                <Link 
                  href={story.route} 
                  className={`group block bg-card border rounded-lg p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 cursor-pointer flex flex-col h-full min-h-[300px] ${
                    index === current - 1 
                      ? 'opacity-100' 
                      : isInView[index] 
                        ? 'opacity-50' 
                        : 'opacity-20'
                  }`}
                >
                  {/* Customer Logo */}
                  {story.frontMatter.customerLogo && (
                    <div className="flex items-center mb-8">
                      {story.frontMatter.customerLogoDark ? (
                        <>
                          <Image
                            src={story.frontMatter.customerLogo}
                            alt={`${story.frontMatter.title} logo`}
                            width={250}
                            height={80}
                            className="h-8 w-auto object-contain dark:hidden"
                            quality={100}
                            priority={false}
                            unoptimized={false}
                          />
                          <Image
                            src={story.frontMatter.customerLogoDark}
                            alt={`${story.frontMatter.title} logo`}
                            width={250}
                            height={80}
                            className="h-8 w-auto object-contain hidden dark:block"
                            quality={100}
                            priority={false}
                            unoptimized={false}
                          />
                        </>
                      ) : (
                        <Image
                          src={story.frontMatter.customerLogo}
                          alt={`${story.frontMatter.title} logo`}
                          width={250}
                          height={80}
                          className="h-8 w-auto object-contain dark:invert dark:brightness-0 dark:contrast-200"
                          quality={100}
                          priority={false}
                          unoptimized={false}
                        />
                      )}
                    </div>
                  )}

                  {/* Quote */}
                  {story.frontMatter.customerQuote && (
                    <blockquote className="text-gray-500 dark:text-gray-200 text-xl leading-relaxed mb-4">
                      "{story.frontMatter.customerQuote}"
                    </blockquote>
                  )}

                  {/* Spacing div to push author info to bottom */}
                  <div className="flex-1" />

                  {/* Author Information */}
                  {(story.frontMatter.quoteAuthor || story.frontMatter.quoteRole || story.frontMatter.quoteCompany) && (
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        {/* Profile Picture */}
                        {story.frontMatter.quoteAuthorImage && (
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={story.frontMatter.quoteAuthorImage}
                              alt={`${story.frontMatter.quoteAuthor} profile picture`}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              quality={100}
                              priority={false}
                              unoptimized={false}
                            />
                          </div>
                        )}
                        <div>
                          {story.frontMatter.quoteAuthor && (
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {story.frontMatter.quoteAuthor}
                            </div>
                          )}
                          {(story.frontMatter.quoteRole || story.frontMatter.quoteCompany) && (
                            <div>
                              {story.frontMatter.quoteRole && (
                                <span>{story.frontMatter.quoteRole}</span>
                              )}
                              {story.frontMatter.quoteRole && story.frontMatter.quoteCompany && (
                                <span> at </span>
                              )}
                              {story.frontMatter.quoteCompany && (
                                <span>{story.frontMatter.quoteCompany}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-6 h-6 min-w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                        <svg 
                          className="w-3 h-3 text-gray-600 dark:text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 12h14M12 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Dots Indicator */}
        {showDots && (
          <div className="flex justify-center mt-6 space-x-2">
            {(() => {
              // Get the original stories for dots (not duplicated)
              const originalStories = (getPagesUnderRoute(path) as Array<CustomerStory>)
                .filter((page) => page.frontMatter?.showInCustomerIndex !== false);
              
              return originalStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (api) {
                      // Calculate the target index in the duplicated array
                      const targetIndex = loop ? index + originalStories.length : index;
                      api.scrollTo(targetIndex);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === (current - 1) % originalStories.length
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to customer story ${index + 1}`}
                />
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
