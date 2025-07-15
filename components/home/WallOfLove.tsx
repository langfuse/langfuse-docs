import Image from "next/image";
import { useState } from "react";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";

interface Testimonial {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: "xcom" | "producthunt" | "github";
  content: string;
  postURL?: string;
}

const platformLogos = {
  xcom: "/images/xcom.png",
  producthunt: "/images/producthunt.png",
};

const platformColors = {
  xcom: "text-slate-600",
  producthunt: "text-orange-600", 
  github: "text-slate-800",
};

// Helper function to render content with @langfuse links for X.com posts
const renderContent = (content: string, platform: string, postURL?: string) => {
  if (platform === "xcom" && content.includes("@langfuse")) {
    const parts = content.split("@langfuse");
    const elements = [];
    
    for (let i = 0; i < parts.length; i++) {
      elements.push(parts[i]);
      if (i < parts.length - 1) {
        elements.push(
          <a
            key={i}
            href={postURL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            @langfuse
          </a>
        );
      }
    }
    
    return elements;
  }
  
  return content;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Manu Hortet",
    handle: "Foudner at Producta",
    avatar: "/images/walloflove/manuhortet.avif",
    platform: "producthunt",
    content: "Complete and simple, sweet product. We also love it is open source!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=219995",
  },
  {
    id: "2",
    name: "Boris Arzentar",
    handle: "Co-founder of Cognee",
    avatar: "/images/walloflove/boris.avif",
    platform: "producthunt",
    content: "Langfuse is our choice when observability and tracing are the key. Our clients love their tool and we do too!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=301582",
  },
  {
    id: "3",
    name: "Dave Wilson",
    handle: "Supabase",
    avatar: "/images/walloflove/davewilson.avif",
    platform: "producthunt",
    content: "Brilliant product, this team is smashing it!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=762527",
  },
  {
    id: "4",
    name: "Viktor Sarstrom",
    handle: "@viktorsarstrom",
    avatar: "/images/walloflove/vicstor.jpg",
    platform: "xcom",
    content: "@langfuse is goat llm observability 🐐",
    postURL: "https://x.com/viktorsarstrom/status/1941093292319670527",
  },
  {
    id: "5",
    name: "Othmane Zoheir",
    handle: "@othmanezoheir",
    avatar: "/images/walloflove/othmane.jpg",
    platform: "xcom",
    content: "I've been using @langfuse from day 1 for my LLM package \"tinyllm\" and all my LLM apps. It just works and the team is fast and very helpful. Probably the best open-source tool/experience I've ever had.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=964209",
  },
  {
    id: "6",
    name: "Nadeesha Cabral",
    handle: "SVP of Engineering",
    avatar: "/images/walloflove/nadeesha.png",
    platform: "producthunt",
    content: "Langfuse is the easiest way to add observability to your AI stack. We use Langfuse ourselves, and have a native integration for our customers to push their spans to Langfuse as well.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=209822",
  },
  {
    id: "7",
    name: "Roman Geugelin",
    handle: "@RGeugelin",
    avatar: "/images/walloflove/RomanGeugelin.avif",
    platform: "producthunt",
    content: "Best LLM engineering platform out there by far. The speed with which they ship and how close they are to the community is mindblowing.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=1274265",
  },
  {
    id: "8",
    name: "Jackson Golden",
    handle: "AI Engineer",
    avatar: "/images/walloflove/jackson.avif",
    platform: "producthunt",
    content: "Easy to use -- it \"just works\". Great open-source experience as well.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=1105948",
  },
  {
    id: "9",
    name: "Feliks Ghazaryan",
    handle: "Founder at Symvol",
    avatar: "/images/walloflove/FeliksGhazaryan.avif",
    platform: "producthunt",
    content: "Best for LLM monitoring.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=290737",
  },
  {
    id: "10",
    name: "Grant Sloane",
    handle: "@rolling__sloane",
    avatar: "/images/walloflove/grantsloane.jpeg",
    platform: "xcom",
    content: "We have been using @langfuse to debug some of our prompts within our product and its a total game changer at pin pointing the issues and allowing you to quickly upgrade your prompts and back test them. Amazing product!",
    postURL: "https://x.com/rolling__sloane/status/1944774759406821396",
  },
  {
    id: "12",
    name: "NaXsh",
    handle: "@ninzo121",
    avatar: "/images/walloflove/naxsh.jpg",
    platform: "xcom",
    content: "Used @langfuse for the first time, I love this man...",
    postURL: "https://x.com/ninzo121/status/1942201675332415659",
  },
  {
    id: "13",
    name: "Dmitriy Tkalich",
    handle: "@dmitriy_tkalich",
    avatar: "/images/walloflove/dmitriy.jpg",
    platform: "xcom",
    content: "Solid observability features combined with TS SDK made @langfuse a go-to solution for bootstrapping new AI products. Previously used LangSmith and Helicone, where @langfuse stands out - pricing plan that favors early-stage products and offers more value for the price.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=1133521",
  },
  {
    id: "14",
    name: "Max Prilutskiy",
    handle: "@MaxPrilutskiy",
    avatar: "/images/walloflove/maxprilutskiy.jpg",
    platform: "producthunt",
    content: "Extremely reliable LLM Engineering Platform.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=262381",
  },
  {
    id: "15",
    name: "Philipp Hövelmann",
    handle: "Founder at Cortea AI",
    avatar: "/images/walloflove/PhilippHoevelmann.jpeg",
    platform: "producthunt",
    content: "Langfuse has been indispensable for us in leveraging LLMs. Its detailed tracing provides unrivaled clarity, streamlining our debug times and offering insights into both LLM and non-LLM actions. [...] It's the must-have tool for anyone in the LLM space.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=661724",
  },
  {
    id: "16",
    name: "Fengjiao Peng",
    handle: "Co-founder and Chief Art Fidgeter",
    avatar: "/images/walloflove/fengjiaopeng.avif",
    platform: "producthunt",
    content: "Easy to integrate and very intuitive to use!! Highly recommend for anyone developing chatGPT products. Amazing founding team who are super detail-oriented and understands LLM products deeply, and cool to see the evolution of the open source project every week!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=661641",
  },
  {
    id: "17",
    name: "Fenil Suchak",
    handle: "@fenilsuchak",
    avatar: "/images/walloflove/FenilSuchak.avif",
    platform: "producthunt",
    content: "LLM observability platform that just works!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?founderReview=135177",
  },
  {
    id: "18",
    name: "Felix Guo",
    handle: "",
    avatar: "/images/walloflove/FelixGuo.avif",
    platform: "producthunt",
    content: "Its flexible architecture allows seamless integration with any model or framework, and the open API empowers teams to create custom workflows tailored to their needs.",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=1264274",
  },
  {
    id: "19",
    name: "Maurice Burger",
    handle: "Co-Founder @ Atla (YC S23)",
    avatar: "/images/walloflove/maurice.avif",
    platform: "producthunt",
    content: "These guys keep building really cool stuff!",
    postURL: "https://www.producthunt.com/products/langfuse/reviews?review=1242981",
  },
];

