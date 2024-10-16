import { z } from "zod";

// Define the schema for the incoming JSON data
export const genreUpdateSchema = z.object({
  genreIds: z.array(z.number().int().positive()) // An array of positive integers
});

// Example usage of the schema