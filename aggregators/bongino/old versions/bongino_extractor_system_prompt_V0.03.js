javascript:(function(){
    // --- Configuration & Style Definitions (from AI Selector) ---
    const POPUP_ID = "bongino-article-selector-popup";
    const OVERLAY_ID = "bongino-article-selector-overlay";
    const STYLES = {
        colors: {
            bgDark: "#1f2937",
            bgDarker: "#111827",
            bgLighter: "#374151",
            border: "#4b5563",
            text: "#f3f4f6",
            textDim: "#9ca3af",
            accent: "#60a5fa",
            selectedBg: "rgba(96, 165, 250, 0.3)", // For selected items if needed elsewhere
            hoverBg: "#4b5563",
            checkboxBorder: "#6b7280", // New for checkboxes
            checkboxCheckedBg: "#60a5fa",
            checkboxCheckmark: "#ffffff",
        },
        padding: "1rem",
        paddingSmall: "0.5rem",
        borderRadius: "0.75rem",
        fontSizeLg: "1.125rem",
        fontSizeBase: "1rem",
        fontSizeSm: "0.875rem",
        fontSizeXs: "0.75rem"
    };

    // --- Helper function to apply styles (from AI Selector) ---
    function applyStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    // --- Main Bookmarklet Logic ---
    try {
        if (document.getElementById(POPUP_ID)) {
            console.log("Bongino Article Selector Popup already exists.");
            return;
        }

        const storiesSection = document.querySelector('section.all-stories');
        if (!storiesSection) {
            alert('No stories section found on the page.');
            return;
        }

        let articlesData = [];
        const categoryBoxes = storiesSection.querySelectorAll('div.col-12.col-sm-6.col-lg-4.all-stories__box');

        categoryBoxes.forEach(categoryBox => {
            const categoryTitleEl = categoryBox.querySelector('h4.title.border-bottom');
            if (!categoryTitleEl) return;
            const categoryTitle = categoryTitleEl.textContent.trim();

            if (categoryTitle === 'Entertainment' || categoryTitle === 'Sports') {
                return;
            }

            const articleLinks = categoryBox.querySelectorAll('a.all-stories__link-box');
            articleLinks.forEach(link => {
                const title = link.textContent.trim();
                const url = link.href;
                if (title && url) {
                    articlesData.push({ title, url, category: categoryTitle, include: true }); // Default to include
                }
            });
        });

        if (articlesData.length === 0) {
            alert('No relevant articles found to select.');
            return;
        }

        // --- UI Creation ---
        function closePopup() {
            const popup = document.getElementById(POPUP_ID);
            const overlay = document.getElementById(OVERLAY_ID);
            if (popup) popup.remove();
            if (overlay) overlay.remove();
            console.log("Popup closed.");
        }

        // Overlay
        const overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        applyStyles(overlay, {
            position: "fixed",
            inset: "0",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: "2147483645",
            backdropFilter: "blur(3px)"
        });
        overlay.onclick = closePopup;
        document.body.appendChild(overlay);

        // Popup Container
        const popup = document.createElement("div");
        popup.id = POPUP_ID;
        applyStyles(popup, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px", // Adjusted max-width
            maxHeight: "85vh", // Use maxHeight
            backgroundColor: STYLES.colors.bgDark,
            color: STYLES.colors.text,
            borderRadius: STYLES.borderRadius,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: "2147483646",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Important for scrolling content
            fontFamily: "Arial, sans-serif"
        });

        // Close Button
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "×"; // Use innerHTML for ×
        applyStyles(closeButton, {
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            color: STYLES.colors.textDim,
            fontSize: "2rem",
            fontWeight: "bold",
            cursor: "pointer",
            lineHeight: "1"
        });
        closeButton.onmouseover = () => closeButton.style.color = STYLES.colors.text;
        closeButton.onmouseout = () => closeButton.style.color = STYLES.colors.textDim;
        closeButton.onclick = closePopup;
        popup.appendChild(closeButton);

        // Header
        const header = document.createElement("div");
        applyStyles(header, {
            padding: STYLES.padding,
            backgroundColor: STYLES.colors.bgDarker,
            borderBottom: `1px solid ${STYLES.colors.border}`,
            flexShrink: "0"
        });
        const headerH3 = document.createElement("h3");
        applyStyles(headerH3, {
            fontSize: STYLES.fontSizeLg,
            fontWeight: "bold",
            margin: "0"
        });
        headerH3.textContent = "Select Articles to Copy";
        header.appendChild(headerH3);
        popup.appendChild(header);

        // Articles List Area (Scrollable)
        const articlesListArea = document.createElement("div");
        applyStyles(articlesListArea, {
            flexGrow: "1",
            overflowY: "auto",
            padding: STYLES.padding
        });

        articlesData.forEach((article, index) => {
            const articleItem = document.createElement("div");
            applyStyles(articleItem, {
                display: "flex",
                alignItems: "center",
                padding: STYLES.paddingSmall,
                marginBottom: STYLES.paddingSmall,
                borderRadius: "0.25rem", // Slightly smaller radius for items
                border: `1px solid ${STYLES.colors.border}`,
                backgroundColor: STYLES.colors.bgLighter
            });

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = article.include;
            checkbox.id = `article-checkbox-${index}`;
            applyStyles(checkbox, { // Basic styling for checkbox visibility
                marginRight: STYLES.paddingSmall,
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: STYLES.colors.accent // Modern way to color checkboxes
            });
            checkbox.onchange = (e) => {
                articlesData[index].include = e.target.checked;
            };

            const label = document.createElement("label");
            label.htmlFor = `article-checkbox-${index}`;
            label.textContent = article.title;
            applyStyles(label, {
                flexGrow: "1",
                fontSize: STYLES.fontSizeSm,
                cursor: "pointer",
                color: STYLES.colors.text
            });

            articleItem.appendChild(checkbox);
            articleItem.appendChild(label);
            articlesListArea.appendChild(articleItem);
        });
        popup.appendChild(articlesListArea);

        // Footer / Action Area
        const footer = document.createElement("div");
        applyStyles(footer, {
            padding: STYLES.padding,
            backgroundColor: STYLES.colors.bgDarker,
            borderTop: `1px solid ${STYLES.colors.border}`,
            flexShrink: "0",
            display: "flex",
            justifyContent: "space-between", // For select all/none and copy
            alignItems: "center"
        });

        const selectionControls = document.createElement("div");
        const selectAllButton = document.createElement("button");
        selectAllButton.textContent = "Select All";
        applyStyles(selectAllButton, {
            backgroundColor: STYLES.colors.bgLighter, color: STYLES.colors.text, border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`, borderRadius: "0.3rem", fontSize: STYLES.fontSizeSm,
            cursor: "pointer", marginRight: STYLES.paddingSmall
        });
        selectAllButton.onmouseover = () => selectAllButton.style.backgroundColor = STYLES.colors.hoverBg;
        selectAllButton.onmouseout = () => selectAllButton.style.backgroundColor = STYLES.colors.bgLighter;
        selectAllButton.onclick = () => {
            articlesData.forEach(a => a.include = true);
            articlesListArea.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        };

        const selectNoneButton = document.createElement("button");
        selectNoneButton.textContent = "Select None";
        applyStyles(selectNoneButton, {
            backgroundColor: STYLES.colors.bgLighter, color: STYLES.colors.text, border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`, borderRadius: "0.3rem", fontSize: STYLES.fontSizeSm,
            cursor: "pointer"
        });
        selectNoneButton.onmouseover = () => selectNoneButton.style.backgroundColor = STYLES.colors.hoverBg;
        selectNoneButton.onmouseout = () => selectNoneButton.style.backgroundColor = STYLES.colors.bgLighter;
        selectNoneButton.onclick = () => {
            articlesData.forEach(a => a.include = false);
            articlesListArea.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        };
        selectionControls.appendChild(selectAllButton);
        selectionControls.appendChild(selectNoneButton);
        footer.appendChild(selectionControls);


        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy Selected to Clipboard";
        applyStyles(copyButton, {
            backgroundColor: STYLES.colors.accent,
            color: STYLES.colors.bgDarker, // For better contrast on accent
            border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`,
            borderRadius: "0.5rem",
            fontSize: STYLES.fontSizeBase, // Make it stand out
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.2s ease"
        });
        copyButton.onmouseover = () => copyButton.style.backgroundColor = STYLES.colors.selectedBorder; // A bit darker accent
        copyButton.onmouseout = () => copyButton.style.backgroundColor = STYLES.colors.accent;

        copyButton.onclick = () => {
            let resultText = '';
            const selectedArticles = articlesData.filter(article => article.include);

            if (selectedArticles.length === 0) {
                alert("No articles selected to copy.");
                return;
            }

            selectedArticles.forEach(article => {
                resultText += `Article Title - ${article.title}\n`;
                resultText += `Article Url - ${article.url}\n\n`;
            });

            const llmPrompt = `
System:
Your role is to act as an intelligent web article processor and summarizer.
This prompt contains a list of news articles. Each article entry is formatted as:
Article Title - [Title of the article]
Article Url - [Full URL of the article]

The list of articles for you to process is provided below, following these instructions.

Your task is to perform the following steps for EACH article URL found in the list below:
1.  Identify the "Article Url".
2.  Access this URL using your web browsing tool.
3.  Internally retrieve the full source text or main content of the article from the accessed page. *Do not output this full text directly to the user.*
4.  Based on the entire retrieved content, generate a brief and concise summary of the article. This summary should capture the main points and core message of the article (e.g., aim for 2-4 sentences).
5.  Present the generated summary clearly. You should preface each summary with the original "Article Title" and "Article Url" for easy identification.

It is crucial that you iterate through ALL "Article Url" entries provided in the list below. Continue processing until every URL in that list has been attempted and its summary (or an error note) provided.
If a URL is inaccessible, or content retrieval fails for any reason, state this for the specific article (e.g., "Could not retrieve content for [Article Title] - [Article Url]: [Reason for failure if known]") and then move on to process the next URL in the list. Your goal is to provide a summary for every successfully processed article.

--- ARTICLE DATA BEGINS BELOW ---
${resultText}`;

            navigator.clipboard.writeText(llmPrompt.trim())
                .then(() => {
                    alert(`${selectedArticles.length} article(s) data copied to clipboard!`);
                    closePopup();
                })
                .catch(err => {
                    alert('Failed to copy data to clipboard. Please try again or check console.');
                    console.error('Copy error:', err);
                });
        };
        footer.appendChild(copyButton);
        popup.appendChild(footer);

        document.body.appendChild(popup);
        console.log("Bongino Article Selector Popup created.");

    } catch (e) {
        console.error("Bookmarklet error:", e);
        alert("Error executing bookmarklet: " + e.message);
        const popup = document.getElementById(POPUP_ID);
        const overlay = document.getElementById(OVERLAY_ID);
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }
})();