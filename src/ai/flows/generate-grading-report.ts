// Use server directive is required to run Genkit flows in Next.js
"use server";

/**
 * @fileOverview AI-powered grading report generator for student work.
 *
 * - generateGradingReport - Function to generate a grading report based on student work and task criteria.
 * - GenerateGradingReportInput - Input type for the generateGradingReport function.
 * - GenerateGradingReportOutput - Output type for the generateGradingReport function.
 */

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";

// Define the input schema for the grading report generation
const GenerateGradingReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the student's work, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  taskCriteria: z
    .string()
    .describe("The grading criteria for the specific task in the exam."),
});

export type GenerateGradingReportInput = z.infer<
  typeof GenerateGradingReportInputSchema
>;

// Define the output schema for the grading report
const GenerateGradingReportOutputSchema = z.object({
  report: z.string().describe("The AI-generated grading report."),
});

export type GenerateGradingReportOutput = z.infer<
  typeof GenerateGradingReportOutputSchema
>;

// Define the tool to determine the relevancy of the student's work to the task
const isImageRelevantToTask = ai.defineTool(
  {
    name: "isImageRelevantToTask",
    description:
      "Determines whether the information in the image is relevant to the specified task criteria.",
    inputSchema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of the student's work, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      taskCriteria: z
        .string()
        .describe("The grading criteria for the specific task in the exam."),
    }),
    outputSchema: z
      .boolean()
      .describe("True if the image is relevant, false otherwise."),
  },
  async (input) => {
    // Placeholder implementation, replace with actual logic
    // For example, use a vision model to analyze the image content
    // and compare it with the task criteria.
    // In a real implementation, you would use a more sophisticated
    // method to determine relevancy.
    return true; // Assuming the image is always relevant for now
  }
);

// Define the prompt for generating the grading report
const generateGradingReportPrompt = ai.definePrompt({
  name: "generateGradingReportPrompt",
  tools: [isImageRelevantToTask],
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of the student's work, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      taskCriteria: z
        .string()
        .describe("The grading criteria for the specific task in the exam."),
    }),
  },
  output: {
    schema: z.object({
      report: z.string().describe("The AI-generated grading report."),
    }),
  },
  prompt: `You are an AI grading assistant. Analyze the student's work in the image and generate a grading report in Russian based on the task criteria.

Task Criteria: {{{taskCriteria}}}

Student Work (Image):
{{media url=photoDataUri}}

Consider the relevance of the image to the task criteria. If the image is not relevant, state that in the report. Use the 'isImageRelevantToTask' tool to determine whether the image is relevant to the task criteria.

Generate a detailed report.
`,
});

// Define the Genkit flow for generating the grading report
const generateGradingReportFlow = ai.defineFlow<
  typeof GenerateGradingReportInputSchema,
  typeof GenerateGradingReportOutputSchema
>(
  {
    name: "generateGradingReportFlow",
    inputSchema: GenerateGradingReportInputSchema,
    outputSchema: GenerateGradingReportOutputSchema,
  },
  async (input) => {
    const { output } = await generateGradingReportPrompt(input);
    return output!;
  }
);

/**
 * Generates a grading report for a student's work based on the provided image and task criteria.
 * @param input - The input containing the student's work image and task criteria.
 * @returns A promise that resolves to the generated grading report.
 */
export async function generateGradingReport(
  input: GenerateGradingReportInput
): Promise<GenerateGradingReportOutput> {
  return generateGradingReportFlow(input);
}
