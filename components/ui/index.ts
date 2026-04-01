/**
 * Design system barrel export.
 * Import all UI primitives from here — update a component once, it updates everywhere.
 *
 * Usage:
 *   import { Link, Image, Button } from "@/components/ui"
 */

// Core primitives
export { Link, linkVariants } from "./link";
export type { LinkProps, LinkVariants } from "./link";

export { Image } from "./image";

export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export {
  CornerBox,
  CornerBox as Box,
  cornersFromNeighbors,
  cornersForGridCell,
} from "./corner-box";

export { LinkBox } from "./link-box";
export type { LinkBoxProps, LinkBoxTooltipPlacement } from "./link-box";

export { ChipCard } from "./chip-card";
export type { ChipCardProps } from "./chip-card";

export { Text, textBodyMRegularClassName, textBodySRegularClassName } from "./text";
export type { TextProps } from "./text";

export { Heading } from "./heading";
export type { HeadingProps, HeadingSize, HeadingLevel } from "./heading";

export { TextHighlight } from "./text-highlight";
export type { TextHighlightProps } from "./text-highlight";

export { Dot } from "./dot";
export type { DotProps } from "./dot";

// Layout / composition
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
export { Separator } from "./separator";

// Overlay
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./dialog";
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from "./dropdown-menu";
export { Popover, PopoverTrigger, PopoverContent } from "./popover";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";

// Form
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "./form";
export { Input } from "./input";
export { Textarea } from "./textarea";
export { Label } from "./label";
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./select";
export { Switch } from "./switch";

// Data display
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./table";
export { Avatar, AvatarImage, AvatarFallback } from "./avatar";
export { Badge } from "./badge";
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "./breadcrumb";
export { default as NumberTicker } from "./number-ticker";
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination";
export { ScrollArea, ScrollBar } from "./scroll-area";
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel";
