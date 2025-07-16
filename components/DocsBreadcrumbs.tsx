import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getPagesUnderRoute } from "nextra/context";
import { useConfig } from "nextra-theme-docs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

// Build dynamic title map from Nextra's page data
const usePageTitles = () => {
  const [titleMap, setTitleMap] = useState<Map<string, string>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const buildTitleMap = () => {
      const map = new Map<string, string>();
      
      // Main routes that support breadcrumbs
      const mainRoutes = ["/docs", "/self-hosting", "/integrations", "/faq", "/guides"];
      
      mainRoutes.forEach(route => {
        try {
          const pages = getPagesUnderRoute(route);
          
          // Add the main route title
          const mainTitle = getMainRouteTitle(route);
          if (mainTitle) {
            map.set(route, mainTitle);
          }
          
          // Add subpages using best available title
          pages.forEach(page => {
            if (page.route && page.route !== route) {
              // Extract the segment name from the route
              const segments = page.route.split('/').filter(Boolean);
              const pageSegment = segments[segments.length - 1];
              
              // Use the best available title from page data
              const pageWithFrontMatter = page as any;
              const title = pageWithFrontMatter.frontMatter?.sidebarTitle || 
                           pageWithFrontMatter.frontMatter?.title || 
                           formatSegmentTitle(pageSegment);
              
              map.set(page.route, title);
            }
          });
        } catch (error) {
          // Silently handle routes that don't exist
        }
      });
      
      setTitleMap(map);
      setIsLoaded(true);
    };

    buildTitleMap();
  }, []);

  return { titleMap, isLoaded };
};

// Get title for main routes (docs, self-hosting, etc.)
const getMainRouteTitle = (route: string): string => {
  const routeMap: Record<string, string> = {
    "/docs": "Docs",
    "/self-hosting": "Self Hosting", 
    "/integrations": "Integrations",
    "/faq": "FAQ",
    "/guides": "Guides"
  };
  return routeMap[route] || formatSegmentTitle(route.replace('/', ''));
};

// Convert kebab-case to Title Case
const formatSegmentTitle = (segment: string): string => {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getPageTitle = (segment: string, path: string, titleMap: Map<string, string>, isCurrentPage: boolean, isLoaded: boolean): string => {
  // If data hasn't loaded yet, use fallback to ensure consistent rendering
  if (!isLoaded) {
    return formatSegmentTitle(segment);
  }

  // Priority 1: Check our dynamic title map
  if (titleMap.has(path)) {
    return titleMap.get(path)!;
  }
  
  // Priority 2: For current page, use Nextra's useConfig but prefer concise titles
  if (isCurrentPage) {
    try {
      const { frontMatter, title: pageTitle } = useConfig();
      // Prefer sidebarTitle (designed for navigation) over title (can be verbose)
      const currentTitle = frontMatter?.sidebarTitle || frontMatter?.title || pageTitle;
      if (currentTitle && currentTitle !== 'undefined') {
        return currentTitle;
      }
    } catch {
      // Fall through to other methods
    }
  }
  
  // Priority 3: Fallback to formatted segment name
  return formatSegmentTitle(segment);
};

const useAvailablePages = () => {
  const [availablePages, setAvailablePages] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side to avoid hydration issues
    const detectPages = () => {
      const pages = new Set<string>();
      
      try {
        // Get pages from main routes that have breadcrumbs
        const mainRoutes = ["/docs", "/self-hosting", "/integrations", "/faq", "/guides"];
        
        mainRoutes.forEach(route => {
          try {
            const routePages = getPagesUnderRoute(route);
            routePages.forEach(page => {
              if (page.route && hasActualPage(page)) {
                pages.add(page.route);
              }
            });
            // Also add the main route itself if it has content
            if (hasMainRoutePage(route)) {
              pages.add(route);
            }
          } catch (error) {
            // Silently handle routes that don't exist
          }
        });
      } catch (error) {
        // Fallback: keep empty set if there are issues
      }
      
      setAvailablePages(pages);
      setIsLoaded(true);
    };

    detectPages();
  }, []);

  return { availablePages, isLoaded };
};

// Check if a page object represents an actual content page
const hasActualPage = (page: any): boolean => {
  // Filter out navigation structure pages
  if (!page.route) return false;
  
  // Check if it's a separator or non-page element
  if (page.type === "separator") return false;
  
  // Check if it has frontMatter (indicates actual content)
  if (page.frontMatter === undefined) return false;
  
  // Check if it's a redirect (has href but no actual content)
  if (page.href && page.href !== page.route) return false;
  
  // Check if it's marked as hidden or display: hidden
  if (page.display === "hidden") return false;
  
  return true;
};

// Check if main routes have actual index pages
const hasMainRoutePage = (route: string): boolean => {
  // These main routes definitely have pages
  const knownMainPages = ["/docs", "/self-hosting", "/integrations", "/faq", "/guides"];
  return knownMainPages.includes(route);
};

export const DocsBreadcrumbs = () => {
  const router = useRouter();
  const { availablePages, isLoaded: pagesLoaded } = useAvailablePages();
  const { titleMap, isLoaded: titlesLoaded } = usePageTitles();
  const [isMounted, setIsMounted] = useState(false);
  
  // Ensure component only renders on client to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathSegments = router.pathname
    .split("/")
    .filter(segment => segment !== "");

  // Don't render breadcrumbs for the root page only
  if (pathSegments.length === 0) {
    return null;
  }

  // Wait for client-side mounting to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    const title = getPageTitle(segment, path, titleMap, isLast, titlesLoaded);
    // Default to non-clickable until pages are loaded to ensure consistent rendering
    const hasPage = pagesLoaded ? availablePages.has(path) : false;

    return {
      path,
      title,
      isLast,
      hasPage,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.path}>
            {item.isLast || !item.hasPage ? (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={item.path}>{item.title}</Link>
              </BreadcrumbLink>
            )}
            {!item.isLast && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}; 