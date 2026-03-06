import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || "" });

async function autoTagArticles() {
  const payload = await getPayload({ config });

  console.log("Fetching articles and tags...");
  const { docs: articles } = await payload.find({
    collection: "articles",
    limit: 100,
  });

  const { docs: tags } = await payload.find({
    collection: "article-tags",
    limit: 100,
  });

  if (articles.length === 0) {
    console.log("No articles found.");
    return;
  }

  if (tags.length === 0) {
    console.log("No tags found. Please seed tags first.");
    return;
  }

  const tagsList = tags.map((t) => `${t.name} (id: ${t.id})`).join(", ");

  for (const article of articles) {
    console.log(`\nAnalyzing article: "${article.title}"`);
    
    // Convert lexical content to plain text if possible, or just use excerpt/title
    const contentPreview = article.excerpt || article.title;
    
    const prompt = `
      You are an expert editor for Excelsior Creative, a web development and digital agency.
      Based on the following article snippet, select the most relevant tags from the provided list.
      
      ARTICLE TITLE: ${article.title}
      ARTICLE EXCERPT: ${article.excerpt}
      
      AVAILABLE TAGS: ${tagsList}
      
      Instructions:
      1. Select 2-5 tags that are most relevant to this article.
      2. Return ONLY a comma-separated list of tag IDs.
      3. Do not include any other text or explanation.
      
      Output example: 1, 5, 12
    `;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      const responseText = response.text || "";
      const suggestedIds = responseText.trim().split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));

      if (suggestedIds.length > 0) {
        console.log(`Suggested tags: ${suggestedIds.join(", ")}`);
        
        await payload.update({
          collection: "articles",
          id: article.id,
          data: {
            tags: suggestedIds,
          },
        });
        console.log("Article updated successfully.");
      } else {
        console.log("No tags suggested.");
      }
    } catch (error) {
      console.error(`Error processing article ${article.title}:`, error);
    }
  }

  console.log("\nAuto-tagging complete!");
  process.exit(0);
}

autoTagArticles();

