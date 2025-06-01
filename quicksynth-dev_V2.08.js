javascript: void (function () {
    /**
     * @file Bookmarklet for selecting an AI assistant and sending selected page text with a chosen prompt.
     * @version 2.08
     * @author SevWren
     * @description A browser bookmarklet that allows users to select text on any webpage, choose an AI assistant,
     * and send the text with a predefined prompt for analysis, summarization, or translation.
     * Features include real-time character counting, multiple AI service options, and customizable prompts.
     * @license CC BY-NC 4.0
     */



    /**
     * Main execution block wrapped in try-catch for error handling.
     * @function
     * @throws {Error} If there's an error during execution, it will be caught and displayed to the user.
     */


    try {
        
        
        /**
         * Unique ID for the main popup element.
         * @const {string}
         */
        const popupId = "ai-selector-popup-unique";
        /**
         * Unique ID for the overlay element.
         * @const {string}
         */
        const overlayId = "ai-selector-overlay-unique";

        /**
         * Array of available AI assistant options.
         * Each object should have a `name` (string) and `url` (string).
         * @const {Array<{name: string, url: string}>}
         */
        const aiOptions = [
            { name: "Google Gemini", url: "https://gemini.google.com/app" },
            { name: "Grok (X)", url: "https://www.grok.com" }, // Note: Original had x.com/i/grok, this was changed in DEV version
            { name: "ChatGPT (Temp Chat)", url: "https://chatgpt.com/?temporary-chat=true" },
            { name: "ChatGPT (Normal)", url: "https://chatgpt.com/" },
            { name: "DeepAI Chat", url: "https://deepai.org/chat" },
            { name: "MS Copilot", url: "https://copilot.microsoft.com/" },
            { name: "Perplexity", url: "https://www.perplexity.ai/" },
        ];

        /**
         * Predefined detailed prompt for text analysis and summarization.
         * Note: Special characters (like ') are URL-encoded (as %27) to ensure
         * proper transmission in URLs and prevent syntax errors.
         * @const {string}
         */
        const detailedPrompt =
            "Analyze the text internally (don%27t show questions). Create a concise summary:\n" +
            "- Use simple sentences (split complex ones).\n" +
            "- Use bullets for key facts/details.\n" +
            "- Bold the first 2-3 words of new ideas.\n" +
            "- Retain important clarifying details (scope, caveats).\n" +
            "- If long, use 2-3 paragraphs.\n" +
            "- Formatting: **Bold** central theme & key facts/entities. *Italicize* supporting ideas, author%27s purpose, & implications/outcomes.\n" +
            "- Output ONLY the formatted summary.";

        /**
         * Predefined simple prompt for a brief summary.
         * @const {string}
         */
        const simplePrompt = "Summarize the text in 5 bullet points or less and 1 paragraph.";

        /**
         * Predefined prompt for translating text to English.
         * @const {string}
         */
        const translatePrompt = "Translate the Provided text from the source language to the target language \"English\":";

        /**
         * Object containing styling definitions for the UI elements.
         * @const {object}
         */
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
            if (selection) selection.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(document.body);
            if (selection) selection.addRange(range);
            selectedText = selection ? selection.toString().trim() : "";
            if (selection) selection.removeAllRanges();
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
        let textPanelHeaderCharCount = null; // Declare for wider scope if needed for the event listener

        /**
         * Closes the popup and removes the overlay from the DOM.
         * @function closePopup
         * @returns {void}
         */
        function closePopup() {
            const popupEl = document.getElementById(popupId);
            const overlayEl = document.getElementById(overlayId);
            if (popupEl) popupEl.remove();
            if (overlayEl) overlayEl.remove();
            console.log("Popup closed.");
        }

        /**
         * Applies multiple CSS styles to a DOM element.
         * @function applyStyles
         * @param {HTMLElement} element - The DOM element to apply styles to.
         * @param {Object.<string, string>} styleProps - An object where keys are CSS properties and values are their corresponding values.
         * @returns {void}
         */
        function applyStyles(element, styleProps) {
            for (const key in styleProps) {
                element.style[key] = styleProps[key];
            }
        }

        /**
         * Handles the action when a prompt format is selected.
         * Copies the formatted text to the clipboard and opens the selected AI service.
         * @function handleAction
         * @param {string} prompt - The prompt template to use for the AI.
         * @param {string} actionName - The name of the action being performed (for logging).
         * @returns {void}
         */
        function handleAction(prompt, actionName) {
            if (!selectedAi) {
                alert("Please select an AI assistant first.");
                return;
            }
            if (!textArea) {
                console.error("Textarea element not found.");
                alert("Error: Text area not initialized.");
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

        const closeButton = document.createElement("button");
        closeButton.textContent = "\u00D7";
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

        const textPanel = document.createElement("div");
        applyStyles(textPanel, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${styles.colors.border}`,
            overflow: "hidden"
        });

        const textPanelHeader = document.createElement("div");
        applyStyles(textPanelHeader, {
            padding: styles.padding,
            backgroundColor: styles.colors.bgDarker,
            borderBottom: `1px solid ${styles.colors.border}`,
            flexShrink: "0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        });

        const textPanelHeaderTitle = document.createElement("h3");
        applyStyles(textPanelHeaderTitle, {
            fontSize: styles.fontSizeLg,
            fontWeight: "bold",
            margin: "0"
        });
        textPanelHeaderTitle.textContent = "Selected Text";
        textPanelHeader.appendChild(textPanelHeaderTitle);

        textPanelHeaderCharCount = document.createElement("span"); // Assign to the previously declared variable
        applyStyles(textPanelHeaderCharCount, {
            fontSize: styles.fontSizeXs,
            backgroundColor: styles.colors.bgLighter,
            padding: "2px 6px",
            borderRadius: "10px"
        });
        textPanelHeaderCharCount.textContent = `${selectedText.length} chars (original)`;
        textPanelHeader.appendChild(textPanelHeaderCharCount);
        textPanel.appendChild(textPanelHeader);

        textArea = document.createElement("textarea");
        applyStyles(textArea, {
            flexGrow: "1",
            overflowY: "auto",
            padding: styles.padding,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            color: styles.colors.textDim,
            lineHeight: "1.6",
            backgroundColor: styles.colors.bgDark,
            border: "none",
            outline: "none",
            resize: "vertical",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "inherit",
            fontSize: styles.fontSizeSm
        });
        textArea.value = selectedText;

        // MODIFICATION: Add event listener for real-time character count update
        textArea.addEventListener('input', function() {
            /**
             * Updates the character count display in real-time as the user types.
             * @event input
             * @listens HTMLTextAreaElement#input
             */
            if (textPanelHeaderCharCount) {
                textPanelHeaderCharCount.textContent = `${textArea.value.length} chars`;
            }
        });

        textPanel.appendChild(textArea);
        popup.appendChild(textPanel);

        const aiSelectionPanel = document.createElement("div");
        applyStyles(aiSelectionPanel, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${styles.colors.border}`,
            overflow: "hidden",
            backgroundColor: "#2a3748"
        });

        const aiSelectionPanelHeader = document.createElement("div");
        applyStyles(aiSelectionPanelHeader, {
            padding: styles.padding,
            backgroundColor: styles.colors.bgDarker,
            borderBottom: `1px solid ${styles.colors.border}`,
            flexShrink: "0"
        });

        const aiSelectionPanelHeaderTitle = document.createElement("h3");
        applyStyles(aiSelectionPanelHeaderTitle, {
            fontSize: styles.fontSizeLg,
            fontWeight: "bold",
            margin: "0"
        });
        aiSelectionPanelHeaderTitle.textContent = "Select AI Assistant";
        aiSelectionPanelHeader.appendChild(aiSelectionPanelHeaderTitle);
        aiSelectionPanel.appendChild(aiSelectionPanelHeader);

        const aiListContainer = document.createElement("div");
        applyStyles(aiListContainer, {
            flexGrow: "1",
            overflowY: "auto",
            padding: styles.paddingSmall
        });

        const defaultAiName = "ChatGPT (Temp Chat)";
        const defaultAiIndex = aiOptions.findIndex(ai => ai.name === defaultAiName);

        /**
         * Iterates through available AI options and creates UI elements for each.
         * Sets up event listeners for selection and hover effects.
         * @param {Object} aiItem - The AI service object containing name and URL.
         * @param {number} index - The index of the current AI service in the array.
         */
        aiOptions.forEach((aiItem, index) => {
            const aiItemElement = document.createElement("div");
            applyStyles(aiItemElement, {
                padding: styles.paddingSmall,
                margin: styles.paddingSmall,
                backgroundColor: styles.colors.bgDark,
                borderRadius: "0.5rem",
                border: "1px solid transparent",
                cursor: "pointer",
                transition: "background-color 0.2s ease, border-color 0.2s ease"
            });

            const aiItemInnerDiv = document.createElement("div");
            applyStyles(aiItemInnerDiv, { display: "flex", alignItems: "center" });

            const aiItemTextDiv = document.createElement("div");
            applyStyles(aiItemTextDiv, { flexGrow: "1" });

            const aiItemNameDiv = document.createElement("div");
            applyStyles(aiItemNameDiv, { fontWeight: "500", fontSize: styles.fontSizeBase });
            aiItemNameDiv.textContent = aiItem.name;
            aiItemTextDiv.appendChild(aiItemNameDiv);

            const aiItemUrlDiv = document.createElement("div");
            applyStyles(aiItemUrlDiv, { fontSize: styles.fontSizeXs, color: styles.colors.textDim, marginTop: "2px" });
            aiItemUrlDiv.textContent = aiItem.url.replace("https://", "").split("/")[0];
            aiItemTextDiv.appendChild(aiItemUrlDiv);

            aiItemInnerDiv.appendChild(aiItemTextDiv);
            aiItemElement.appendChild(aiItemInnerDiv);

            aiItemElement.onmouseover = () => {
                if (selectedAi !== aiItem) {
                    aiItemElement.style.backgroundColor = styles.colors.hoverBg;
                }
            };
            aiItemElement.onmouseout = () => {
                if (selectedAi !== aiItem) {
                    aiItemElement.style.backgroundColor = styles.colors.bgDark;
                }
            };
            aiItemElement.onclick = () => {
                if (selectedAiElement) {
                    selectedAiElement.style.backgroundColor = styles.colors.bgDark;
                    selectedAiElement.style.borderColor = "transparent";
                    selectedAiElement.style.boxShadow = "none";
                }
                selectedAi = aiItem;
                selectedAiElement = aiItemElement;
                selectedAiElement.style.backgroundColor = styles.colors.selectedBg;
                selectedAiElement.style.borderColor = styles.colors.selectedBorder;
                selectedAiElement.style.boxShadow = `0 0 0 2px ${styles.colors.selectedBorder}`;

                if (selectedAiDisplay) {
                    selectedAiDisplay.textContent = '';
                    const strongName = document.createElement("strong");
                    applyStyles(strongName, { color: styles.colors.accent });
                    strongName.textContent = aiItem.name;

                    const spanUrl = document.createElement("span");
                    applyStyles(spanUrl, { fontSize: styles.fontSizeXs, color: styles.colors.textDim });
                    spanUrl.textContent = ` (${aiItem.url.replace("https://","").split("/")[0]})`;

                    selectedAiDisplay.appendChild(document.createTextNode("Selected: "));
                    selectedAiDisplay.appendChild(strongName);
                    selectedAiDisplay.appendChild(spanUrl);
                }

                if (detailedButton) { detailedButton.style.opacity = "1"; detailedButton.style.cursor = "pointer"; }
                if (simpleButton) { simpleButton.style.opacity = "1"; simpleButton.style.cursor = "pointer"; }
                if (translateButton) { translateButton.style.opacity = "1"; translateButton.style.cursor = "pointer"; }
                console.log("AI Selected:", aiItem.name);
            };
            aiListContainer.appendChild(aiItemElement);

            const effectiveDefaultIndex = defaultAiIndex !== -1 ? defaultAiIndex : 0;
            if (index === effectiveDefaultIndex) {
                setTimeout(() => aiItemElement.click(), 0);
            }
        });
        aiSelectionPanel.appendChild(aiListContainer);
        popup.appendChild(aiSelectionPanel);

        const actionsPanel = document.createElement("div");
        applyStyles(actionsPanel, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#2a3748"
        });

        const actionsPanelHeader = document.createElement("div");
        applyStyles(actionsPanelHeader, {
            padding: styles.padding,
            backgroundColor: styles.colors.bgDarker,
            borderBottom: `1px solid ${styles.colors.border}`,
            flexShrink: "0"
        });

        const actionsPanelHeaderTitle = document.createElement("h3");
        applyStyles(actionsPanelHeaderTitle, {
            fontSize: styles.fontSizeLg,
            fontWeight: "bold",
            margin: "0"
        });
        actionsPanelHeaderTitle.textContent = "Processing Options";
        actionsPanelHeader.appendChild(actionsPanelHeaderTitle);
        actionsPanel.appendChild(actionsPanelHeader);

        const actionsContainer = document.createElement("div");
        applyStyles(actionsContainer, {
            flexGrow: "1",
            display: "flex",
            flexDirection: "column",
            padding: styles.padding,
            overflowY: "auto"
        });

        selectedAiDisplay = document.createElement("div");
        applyStyles(selectedAiDisplay, {
            marginBottom: "1.5rem",
            fontSize: styles.fontSizeSm,
            color: styles.colors.textDim
        });
        selectedAiDisplay.textContent = "No AI selected";
        actionsContainer.appendChild(selectedAiDisplay);

        const promptFormatTitle = document.createElement("h4");
        applyStyles(promptFormatTitle, {
            fontSize: styles.fontSizeSm,
            fontWeight: "600",
            color: styles.colors.textDim,
            marginBottom: styles.paddingSmall,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        });
        promptFormatTitle.textContent = "Prompt Format";
        actionsContainer.appendChild(promptFormatTitle);

        detailedButton = document.createElement("div");
        applyStyles(detailedButton, {
            backgroundColor: styles.colors.bgDark,
            padding: styles.padding,
            borderRadius: "0.5rem",
            border: `1px solid ${styles.colors.border}`,
            marginBottom: "0.75rem",
            cursor: "not-allowed",
            opacity: "0.6",
            transition: "border-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease"
        });
        const detailedButtonH5 = document.createElement("h5");
        applyStyles(detailedButtonH5, { fontWeight: "500", fontSize: styles.fontSizeBase, margin: "0 0 4px 0" });
        detailedButtonH5.textContent = "Detailed Format";
        detailedButton.appendChild(detailedButtonH5);
        const detailedButtonP = document.createElement("p");
        applyStyles(detailedButtonP, { fontSize: styles.fontSizeXs, color: styles.colors.textDim, margin: "0" });
        detailedButtonP.textContent = "Concise summary with specific formatting.";
        detailedButton.appendChild(detailedButtonP);
        detailedButton.onmouseover = () => { if (selectedAi) { detailedButton.style.borderColor = styles.colors.accent; detailedButton.style.cursor = 'pointer'; } };
        detailedButton.onmouseout = () => { if (selectedAi) { detailedButton.style.borderColor = styles.colors.border; } };
        detailedButton.onclick = () => { selectedAi && handleAction(detailedPrompt, "Detailed Format") };
        actionsContainer.appendChild(detailedButton);

        simpleButton = document.createElement("div");
        applyStyles(simpleButton, {
            backgroundColor: styles.colors.bgDark,
            padding: styles.padding,
            borderRadius: "0.5rem",
            border: `1px solid ${styles.colors.border}`,
            marginBottom: "0.75rem",
            cursor: "not-allowed",
            opacity: "0.6",
            transition: "border-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease"
        });
        const simpleButtonH5 = document.createElement("h5");
        applyStyles(simpleButtonH5, { fontWeight: "500", fontSize: styles.fontSizeBase, margin: "0 0 4px 0" });
        simpleButtonH5.textContent = "Simple Summary Format";
        simpleButton.appendChild(simpleButtonH5);
        const simpleButtonP = document.createElement("p");
        applyStyles(simpleButtonP, { fontSize: styles.fontSizeXs, color: styles.colors.textDim, margin: "0" });
        simpleButtonP.textContent = "5 bullets or less + 1 paragraph summary.";
        simpleButton.appendChild(simpleButtonP);
        simpleButton.onmouseover = () => { if (selectedAi) { simpleButton.style.borderColor = styles.colors.accent; simpleButton.style.cursor = 'pointer'; } };
        simpleButton.onmouseout = () => { if (selectedAi) { simpleButton.style.borderColor = styles.colors.border; } };
        simpleButton.onclick = () => { selectedAi && handleAction(simplePrompt, "Simple Summary") };
        actionsContainer.appendChild(simpleButton);

        translateButton = document.createElement("div");
        applyStyles(translateButton, {
            backgroundColor: styles.colors.bgDark,
            padding: styles.padding,
            borderRadius: "0.5rem",
            border: `1px solid ${styles.colors.border}`,
            marginBottom: "0.75rem",
            cursor: "not-allowed",
            opacity: "0.6",
            transition: "border-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease"
        });
        const translateButtonH5 = document.createElement("h5");
        applyStyles(translateButtonH5, { fontWeight: "500", fontSize: styles.fontSizeBase, margin: "0 0 4px 0" });
        translateButtonH5.textContent = "Translate to English";
        translateButton.appendChild(translateButtonH5);
        const translateButtonP = document.createElement("p");
        applyStyles(translateButtonP, { fontSize: styles.fontSizeXs, color: styles.colors.textDim, margin: "0" });
        translateButtonP.textContent = "Translate source text to English.";
        translateButton.appendChild(translateButtonP);
        translateButton.onmouseover = () => { if (selectedAi) { translateButton.style.borderColor = styles.colors.accent; translateButton.style.cursor = 'pointer'; } };
        translateButton.onmouseout = () => { if (selectedAi) { translateButton.style.borderColor = styles.colors.border; } };
        translateButton.onclick = () => { selectedAi && handleAction(translatePrompt, "Translate to English") };
        actionsContainer.appendChild(translateButton);

        const spacerDiv = document.createElement("div");
        applyStyles(spacerDiv, { flexGrow: "1" });
        actionsContainer.appendChild(spacerDiv);

        const manualCopyContainer = document.createElement("div");
        applyStyles(manualCopyContainer, {
            paddingTop: styles.padding,
            borderTop: `1px solid ${styles.colors.border}`,
            marginTop: styles.padding
        });

        const manualCopyButton = document.createElement("button");
        applyStyles(manualCopyButton, {
            width: "100%",
            backgroundColor: styles.colors.bgLighter,
            color: styles.colors.text,
            border: "none",
            padding: `${styles.paddingSmall} ${styles.padding}`,
            borderRadius: "0.5rem",
            fontSize: styles.fontSizeSm,
            cursor: "pointer",
            textAlign: "center",
            transition: "background-color 0.2s ease"
        });
        manualCopyButton.textContent = "Copy Detailed Prompt + Edited Text Manually";
        manualCopyButton.onmouseover = () => manualCopyButton.style.backgroundColor = styles.colors.hoverBg;
        manualCopyButton.onmouseout = () => manualCopyButton.style.backgroundColor = styles.colors.bgLighter;
        /**
         * Handles the manual copy button click event.
         * Copies the detailed prompt and edited text to the clipboard.
         * @event click
         * @listens HTMLButtonElement#click
         */
        manualCopyButton.onclick = () => {
            if (!textArea) {
                 alert("Error: Text area not initialized for manual copy.");
                 return;
            }
            const sourceUrl = window.location.href;
            const contextPrefix = `The text was taken from the url \`${sourceUrl}\`\n Here is the text to analyze:\n\n`;
            const currentText_manual = textArea.value;
            const text_manual = `${detailedPrompt}\n\n${contextPrefix}${currentText_manual}`;
            navigator.clipboard.writeText(text_manual)
                .then(() => {
                    alert("Detailed format prompt + EDITED text (with URL) copied to clipboard!");
                })
                .catch(error => {
                    alert("Failed to copy automatically. See console for details.");
                    console.error("Manual copy failed:", error);
                });
        };
        manualCopyContainer.appendChild(manualCopyButton);
        actionsContainer.appendChild(manualCopyContainer);
        actionsPanel.appendChild(actionsContainer);
        popup.appendChild(actionsPanel);
        document.body.appendChild(popup);
        console.log("AI Selector Popup created.");

    /**
     * Global error handler for the bookmarklet.
     * Displays errors to the user and ensures cleanup of any created elements.
     * @param {Error} error - The error that was caught.
     */
    } catch (error) {
        console.error("Bookmarklet error:", error);
        alert("Error executing bookmarklet: " + error.message);
        const popupToRemove = document.getElementById(popupId);
        const overlayToRemove = document.getElementById(overlayId);
        if (popupToRemove) popupToRemove.remove();
        if (overlayToRemove) overlayToRemove.remove();
    }
})();