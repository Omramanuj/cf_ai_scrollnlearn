const fs = require('fs');
const path = require('path');

/**
 * Reads a prompt from the prompts.md file in the root directory
 * @param {string} promptName - The name of the prompt to extract (e.g., 'Educational Content Generation Prompt')
 * @returns {string} The prompt template string
 */
const getPrompt = (promptName) => {
  try {
    const promptsPath = path.join(process.cwd(), '..', 'prompts.md');
    const promptsContent = fs.readFileSync(promptsPath, 'utf-8');
    
    // Extract the prompt from the markdown file
    const promptRegex = new RegExp(`## ${promptName}\\s*\\n\\n\`\`\`prompt\\s*\\n([\\s\\S]*?)\\n\`\`\``);
    const match = promptsContent.match(promptRegex);
    
    if (!match) {
      throw new Error(`Prompt "${promptName}" not found in prompts.md`);
    }
    
    return match[1].trim();
  } catch (error) {
    console.error(`Error reading prompt "${promptName}":`, error);
    throw new Error(`Failed to read prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Replaces placeholders in a prompt template with actual values
 * @param {string} template - The prompt template string
 * @param {Object} replacements - Object with placeholder keys and replacement values
 * @returns {string} The prompt with placeholders replaced
 */
const formatPrompt = (template, replacements) => {
  let formattedPrompt = template;
  
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{${key}}`;
    formattedPrompt = formattedPrompt.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return formattedPrompt;
};

module.exports = {
  getPrompt,
  formatPrompt
};