export const WallOfLove = () => {
  const [cardsPerColumn, setCardsPerColumn] = useState(3);
  
  // Split testimonials into 3 columns
  const getColumns = () => {
    const columns = [[], [], []];
    testimonials.forEach((testimonial, index) => {
      columns[index % 3].push(testimonial);
    });
    return columns;
  };

  const columns = getColumns();
  const maxCardsPerColumn = Math.ceil(testimonials.length / 3);

  const getButtonText = () => {
    if (cardsPerColumn === 3) return 'Show more';
    if (cardsPerColumn === 5) return 'Show all';
    return null;
  };

  const handleShowMore = () => {
    if (cardsPerColumn === 3) {
      setCardsPerColumn(5);
    } else if (cardsPerColumn === 5) {
      setCardsPerColumn(maxCardsPerColumn);
    }
  };

  return (
    <HomeSection>
      <Header
        title="Join the community"
        description="80.000+ people have built on Langfuse."
        buttons={[
          { href: "https://x.com/langfuse", text: "Follow @langfuse", target: "_blank" },
          { href: "https://x.com/compose/post", text: "Share some love", target: "_blank" }
        ]}
      />

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.slice(0, cardsPerColumn).map((testimonial) => (
            <a
              key={testimonial.id}
              href={testimonial.postURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card border rounded-lg p-6 break-inside-avoid hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer"
            >
              {/* Profile Header */}
              <div className="flex items-start gap-3 mb-4">
                {testimonial.avatar && (
                  <div className="relative">
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-sm border">
                      {platformLogos[testimonial.platform].startsWith('/') ? (
                        <Image
                          src={platformLogos[testimonial.platform]}
                          alt={testimonial.platform}
                          width={12}
                          height={12}
                          className="object-contain"
                        />
                      ) : (
                        <span className={`text-xs ${platformColors[testimonial.platform]}`}>
                          {platformLogos[testimonial.platform]}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {testimonial.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.handle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground leading-relaxed">
                {renderContent(testimonial.content, testimonial.platform, testimonial.postURL)}
              </p>
            </a>
            ))}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {getButtonText() && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            {getButtonText()}
          </button>
        </div>
      )}
    </HomeSection>
  );
};

export default WallOfLove; 