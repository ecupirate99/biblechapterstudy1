# **App Name**: Chapter Insights

## Core Features:

- Book Selection: Allow users to select a book from a dropdown list of all 66 books of the Bible.
- Chapter Selection: Dynamically populate a chapter dropdown based on the selected book.
- AI Explanation: Call the Gemini 1.5 API via Firebase Genkit to provide chapter explanations tailored for a young adult audience, given the selected book and chapter. Use a tool when deciding how to include additional bible verses in the output.
- Explanation Display: Display the AI-generated explanation in a neatly formatted container with preserved paragraphs and line breaks.
- Loading Indicator: Display a loading message or spinner while fetching data from the Gemini 1.5 API.
- Local Storage: Store the last selected book and chapter in localStorage to persist user preferences.
- Reset Button: Provide a reset button to clear selections and start over.

## Style Guidelines:

- Primary color: Soft sky blue (#A8D5E2) to evoke a sense of peace and calm.
- Background color: Very light beige (#F5F5DC) for a gentle, neutral base.
- Accent color: Muted lavender (#D0CDE1) to complement the blue and add a subtle highlight.
- Headline font: 'Playfair' serif for titles to provide an elegant, readable style. Body font: 'PT Sans' sans-serif to pair for readable paragraphs.
- Use a clean, modern, mobile-friendly layout, ensuring the entire interface is responsive and looks great on phones and tablets. Employ card-style sections with padding and rounded corners to organize content.
- Implement a smooth fade-in animation when the explanation appears to provide a polished user experience.
- Simple, clear icons to represent books or chapters.