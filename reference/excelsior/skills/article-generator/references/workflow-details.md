# Workflow Details

This document provides a detailed breakdown of the 6-step article generation process.

## 1. Topic Research
Identify a compelling topic using Gemini.
*   **Input**: A list of target SEO keywords.
*   **Process**: Analyze trends, pain points, and local relevance.
*   **Output**: `TopicIdea` object (title, angle, targetKeyword, location, reasoning).

## 2. Article Generation & Humanization
Create the core content.
*   **Model**: Gemini 3 Pro (for high-quality writing).
*   **Content Philosophy**: focus on pain points and actionable solutions.
*   **Humanization**:
    *   Replace formal transitions (e.g., "Furthermore" -> "Also").
    *   Remove AI filler phrases ("It's important to note that").
    *   Apply contractions (e.g., "do not" -> "don't").
    *   Cleanup artifacts like double spaces or overused punctuation.

## 3. Infographic Data Extraction
Extract structured information from the generated article.
*   **Data Points**: 2-4 statistics, 4-6 process steps, 3-4 pro tips.
*   **Validation**: Ensure all required fields for the infographic are present.

## 4. Image Generation (Replicate)
Generate high-fidelity visuals using `google/nano-banana-pro`.
*   **Featured Image**: 16:9 aspect ratio, 2K resolution. Matches the article's tone.
*   **Infographic**: 9:16 aspect ratio, 4K resolution. Contains specific text from Step 3.
*   **Retry Logic**: Implement retries for transient API failures.

## 5. Media Upload
Download images from Replicate URLs and upload to Payload's `media` collection.
*   **SEO Optimization**: Use keyword-rich filenames and alt text based on the article's target keyword.
*   **Metadata**: Store captions with relevant keywords.

## 6. Article Creation & Cost Recording
Finalize the article in Payload CMS.
*   **Lexical Conversion**: Convert Markdown content to Lexical JSON for Payload's Rich Text editor.
*   **Publish Time**: Assign a random publish time within business hours for an organic look.
*   **Cost Tracking**: Record the total cost of generation for each article (see `cost-tracking.md`).

