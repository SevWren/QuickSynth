javascript: void (function () {
    try {
        const popupId = "ai-selector-popup-unique";
        const overlayId = "ai-selector-overlay-unique";
        const aiOptions = [
            { name: "Google Gemini", url: "https://gemini.google.com/app" },
            { name: "Grok (X)", url: "https://x.com/i/grok" },
            { name: "ChatGPT (Temp Chat)", url: "https://chatgpt.com/?temporary-chat=true" },
            { name: "ChatGPT (Normal)", url: "https://chatgpt.com/" },
            { name: "DeepAI Chat", url: "https://deepai.org/chat" },
            { name: "MS Copilot", url: "https://copilot.microsoft.com/" },
            { name: "Perplexity", url: "https://www.perplexity.ai/" },
        ];

        const detailedPrompt =
            "Analyze the text internally (don%27t show questions). Create a concise summary:\n" +
            "- Use simple sentences (split complex ones).\n" +
            "- Use bullets for key facts/details.\n" +
            "- **Bold** the first 2-3 words of new ideas.\n" +
            "- Retain important clarifying details (scope, caveats).\n" +
            "- If long, use 2-3 paragraphs.\n" +
            "- Formatting: **Bold** central theme & key facts/entities. *Italicize* supporting ideas, author%27s purpose, & implications/outcomes.\n" +
            "- Output ONLY the formatted summary.";

        const simplePrompt = "Summarize the text in 5 bullet points or less and 1 paragraph.";
        const translatePrompt = "Translate the Provided text from the source language to the target language \"English\":";

        const styles = {
            colors: {
                bgDark: "#1f2937",
                bgDarker: "#111827",
                bgLighter: "#374151",
                border: "#4b5563",
                text: "#f3f4f6",
                textDim: "#9ca3af",
                accent: "#60a5fa",
                selectedBg: "rgba(96, 165, 250, 0.3)",
                selectedBorder: "#60a5fa",
                hoverBg: "#4b5563",
            },
            padding: "1rem",
            paddingSmall: "0.5rem",
            borderRadius: "0.75rem",
            fontSizeLg: "1.125rem",
            fontSizeBase: "1rem",
            fontSizeSm: "0.875rem",
            fontSizeXs: "0.75rem",
        };

        if (document.getElementById(popupId)) {
            console.log("AI Selector Popup already exists.");
            return;
        }

        let selectedText = "";
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            selectedText = selection.toString().trim();
            console.log("Using selected text.");
        } else {
            selection.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(document.body);
            selection.addRange(range);
            selectedText = selection.toString().trim();
            selection.removeAllRanges();
            console.log("Using body text.");
        }

        if (!selectedText) {
            alert("Could not find text to process. Select text on the page or ensure the page body has text content.");
            return;
        }

        let selectedAi = null;
        let selectedAiElement = null;
        let detailedButton = null;
        let simpleButton = null;
        let translateButton = null;
        let selectedAiDisplay = null;
        let textArea = null;

        function closePopup() {
            const popup = document.getElementById(popupId);
            const overlay = document.getElementById(overlayId);
            if (popup) popup.remove();
            if (overlay) overlay.remove();
            console.log("Popup closed.");
        }

        function applyStyles(element, styles) {
            for (const key in styles) {
                element.style[key] = styles[key];
            }
        }

        function handleAction(prompt, actionName) {
            if (!selectedAi) {
                alert("Please select an AI assistant first.");
                return;
            }

            const sourceUrl = window.location.href;
            const contextPrefix = `The text was taken from the url \`${sourceUrl}\`\n Here is the text to analyze:\n\n`;
            const currentText = textArea.value;
            const finalPayload = `${prompt}\n\n${contextPrefix}${currentText}`;

            navigator.clipboard
                .writeText(finalPayload)
                .then(() => {
                    console.log(`Prompt (${actionName}) + Text copied for ${selectedAi.name}. Length: ${finalPayload.length}`);
                    window.open(selectedAi.url, "_blank");
                    closePopup();
                })
                .catch((error) => {
                    console.error("Clipboard write failed:", error);
                    alert("Error copying to clipboard: " + error.message);
                });
        }

        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = overlayId;
        applyStyles(overlay, {
            position: "fixed",
            inset: "0",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: "2147483645",
            backdropFilter: "blur(3px)",
        });
        overlay.onclick = closePopup;
        document.body.appendChild(overlay);

        // Create popup container
        const popup = document.createElement("div");
        popup.id = popupId;
        applyStyles(popup, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1000px",
            height: "80vh",
            backgroundColor: styles.colors.bgDark,
            color: styles.colors.text,
            borderRadius: styles.borderRadius,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: "2147483646",
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
        });

        // Close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        applyStyles(closeButton, {
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            color: styles.colors.textDim,
            fontSize: "2rem",
            fontWeight: "bold",
            cursor: "pointer",
            lineHeight: "1",
        });
        closeButton.onmouseover = () => (closeButton.style.color = styles.colors.text);
        closeButton.onmouseout = () => (closeButton.style.color = styles.colors.textDim);
        closeButton.onclick = closePopup;
        popup.appendChild(closeButton);

        // Add more sections and logic here...

        document.body.appendChild(popup);
        console.log("AI Selector Popup created.");
    } catch (error) {
        console.error("Bookmarklet error:", error);
        alert("Error executing bookmarklet: " + error.message);
        const popup = document.getElementById(popupId);
        const overlay = document.getElementById(overlayId);
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }
})();

// Bookmarklet creation instructions:
// Options:
// 1) Use a bookmarklet generator like https://caiorss.github.io/bookmarklet-maker/
// 1) Use a LLM prompt to minify the code i.e. "Format the following as a single line chrome bookmarklet"
// 
// 2) https://www.toptal.com/developers/javascript-minifier