---
name: article-generator
description: Generates SEO-optimized articles with AI-powered featured images and infographics. Use when Claude needs to automate the end-to-end process of content creation, image generation, and publishing for a Payload CMS website. This includes researching topics, writing humanized content, extracting infographic data, generating visuals via Replicate, and uploading to the CMS.
---

# Article Generator

## Overview

This skill provides a comprehensive workflow for generating high-quality, SEO-optimized blog articles with integrated visual assets. It leverages Gemini for content and data extraction, and Replicate for high-fidelity image generation.

## Prerequisites

To use this workflow, ensure the following are configured:

1.  **Environment Variables**:
    *   `GOOGLE_GENAI_API_KEY`: API key for Gemini models.
    *   `REPLICATE_API_KEY`: API key for Replicate image generation.
2.  **CMS Configuration**:
    *   A running Payload CMS instance with `articles`, `article-categories`, and `media` collections.
    *   A `content-generation-settings` global for custom prompts and styles.
3.  **Dependencies**:
    *   `@google/genai`
    *   `replicate`
    *   `dotenv` (for environment variable management)

## Quick Start Workflow

Follow these steps to generate and publish an article:

1.  **Configure Settings**: Define your brand's voice, keywords, and image styles in `configuration.md`.
2.  **Topic Research**: Identify high-potential SEO topics based on target keywords.
3.  **Generate Content**: Create a comprehensive, value-driven article with metadata.
4.  **Extract Visual Data**: Identify key stats and steps for the infographic.
5.  **Generate Visuals**: Produce a featured image and a detailed infographic.
6.  **Publish to CMS**: Upload media assets and create the article record in Payload.

## Advanced Documentation

For detailed implementation details, see the following references:

*   **[Workflow Details](references/workflow-details.md)**: Deep dive into each step of the generation process.
*   **[Configuration Guide](references/configuration.md)**: How to customize prompts, keywords, and branding.
*   **[Cost Tracking](references/cost-tracking.md)**: Understanding and calculating API costs per article.

## Key Patterns

### Humanization
AI-generated content should be post-processed to remove common "AI tells" (e.g., "In today's digital landscape") and add natural variations like contractions.

### Structured Data
Always use structured JSON output (via Gemini's `responseSchema`) to ensure reliability when passing data between steps (e.g., from content generation to infographic extraction).
