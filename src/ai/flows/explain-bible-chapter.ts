'use server';

/**
 * @fileOverview Explains a Bible chapter in an easy-to-understand format for a young adult audience.
 *
 * - explainBibleChapter - A function that explains the selected chapter and book.
 * - ExplainBibleChapterInput - The input type for the explainBibleChapter function.
 * - ExplainBibleChapterOutput - The return type for the explainBibleChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainBibleChapterInputSchema = z.object({
  book: z.string().describe('The book of the Bible.'),
  chapter: z.number().describe('The chapter number of the selected book.'),
});
export type ExplainBibleChapterInput = z.infer<typeof ExplainBibleChapterInputSchema>;

const ExplainBibleChapterOutputSchema = z.object({
  explanation: z.string().describe('An explanation of the selected chapter and book tailored for a young adult audience.'),
});
export type ExplainBibleChapterOutput = z.infer<typeof ExplainBibleChapterOutputSchema>;

export async function explainBibleChapter(input: ExplainBibleChapterInput): Promise<ExplainBibleChapterOutput> {
  return explainBibleChapterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainBibleChapterPrompt',
  input: {schema: ExplainBibleChapterInputSchema},
  output: {schema: ExplainBibleChapterOutputSchema},
  prompt: `You are an experienced Bible expert. Please explain {{book}} chapter {{chapter}} in an easy-to-read format for a 21-year-old audience.

Structure your explanation with clear paragraphs and line breaks to ensure it is highly readable.

Highlight what we can learn from it in our Christian walk today.`,
});

const explainBibleChapterFlow = ai.defineFlow(
  {
    name: 'explainBibleChapterFlow',
    inputSchema: ExplainBibleChapterInputSchema,
    outputSchema: ExplainBibleChapterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
