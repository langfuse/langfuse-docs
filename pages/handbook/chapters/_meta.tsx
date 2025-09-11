// Define the order of chapters for consistent sorting
export const CHAPTER_ORDER = [
  "mission",
  "history",
  "customers",
  "open-source",
  "monetization",
  "team",
];

// Generate the default export from the chapter order array
export default Object.fromEntries(
  CHAPTER_ORDER.map((chapter) => [chapter, {}])
);
