"use server";
/**
 * @fileOverview Determines if an uploaded image is relevant to a specific task based on given criteria.
 *
 * - determineImageRelevance - A function that checks the relevance of an image to a task.
 * - DetermineImageRelevanceInput - The input type for the determineImageRelevance function.
 * - DetermineImageRelevanceOutput - The return type for the determineImageRelevance function.
 */

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";

const DetermineImageRelevanceInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a student's work, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  taskCriteria: z
    .string()
    .describe("The criteria for the task assigned to the student."),
  taskDescription: z
    .string()
    .describe("The description of the task assigned to the student."),
});
export type DetermineImageRelevanceInput = z.infer<
  typeof DetermineImageRelevanceInputSchema
>;

const DetermineImageRelevanceOutputSchema = z.object({
  isRelevant: z
    .boolean()
    .describe(
      "Whether the image is relevant to the task based on the criteria."
    ),
  reason: z
    .string()
    .describe("The reasoning behind the relevance determination."),
});
export type DetermineImageRelevanceOutput = z.infer<
  typeof DetermineImageRelevanceOutputSchema
>;

export async function determineImageRelevance(
  input: DetermineImageRelevanceInput
): Promise<DetermineImageRelevanceOutput> {
  return determineImageRelevanceFlow(input);
}

const prompt = ai.definePrompt({
  name: "determineImageRelevancePrompt",
  input: {
    schema: z.object({
      imageDataUri: z
        .string()
        .describe(
          "A photo of a student's work, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      taskCriteria: z
        .string()
        .describe("The criteria for the task assigned to the student."),
      taskDescription: z
        .string()
        .describe("The description of the task assigned to the student."),
    }),
  },
  output: {
    schema: z.object({
      isRelevant: z
        .boolean()
        .describe(
          "Whether the image is relevant to the task based on the criteria."
        ),
      reason: z
        .string()
        .describe("The reasoning behind the relevance determination."),
    }),
  },
  prompt: `You are an AI assistant helping teachers determine the relevance of student work images to specific tasks.

Task Description: {{{taskDescription}}}
Task Criteria: {{{taskCriteria}}}
Student Work Image: {{media url=imageDataUri}}

Based on the student work and the defined criteria, determine if the image is relevant to the task. Explain your reasoning. Return a JSON object containing a boolean \"isRelevant\" field and a \"reason\" field.
`,
});

const determineImageRelevanceFlow = ai.defineFlow<
  typeof DetermineImageRelevanceInputSchema,
  typeof DetermineImageRelevanceOutputSchema
>(
  {
    name: "determineImageRelevanceFlow",
    inputSchema: DetermineImageRelevanceInputSchema,
    outputSchema: DetermineImageRelevanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
