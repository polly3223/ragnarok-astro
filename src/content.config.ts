import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Blog posts: frontmatter mirrors the template's CMS fields; bodies are stand-in text (see README).
const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    readTime: z.string(),
    cover: z.string(),
    author: z.string(),
    avatar: z.string(),
    date: z.coerce.date(),
    order: z.number(),
  }),
});

// Open positions: card/sidebar fields from the template; descriptions are stand-in text (see README).
const jobs = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/jobs" }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    type: z.string(),
    salary: z.string(),
    department: z.string(),
    order: z.number(),
  }),
});

export const collections = { blog, jobs };
