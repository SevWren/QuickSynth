# QuickSynth Bookmarklet

**Author:** Mike M (GitHub: [SevWren](https://github.com/SevWren))

**Repository:** [SevWren/QuickSynth](https://github.com/SevWren/QuickSynth)

**License:** [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](./LICENSE.md)

---

## Overview

QuickSynth is a browser bookmarklet designed to streamline the process of sending selected text from any webpage (or the entire page content if no text is selected) to various AI chat platforms. It bundles the selected text with one of two pre-defined summarization/analysis prompts and copies it to your clipboard before redirecting you to the chosen AI service's website.

This allows for quick analysis, summarization, or reformatting of web content using your preferred AI tool with consistent, detailed instructions.

## Features

*   **Text Selection:** Automatically grabs the text you've highlighted on a webpage.
*   **Fallback:** If no text is selected, it attempts to grab the entire body text of the page.
*   **AI Selection UI:** Presents a clean, dark-themed popup to choose your target AI platform.
*   **Prompt Formatting Options:** Offers two distinct system prompts for different summary styles:
    *   **Condensed Format:** Aims for a concise, paragraph-based summary with specific formatting rules.
    *   **Bullet List / Paragraph Format:** Creates a bulleted list of key points followed by a summary paragraph.
*   **Clipboard Integration:** Copies the selected text combined with the chosen system prompt directly to your clipboard.
*   **Automatic Redirect:** Navigates your browser tab to the URL of the selected AI service.
*   **Configurable:** The list of AI services and their URLs can be easily modified within the bookmarklet code. Default included AIs:
    *   Google Gemini
    *   Grok 3
    *   ChatGPT (Temporary Chat)
    *   DeepAI.org
    *   MS Copilot
*   **Error Handling:** Includes basic checks (e.g., prevents multiple popups) and error reporting via console/alerts.

## Installation

Bookmarklets are installed differently than browser extensions.

**Method 1: Drag and Drop (If your browser supports it)**

*   *This method requires the bookmarklet code to be hosted or linked directly. For now, use Method 2.*

**Method 2: Manual Creation**

1.  **Copy the Bookmarklet Code:** Go to the main source file in this repository (e.g., `quicksynth.js`) and copy the **entire single line** of JavaScript code starting with `javascript:void(function()...`.
2.  **Create a New Bookmark:**
    *   Right-click on your browser's bookmarks bar (you might need to enable it/make it visible first - usually `Ctrl+Shift+B` or `Cmd+Shift+B`).
    *   Select "Add Page..." or "Add Bookmark..." (the exact wording varies by browser).
3.  **Edit the Bookmark:**
    *   In the **Name** field, enter what you want the bookmarklet Text to Show i.e. something descriptive like `QuickSynth` or `⚡️ AI Tool`.
    *   In the **URL** (or **Location**) field, **delete** any existing content (like `http://...`) and **paste** the JavaScript code you copied in step 1.
4.  **Save** the bookmark.

## How to Use

1.  **Navigate:** Go to the webpage containing the text you want to process.
2.  **Select Text (Optional):** Highlight the specific portion of text you are interested in. If you skip this step, QuickSynth will try to use the entire page content (The equivalent to pressing control+A).
3.  **Click the Bookmarklet:** Click the `QuickSynth` bookmark you created in your bookmarks bar.
4.  **Choose AI:** A popup menu will appear. Click on the name of the AI service you want to use (e.g., "Google Gemini/Chatgpt/Grok").
5.  **Choose Format:** The menu will change. Click on the desired prompt format ("Condensed Format" or "Bullet List / Paragraph Format").
6.  **Action:**
    *   The selected text combined with the chosen prompt will be copied to your clipboard.
    *   Your browser will automatically navigate to the URL of the AI service you selected.
    *   *Note:* The first time you use it, your browser might ask for permission to allow the site to access your clipboard. (100% if you are in an incognito tab/window)
7.  **Paste:** Once the AI chat interface loads, simply paste (`Ctrl+V` or `Cmd+V`) the content from your clipboard into the input field and submit it.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)

This means:

*   **Attribution (BY):** You must give appropriate credit if you share or adapt this work.
*   **NonCommercial (NC):** You may **not** use this work for commercial purposes.

In simple terms: **You can use, copy, and modify this work as long as you give attribution (credit me, Mike M / Sevwren, and link back to the repository) and you are not using it in a commercial product or for commercial gain.**

Please see the [LICENSE.md](./LICENSE.md) file for the full legal text.

## Customization

You can modify the bookmarklet code directly (before creating the bookmark) to:

*   **Change AI Services:** Edit the `e` array (variable holding the list of AI objects) to add, remove, or modify the names and URLs.
*   **Modify Prompts:** Edit the `promptText1` and `promptText2` variables to change the system instructions sent to the AI.
*   **Adjust Styling:** Modify the `l` object (variable holding color definitions) to change the appearance of the popup.

Remember to keep the code as a single line if you plan to use it directly in a bookmarklet URL field. You might want to use a JavaScript minifier/uglifier after making edits if the code becomes too long or includes many line breaks.  Or just use an ai with the prompt "```java script code here```  Print the code in single line bookmarklet format."
