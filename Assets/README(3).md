# QuickSynth Bookmarklet

**Author:** Mike M (GitHub: [SevWren](https://github.com/SevWren))

**Repository:** [SevWren/QuickSynth](https://github.com/SevWren/QuickSynth)

**License:** [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://github.com/SevWren/QuickSynth/blob/main/LICENSE)

---

## Overview

QuickSynth is a browser bookmarklet designed to streamline the process of sending selected text from any webpage (or the entire page content if no text is selected) to various AI chat platforms. It bundles the selected text with one of several pre-defined prompts and copies it to your clipboard before opening the chosen AI service's website in a new tab.

This allows for quick analysis, summarization, translation, or reformatting of web content using your preferred AI tool with consistent instructions and context.

## Features

*   **Text Selection:** Automatically grabs the text you've highlighted on a webpage.
*   **Fallback:** If no text is selected, it attempts to grab the entire body text of the page.
*   **AI Selection UI:** Presents a clean, dark-themed popup (see screenshot below) to choose your target AI platform. "ChatGPT (Temp Chat)" is selected by default.
*   **Prompt Formatting Options:** Offers distinct system prompts for different tasks:
    *   **Detailed Format:** Aims for a concise summary with specific formatting rules (simple sentences, bullets, bolding, italics).
    *   **Simple Summary Format:** Creates a short summary (5 bullets or less + 1 paragraph).
    *   **Translate to English:** Instructs the AI to translate the provided text into English.
*   **Source URL Context:** Automatically includes the URL of the source webpage in the text copied to the clipboard, providing context to the AI.
*   **Clipboard Integration:** Copies the selected text combined with the chosen system prompt and URL context directly to your clipboard.
*   **Automatic Redirect:** Opens the selected AI service's website in a new tab.
*   **Streamlined Workflow:** No extra confirmation popups after selecting a prompt format; the process is immediate.
*   **Configurable:** The list of AI services and prompts can be easily modified within the bookmarklet code. Default included AIs:
    *   Google Gemini
    *   Grok (X)
    *   ChatGPT (Temporary Chat)
    *   DeepAI Chat
    *   MS Copilot
    *   Perplexity
*   **Error Handling:** Includes basic checks (e.g., prevents multiple popups) and error reporting via console/alerts.
*   **Improved Compatibility & Robustness:** Uses standard DOM manipulation (avoids `innerHTML`) to ensure it works correctly on websites enforcing strict Content Security Policies (Trusted Types) and avoids common variable conflicts on complex sites.

## Installation

Bookmarklets are installed differently than browser extensions.

**Method 1: Drag and Drop (If your browser supports it)**

*   *This method is not currently set up for this repository. Please use Method 2.*

**Method 2: Manual Creation**

1.  **Copy the Bookmarklet Code:** Go to the main source file in this repository (e.g., `quicksynthV2.02.js` - **Note:** Use the latest version file) and copy the **entire single line** of JavaScript code starting with `javascript:void(function(){...`. Make sure you copy *everything*.
2.  **Show Bookmarks Bar:** Ensure your browser's bookmarks bar is visible (usually `Ctrl+Shift+B` or `Cmd+Shift+B`).
3.  **Create a New Bookmark:**
    *   Right-click on your bookmarks bar.
    *   Select "Add Page..." or "Add Bookmark..." (the exact wording varies by browser: Firefox uses "Add Bookmark...", Chrome/Edge use "Add page...").
4.  **Edit the Bookmark:**
    *   In the **Name** field, enter a short, descriptive name (e.g., `QuickSynth`, `⚡️ AI Tool`).
    *   In the **URL** (or **Location**) field, **delete** any existing content (like `http://...`) and **paste** the full JavaScript code you copied in step 1.
5.  **Save** the bookmark. It should now appear on your bookmarks bar.

## How to Use

1.  **Navigate:** Go to the webpage containing the text you want to process.
2.  **Select Text (Optional):** Highlight the specific portion of text you are interested in. If you skip this step, QuickSynth will try to use the entire page content (equivalent to pressing `Ctrl+A` then copying).
3.  **Click the Bookmarklet:** Click the `QuickSynth` bookmark you created in your bookmarks bar.
4.  **UI Appears:** A popup menu will appear overlaying the page.

    ![QuickSynth AI Selector Popup](Assets/popup.png)
    *(Note: Screenshot shows general layout; UI text might slightly differ based on updates)*

5.  **Choose AI:** "ChatGPT (Temp Chat)" will be selected by default. You can click on the name of a different AI service if desired. The selected AI will be highlighted.
6.  **Choose Format:** Click on the desired prompt format button ("Detailed Format", "Simple Summary Format", or "Translate to English").
7.  **Action:**
    *   The selected text, combined with the chosen prompt and the source page's URL context, will be copied to your clipboard.
    *   A new browser tab will automatically open to the URL of the AI service you selected.
    *   The popup on the original page will close immediately.
    *   *Note:* Your browser might ask for permission to allow the site to access your clipboard, especially the first time or in incognito mode. You need to allow this for the bookmarklet to function correctly.
8.  **Paste:** Once the AI chat interface loads in the new tab, simply paste (`Ctrl+V` or `Cmd+V`) the content from your clipboard into the input field and submit it. The AI will receive the prompt instructions, the source URL context, and the text itself.

## Customization

You can modify the bookmarklet code directly (before creating the bookmark) to:

*   **Change AI Services:** Edit the `e` array (variable holding the list of AI objects) to add, remove, or modify the names and URLs.
*   **Modify Prompts:** Edit the `l` (Detailed Format), `n` (Simple Summary), or `z` (Translate to English) variables to change the system instructions sent to the AI. Remember that special characters in prompts need to be URL-encoded (e.g., `%27` for an apostrophe, `%0A` for a newline if not using template literals).
*   **Adjust Styling:** Modify the `s` object (variable holding style definitions like colors, padding, font sizes) to change the appearance of the popup.

**Important:** After making edits, the entire code must still be on a **single line** starting with `javascript:` to work as a bookmarklet. You might want to use an online JavaScript minifier/compressor tool after making changes, or use an AI assistant with a prompt like: "Take the following JavaScript code and format it as a single-line bookmarklet starting with 'javascript:': ```[paste your multi-line code here]```".

---

## TODO / Future Ideas

This section lists potential improvements and features for future versions:

*   **User-Friendly Customization & Bookmarklet Generation:**
    *   Implement a feature (perhaps within the popup UI itself, or via a separate configuration page/tool) allowing users to easily add/edit/remove AI services (Name, URL).
    *   This tool should then **generate the complete, updated, single-line bookmarklet JavaScript code** incorporating the user's custom list. The user could then copy this generated code to create or update their personal bookmarklet, avoiding manual code editing.
*   **Custom Prompts:** Allow users to define and select their own custom prompts in addition to the defaults.
*   **UI Themes:** Offer different color themes (e.g., light mode).
*   **Persistence:** Remember the last used AI and/or prompt format (potentially using `localStorage`, though this might be tricky/undesirable for a simple bookmarklet).
*   **Advanced Text Extraction:** Improve handling of complex pages, iframes, or specific content types.
*   **Selected Text Manipulation:** Making the text displayed in the "Selected Text" pane editable. The goal is to allow the user to modify or delete parts of the captured text within the popup itself before it gets combined with the prompt and copied to the clipboard. This would give the user a chance to clean up or refine the text before sending it to the AI.
*   **Direct API Integration (Advanced):** Explore possibilities for directly interacting with AI APIs if available (this would likely require a different approach, possibly a browser extension instead of a bookmarklet, due to security and complexity). Would not be in this Javascript bookmarklet?

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

[![CC BY-NC 4.0][cc-by-nc-shield]][cc-by-nc]

This means:

*   **Attribution (BY):** You must give appropriate credit if you share or adapt this work.
*   **NonCommercial (NC):** You may **not** use this work for commercial purposes.

In simple terms: **You can use, copy, and modify this work as long as you give attribution (credit me, Mike M / SevWren, and link back to the repository) and you are not using it in a commercial product or for commercial gain.**

Please see the [LICENSE](https://github.com/SevWren/QuickSynth/blob/main/LICENSE) file for the full legal text.

[cc-by-nc]: https://creativecommons.org/licenses/by-nc/4.0/
[cc-by-nc-shield]: https://licensebuttons.net/l/by-nc/4.0/88x31.png

---

*(README updated to reflect changes in quicksynthV2.02.js and add Future Ideas)*