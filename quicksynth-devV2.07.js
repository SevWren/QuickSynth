javascript: void (function () {
    /**
     * @file Bookmarklet for selecting an AI assistant and sending selected page text with a chosen prompt.
     * @version 1.0.0
     * @author Your Name/Alias (if applicable)
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
            { name: "Grok (X)", url: "https://x.com/i/grok" },
            { name: "ChatGPT (Temp Chat)", url: "https://chatgpt.com/?temporary-chat=true" },
            { name: "ChatGPT (Normal)", url: "https://chatgpt.com/" },
            { name: "DeepAI Chat", url: "https://deepai.org/chat" },
            { name: "MS Copilot", url: "https://copilot.microsoft.com/" },
            { name: "Perplexity", url: "https://www.perplexity.ai/" },
        ];

        /**
         * Predefined detailed prompt for text analysis and summarization.
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
         * @property {object} colors - Color palette.
         * @property {string} colors.bgDark - Dark background color.
         * @property {string} colors.bgDarker - Even darker background color.
         * @property {string} colors.bgLighter - Lighter background color.
         * @property {string} colors.border - Border color.
         * @property {string} colors.text - Primary text color.
         * @property {string} colors.textDim - Dimmed text color.
         * @property {string} colors.accent - Accent color.
         * @property {string} colors.selectedBg - Background color for selected items.
         * @property {string} colors.selectedBorder - Border color for selected items.
         * @property {string} colors.hoverBg - Background color for hovered items.
         * @property {string} padding - Standard padding value.
         * @property {string} paddingSmall - Smaller padding value.
         * @property {string} borderRadius - Standard border radius.
         * @property {string} fontSizeLg - Large font size.
         * @property {string} fontSizeBase - Base font size.
         * @property {string} fontSizeSm - Small font size.
         * @property {string} fontSizeXs - Extra small font size.
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

        // Prevent multiple popups
        if (document.getElementById(popupId)) {
            console.log("AI Selector Popup already exists.");
            return;
        }

        /**
         * The text selected by the user or the entire body text if no selection.
         * @type {string}
         */
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
            alert("Could not find text to process. Select text on the page or ensure the page body has text content."); //typically happens when text is rendered in an undetectable way
            return;
        }

        /**
         * The currently selected AI object from `aiOptions`.
         * @type {null|{name: string, url: string}}
         */
        let selectedAi = null;
        /**
         * The DOM element representing the currently selected AI in the list.
         * @type {null|HTMLElement}
         */
        let selectedAiElement = null;
        /**
         * The DOM element for the "Detailed Format" action button.
         * @type {null|HTMLElement}
         */
        let detailedButton = null;
        /**
         * The DOM element for the "Simple Summary Format" action button.
         * @type {null|HTMLElement}
         */
        let simpleButton = null;
        /**
         * The DOM element for the "Translate to English" action button.
         * @type {null|HTMLElement}
         */
        let translateButton = null;
        /**
         * The DOM element used to display the name of the currently selected AI.
         * @type {null|HTMLElement}
         */
        let selectedAiDisplay = null;
        /**
         * The textarea DOM element where the selected text is displayed and can be edited.
         * @type {null|HTMLTextAreaElement}
         */
        let textArea = null;


        /**
         * Closes the popup and overlay by removing them from the DOM.
         */
        function closePopup() {
            const popupEl = document.getElementById(popupId);
            const overlayEl = document.getElementById(overlayId);
            if (popupEl) popupEl.remove();
            if (overlayEl) overlayEl.remove();
            console.log("Popup closed.");
        }

        /**
         * Applies a set of CSS styles to a given DOM element.
         * @param {HTMLElement} element - The DOM element to style.
         * @param {Object<string, string>} styleProps - An object where keys are CSS property names (camelCase)
         *                                            and values are their corresponding string values.
         */
        function applyStyles(element, styleProps) {
            for (const key in styleProps) {
                element.style[key] = styleProps[key];
            }
        }

        /**
         * Handles the action of sending the text to the selected AI.
         * Constructs the final payload (prompt + text + context), copies it to the clipboard,
         * opens the selected AI's URL in a new tab, and closes the popup.
         * @param {string} prompt - The base prompt string for the action.
         * @param {string} actionName - A descriptive name for the action (e.g., "Detailed Format") for logging.
         */
        function handleAction(prompt, actionName) {
            if (!selectedAi) {
                alert("Please select an AI assistant first.");
                return;
            }

            const sourceUrl = window.location.href;
            const contextPrefix = `The text was taken from the url \`${sourceUrl}\`\n Here is the text to analyze:\n\n`;
            const currentText = textArea.value; // Get current text from textarea
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

        // --- UI Creation ---

        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = overlayId;
        applyStyles(overlay, {
            position: "fixed",
            inset: "0",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: "2147483645", // High z-index to be on top
            backdropFilter: "blur(3px)",
        });
        overlay.onclick = closePopup; // Close popup when overlay is clicked
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
            zIndex: "2147483646", // Higher z-index than overlay
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
        });

        // Create Close button for the popup
        const closeButton = document.createElement("button");
        closeButton.textContent = "\u00D7"; // "×" character
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

        // --- Left Panel: Text Area ---
        const textPanel = document.createElement("div");
        applyStyles(textPanel, {
            flex: "1", // Takes 1/3 of the space (with other flex:1 panels)
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

        const textPanelHeaderCharCount = document.createElement("span");
        applyStyles(textPanelHeaderCharCount, {
            fontSize: styles.fontSizeXs,
            backgroundColor: styles.colors.bgLighter,
            padding: "2px 6px",
            borderRadius: "10px"
        });
        textPanelHeaderCharCount.textContent = `${selectedText.length} chars (original)`;
        textPanelHeader.appendChild(textPanelHeaderCharCount);
        textPanel.appendChild(textPanelHeader);

        textArea = document.createElement("textarea"); // Assign to the global 'textArea'
        applyStyles(textArea, {
            flexGrow: "1",
            overflowY: "auto",
            padding: styles.padding,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            color: styles.colors.textDim, // Dim color for editable text, can be changed
            lineHeight: "1.6",
            backgroundColor: styles.colors.bgDark,
            border: "none",
            outline: "none",
            resize: "vertical", // Allow vertical resize
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "inherit",
            fontSize: styles.fontSizeSm
        });
        textArea.value = selectedText; // Set initial text
        textPanel.appendChild(textArea);
        popup.appendChild(textPanel);

        // --- Middle Panel: AI Selection List ---
        const aiSelectionPanel = document.createElement("div");
        applyStyles(aiSelectionPanel, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${styles.colors.border}`,
            overflow: "hidden",
            backgroundColor: "#2a3748" // Specific background for this panel
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

        const defaultAiName = "ChatGPT (Temp Chat)"; // Preferred default AI
        const defaultAiIndex = aiOptions.findIndex(ai => ai.name === defaultAiName);

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
            aiItemUrlDiv.textContent = aiItem.url.replace("https://", "").split("/")[0]; // Display base domain
            aiItemTextDiv.appendChild(aiItemUrlDiv);

            aiItemInnerDiv.appendChild(aiItemTextDiv);
            aiItemElement.appendChild(aiItemInnerDiv);

            aiItemElement.onmouseover = () => {
                if (selectedAi !== aiItem) { // Only change if not already selected
                    aiItemElement.style.backgroundColor = styles.colors.hoverBg;
                }
            };
            aiItemElement.onmouseout = () => {
                if (selectedAi !== aiItem) { // Revert if not selected
                    aiItemElement.style.backgroundColor = styles.colors.bgDark;
                }
            };
            aiItemElement.onclick = () => {
                if (selectedAiElement) { // Deselect previous
                    selectedAiElement.style.backgroundColor = styles.colors.bgDark;
                    selectedAiElement.style.borderColor = "transparent";
                    selectedAiElement.style.boxShadow = "none";
                }
                selectedAi = aiItem;
                selectedAiElement = aiItemElement;
                // Apply selected styles
                selectedAiElement.style.backgroundColor = styles.colors.selectedBg;
                selectedAiElement.style.borderColor = styles.colors.selectedBorder;
                selectedAiElement.style.boxShadow = `0 0 0 2px ${styles.colors.selectedBorder}`;

                if (selectedAiDisplay) { // Update the display in the actions panel
                    selectedAiDisplay.textContent = ''; // Clear previous
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

                // Enable action buttons
                if (detailedButton) { detailedButton.style.opacity = "1"; detailedButton.style.cursor = "pointer"; }
                if (simpleButton) { simpleButton.style.opacity = "1"; simpleButton.style.cursor = "pointer"; }
                if (translateButton) { translateButton.style.opacity = "1"; translateButton.style.cursor = "pointer"; }
                console.log("AI Selected:", aiItem.name);
            };
            aiListContainer.appendChild(aiItemElement);

            // Auto-select the default AI (or the first one if default not found)
            const effectiveDefaultIndex = defaultAiIndex !== -1 ? defaultAiIndex : 0;
            if (index === effectiveDefaultIndex) {
                setTimeout(() => aiItemElement.click(), 0); // Use setTimeout to ensure DOM is ready
            }
        });
        aiSelectionPanel.appendChild(aiListContainer);
        popup.appendChild(aiSelectionPanel);

        // --- Right Panel: Processing Options & Actions ---
        const actionsPanel = document.createElement("div");
        applyStyles(actionsPanel, {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#2a3748" // Specific background for this panel
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

        selectedAiDisplay = document.createElement("div"); // Assign to global 'selectedAiDisplay'
        applyStyles(selectedAiDisplay, {
            marginBottom: "1.5rem",
            fontSize: styles.fontSizeSm,
            color: styles.colors.textDim
        });
        selectedAiDisplay.textContent = "No AI selected"; // Initial text
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

        // Detailed Format Button
        detailedButton = document.createElement("div"); // Assign to global 'detailedButton'
        applyStyles(detailedButton, {
            backgroundColor: styles.colors.bgDark,
            padding: styles.padding,
            borderRadius: "0.5rem",
            border: `1px solid ${styles.colors.border}`,
            marginBottom: "0.75rem",
            cursor: "not-allowed", // Initially disabled
            opacity: "0.6",        // Dimmed when disabled
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

        // Simple Summary Button
        simpleButton = document.createElement("div"); // Assign to global 'simpleButton'
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

        // Translate Button
        translateButton = document.createElement("div"); // Assign to global 'translateButton'
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

        // Spacer to push manual copy button to the bottom
        const spacerDiv = document.createElement("div");
        applyStyles(spacerDiv, { flexGrow: "1" });
        actionsContainer.appendChild(spacerDiv);

        // Manual Copy Section
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
        manualCopyButton.onclick = () => {
            if (!selectedAi) { // Though this button doesn't open an AI, context might be useful
                alert("Please select an AI first to ensure context is relevant (though this button copies locally).");
                // Or simply proceed if AI selection is not strictly necessary for this button's primary function.
                // For now, let's keep the check for consistency.
                // return;
            }
            const sourceUrl = window.location.href;
            const contextPrefix = `The text was taken from the url \`${sourceUrl}\`\n Here is the text to analyze:\n\n`;
            const currentText_manual = textArea.value; // Get current text from textarea
            const text_manual = `${detailedPrompt}\n\n${contextPrefix}${currentText_manual}`; // Using detailedPrompt as default for manual copy
            navigator.clipboard.writeText(text_manual)
                .then(() => {
                    alert("Detailed format prompt + EDITED text (with URL) copied to clipboard!");
                })
                .catch(error => {
                    alert("Failed to copy automatically. See console for details.");
                    console.error("Manual copy failed:", error);
                });
        };
        // Add the manual copy button to the manual copy container
        manualCopyContainer.appendChild(manualCopyButton);
        // Add the manual copy container (with the manual copy button) to the actions container
        actionsContainer.appendChild(manualCopyContainer);

        // Add the actions container (with all the AI buttons and the manual copy button) to the actions panel
        actionsPanel.appendChild(actionsContainer);
        // Add the actions panel (with all the AI buttons and the manual copy button) to the popup
        popup.appendChild(actionsPanel);

        // Add the fully constructed popup to the page body
        document.body.appendChild(popup);
        console.log("AI Selector Popup created.");

    } catch (error) {
        console.error("Bookmarklet error:", error);
        alert("Error executing bookmarklet: " + error.message);
        // Attempt to clean up if an error occurs during setup
        const popupToRemove = document.getElementById(popupId);
        const overlayToRemove = document.getElementById(overlayId);
        if (popupToRemove) popupToRemove.remove();
        if (overlayToRemove) overlayToRemove.remove();
    }
})();


// Bookmarklet creation instructions:
// Options:
// 1) Use a bookmarklet generator like https://caiorss.github.io/bookmarklet-maker/
// 2) Use a LLM prompt to minify the code i.e. "Format the following as a single line chrome bookmarklet"
//    With a LLM  The key prompt is "minify the following code to a single line chrome bookmarklet"
// 3) Use https://www.toptal.com/developers/javascript-minifier