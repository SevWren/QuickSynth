(function() {
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
            selectedBg: "rgba(67, 105, 155, 0.5)",
            hoverBg: "#4b5563",
        },
        padding: "1rem",
        paddingSmall: "0.5rem",
        borderRadius: "0.75rem",
        fontSizeLg: "1.125rem",
        fontSizeBase: "1rem",
        fontSizeSm: "0.875rem",
        fontSizeXs: "0.75rem"
    };
    STYLES.colors.selectedBorder = STYLES.colors.accent;


    function applyStyles(element, stylesToApply) {
        for (const property in stylesToApply) {
            element.style[property] = stylesToApply[property];
        }
    }

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
        const uniqueCategories = new Set(); // Use a Set to store unique category names

        const categoryBoxes = storiesSection.querySelectorAll('div.col-12.col-sm-6.col-lg-4.all-stories__box');
        categoryBoxes.forEach(categoryBox => {
            const categoryTitleEl = categoryBox.querySelector('h4.title.border-bottom');
            if (!categoryTitleEl) return;

            const categoryTitle = categoryTitleEl.textContent.trim();
            if (categoryTitle === 'Entertainment' || categoryTitle === 'Sports') {
                return;
            }
            uniqueCategories.add(categoryTitle); // Add to Set for the filter list

            const articleLinks = categoryBox.querySelectorAll('a.all-stories__link-box');
            articleLinks.forEach(link => {
                const title = link.textContent.trim();
                const url = link.href;
                if (title && url) {
                    articlesData.push({
                        title,
                        url,
                        category: categoryTitle, // Store the category with each article
                        include: true,
                        id: `article-entry-${articlesData.length}`
                    });
                }
            });
        });


        if (articlesData.length === 0) {
            alert('No relevant articles found to select.');
            return;
        }


        function closePopup() {
            const popup = document.getElementById(POPUP_ID);
            const overlay = document.getElementById(OVERLAY_ID);
            if (popup) popup.remove();
            if (overlay) overlay.remove();
            console.log("Popup closed.");
        }

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

        const popup = document.createElement("div");
        popup.id = POPUP_ID;
        applyStyles(popup, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "95vh",
            backgroundColor: STYLES.colors.bgDark,
            color: STYLES.colors.text,
            borderRadius: STYLES.borderRadius,
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: "2147483646",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif"
        });

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "×";
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

        const contentArea = document.createElement("div");
        applyStyles(contentArea, {
            flexGrow: "1",
            overflowY: "auto",
            padding: STYLES.padding
        });

        // --- Category Filter Section (Left Panel Logic) ---
        const categoriesSection = document.createElement("div"); // This section will hold the filter UI
        applyStyles(categoriesSection, {
            marginBottom: STYLES.padding // Space between filter and article list sections
        });

        const categoriesFilterHeaderH4 = document.createElement("h4");
        applyStyles(categoriesFilterHeaderH4, {
            fontSize: STYLES.fontSizeBase,
            fontWeight: "600",
            color: STYLES.colors.textDim,
            marginBottom: STYLES.paddingSmall,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: `1px solid ${STYLES.colors.border}`,
            paddingBottom: STYLES.paddingSmall
        });
        categoriesFilterHeaderH4.textContent = "Filter by Category";
        categoriesSection.appendChild(categoriesFilterHeaderH4);

        // Create filter checkboxes from uniqueCategories
        const sortedUniqueCategories = Array.from(uniqueCategories).sort(); // Sort for display

        sortedUniqueCategories.forEach(categoryName => {
            const categoryItem = document.createElement("div");
            applyStyles(categoryItem, {
                display: "flex",
                alignItems: "center",
                padding: `${STYLES.paddingSmall} 0`
            });

            const categoryCheckbox = document.createElement("input");
            categoryCheckbox.type = "checkbox";
            categoryCheckbox.checked = true;
            const categoryId = `category-checkbox-${categoryName.replace(/\W/g, '_')}`;
            categoryCheckbox.id = categoryId;
            applyStyles(categoryCheckbox, {
                marginRight: STYLES.paddingSmall,
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: STYLES.colors.accent
            });

            categoryCheckbox.onchange = (e) => {
                const isChecked = e.target.checked;
                articlesData.forEach(article => {
                    if (article.category === categoryName) {
                        const articleCheckboxElement = document.getElementById(`checkbox-for-${article.id}`);
                        const articleLabelElement = document.querySelector(`label[for='checkbox-for-${article.id}']`);
                        const articleItemDiv = document.getElementById(`item-for-${article.id}`);

                        if (articleItemDiv) {
                            articleItemDiv.style.display = isChecked ? "flex" : "none";
                        }
                        if (articleCheckboxElement) {
                            articleCheckboxElement.checked = isChecked ? articlesData.find(a => a.id === article.id).include : false;
                            articleCheckboxElement.disabled = !isChecked;
                        }
                        if (articleLabelElement) {
                            articleLabelElement.style.opacity = isChecked ? "1" : "0.6";
                        }
                    }
                });
                updateArticleListCategoryHeadersVisibility();
            };

            const categoryLabel = document.createElement("label");
            categoryLabel.htmlFor = categoryId;
            categoryLabel.textContent = categoryName;
            applyStyles(categoryLabel, {
                flexGrow: "1",
                fontSize: STYLES.fontSizeSm,
                fontWeight: "500",
                cursor: "pointer",
                color: STYLES.colors.text
            });

            categoryItem.appendChild(categoryCheckbox);
            categoryItem.appendChild(categoryLabel);
            categoriesSection.appendChild(categoryItem);
        });
        contentArea.appendChild(categoriesSection); // Add the filter section to the main content area


        // --- Articles List Section (Right Panel Logic) ---
        const articlesPanelHeaderH4 = document.createElement("h4");
        applyStyles(articlesPanelHeaderH4, {
            fontSize: STYLES.fontSizeBase,
            fontWeight: "600",
            color: STYLES.colors.textDim,
            marginTop: STYLES.padding,
            marginBottom: STYLES.paddingSmall,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: `1px solid ${STYLES.colors.border}`,
            paddingBottom: STYLES.paddingSmall
        });
        articlesPanelHeaderH4.textContent = "Articles";
        contentArea.appendChild(articlesPanelHeaderH4);

        const articlesListArea = document.createElement("div");

        // Group articles by category for rendering
        const articlesByCategory = articlesData.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        function createArticleDOMItem(article) {
            const articleItem = document.createElement("div");
            articleItem.id = `item-for-${article.id}`;
            articleItem.classList.add('article-list-item');
            articleItem.setAttribute('data-category', article.category);

            applyStyles(articleItem, {
                display: "flex",
                alignItems: "center",
                padding: STYLES.paddingSmall,
                marginBottom: STYLES.paddingSmall,
                borderRadius: "0.25rem",
                border: `1px solid ${STYLES.colors.border}`,
                backgroundColor: article.include ? STYLES.colors.selectedBg : STYLES.colors.bgLighter
            });
            articleItem.onmouseover = () => { if (!checkbox.checked) articleItem.style.backgroundColor = STYLES.colors.hoverBg; };
            articleItem.onmouseout = () => { if (!checkbox.checked) articleItem.style.backgroundColor = STYLES.colors.bgLighter; };

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = article.include;
            checkbox.id = `checkbox-for-${article.id}`;
            applyStyles(checkbox, {
                marginRight: STYLES.paddingSmall,
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: STYLES.colors.accent
            });
            checkbox.onchange = (e) => {
                const dataIndex = articlesData.findIndex(a => a.id === article.id);
                if (dataIndex > -1) {
                    articlesData[dataIndex].include = e.target.checked;
                }
                articleItem.style.backgroundColor = e.target.checked ? STYLES.colors.selectedBg : STYLES.colors.bgLighter;
            };

            const label = document.createElement("label");
            label.htmlFor = `checkbox-for-${article.id}`;
            label.textContent = article.title;
            applyStyles(label, {
                flexGrow: "1",
                fontSize: STYLES.fontSizeSm,
                cursor: "pointer",
                color: STYLES.colors.text
            });

            articleItem.appendChild(checkbox);
            articleItem.appendChild(label);
            return articleItem;
        }

        // Use sortedUniqueCategories to ensure headers are in the same order as the filter list
        sortedUniqueCategories.forEach((categoryName, idx) => {
            const categoryHeaderEl = document.createElement("h5");
            categoryHeaderEl.id = `articles-category-header-${categoryName.replace(/\W/g, '_')}`;
            categoryHeaderEl.setAttribute('data-original-category-name', categoryName); // Store original name
            categoryHeaderEl.classList.add('article-list-category-header');
            applyStyles(categoryHeaderEl, {
                color: STYLES.colors.text,
                fontSize: STYLES.fontSizeSm,
                fontWeight: "bold",
                marginTop: idx === 0 ? STYLES.paddingSmall : '1.25rem',
                marginBottom: "0.25rem",
                paddingTop: STYLES.paddingSmall,
                paddingBottom: STYLES.paddingSmall,
                paddingLeft: STYLES.paddingSmall,
                borderBottom: `1px solid ${STYLES.colors.border}`,
                backgroundColor: STYLES.colors.bgDarker
            });
            categoryHeaderEl.textContent = categoryName;
            articlesListArea.appendChild(categoryHeaderEl);

            if (articlesByCategory[categoryName]) {
                articlesByCategory[categoryName].forEach(article => {
                    const articleItemDOM = createArticleDOMItem(article);
                    articlesListArea.appendChild(articleItemDOM);
                });
            }
        });
        contentArea.appendChild(articlesListArea);
        popup.appendChild(contentArea);

        function updateArticleListCategoryHeadersVisibility() {
            const allCategoryHeaders = articlesListArea.querySelectorAll('.article-list-category-header');
            allCategoryHeaders.forEach(header => {
                const originalCategoryName = header.getAttribute('data-original-category-name');
                if (!originalCategoryName) {
                     console.warn("Header missing data-original-category-name:", header.id);
                    return;
                }
                 // Escape special characters like " & / for use in CSS attribute selector
                const escapedCategoryName = originalCategoryName.replace(/["\\]/g, '\\$&');

                const articlesForThisCategory = Array.from(
                    articlesListArea.querySelectorAll(`.article-list-item[data-category="${escapedCategoryName}"]`)
                );
                const isAnyArticleVisible = articlesForThisCategory.some(item => item.style.display === 'flex');
                header.style.display = isAnyArticleVisible ? 'block' : 'none';
            });
        }


        const footer = document.createElement("div");
        applyStyles(footer, {
            padding: STYLES.padding,
            backgroundColor: STYLES.colors.bgDarker,
            borderTop: `1px solid ${STYLES.colors.border}`,
            flexShrink: "0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        });

        const selectionControls = document.createElement("div");
        const selectAllButton = document.createElement("button");
        selectAllButton.textContent = "Select All";
        applyStyles(selectAllButton, {
            backgroundColor: STYLES.colors.bgLighter,
            color: STYLES.colors.text,
            border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`,
            borderRadius: "0.3rem",
            fontSize: STYLES.fontSizeSm,
            cursor: "pointer",
            marginRight: STYLES.paddingSmall
        });
        selectAllButton.onmouseover = () => selectAllButton.style.backgroundColor = STYLES.colors.hoverBg;
        selectAllButton.onmouseout = () => selectAllButton.style.backgroundColor = STYLES.colors.bgLighter;
        selectAllButton.onclick = () => {
            articlesData.forEach(article => {
                const articleCheckbox = document.getElementById(`checkbox-for-${article.id}`);
                const articleItem = document.getElementById(`item-for-${article.id}`);
                if (articleCheckbox && !articleCheckbox.disabled) { 
                    article.include = true;
                    articleCheckbox.checked = true;
                    if (articleItem) articleItem.style.backgroundColor = STYLES.colors.selectedBg;
                }
            });
        };

        const selectNoneButton = document.createElement("button");
        selectNoneButton.textContent = "Select None";
        applyStyles(selectNoneButton, {
            backgroundColor: STYLES.colors.bgLighter,
            color: STYLES.colors.text,
            border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`,
            borderRadius: "0.3rem",
            fontSize: STYLES.fontSizeSm,
            cursor: "pointer"
        });
        selectNoneButton.onmouseover = () => selectNoneButton.style.backgroundColor = STYLES.colors.hoverBg;
        selectNoneButton.onmouseout = () => selectNoneButton.style.backgroundColor = STYLES.colors.bgLighter;
        selectNoneButton.onclick = () => {
            articlesData.forEach(article => {
                const articleCheckbox = document.getElementById(`checkbox-for-${article.id}`);
                const articleItem = document.getElementById(`item-for-${article.id}`);
                if (articleCheckbox && !articleCheckbox.disabled) { 
                    article.include = false;
                    articleCheckbox.checked = false;
                    if (articleItem) articleItem.style.backgroundColor = STYLES.colors.bgLighter;
                }
            });
        };
        selectionControls.appendChild(selectAllButton);
        selectionControls.appendChild(selectNoneButton);
        footer.appendChild(selectionControls);

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy Selected to Clipboard";
        applyStyles(copyButton, {
            backgroundColor: STYLES.colors.accent,
            color: STYLES.colors.bgDarker,
            border: "none",
            padding: `${STYLES.paddingSmall} ${STYLES.padding}`,
            borderRadius: "0.5rem",
            fontSize: STYLES.fontSizeBase,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.2s ease"
        });
        copyButton.onmouseover = () => copyButton.style.backgroundColor = STYLES.colors.selectedBorder;
        copyButton.onmouseout = () => copyButton.style.backgroundColor = STYLES.colors.accent;
        copyButton.onclick = () => {
            let resultText = '';
            const selectedArticles = articlesData.filter(article => {
                const itemDiv = document.getElementById(`item-for-${article.id}`);
                return itemDiv && itemDiv.style.display !== 'none' && article.include;
            });


            if (selectedArticles.length === 0) {
                alert("No articles selected to copy (or all selected articles are hidden by filters).");
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

**Restraint**: You MUST NOT use wikipedia.org in any shape or form.

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

        updateArticleListCategoryHeadersVisibility();


    } catch (e) {
        console.error("Bookmarklet error:", e);
        alert("Error executing bookmarklet: " + e.message);
        const popup = document.getElementById(POPUP_ID);
        const overlay = document.getElementById(OVERLAY_ID);
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }
})();