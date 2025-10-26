'use server';

import { explainBibleChapter, type ExplainBibleChapterInput } from '@/ai/flows/explain-bible-chapter';

export async function getChapterExplanation(input: ExplainBibleChapterInput) {
  try {
    const result = await explainBibleChapter(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting chapter explanation:', error);
    return { success: false, error: 'Failed to get explanation. Please try again.' };
  }
}
