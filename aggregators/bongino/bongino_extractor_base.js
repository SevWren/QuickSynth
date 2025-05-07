// This script is a bookmarklet designed to extract article titles and URLs from a webpage's "all-stories" section.
// It performs the following steps:
// 1. Selects the section with the class 'all-stories'. If not found, it alerts the user and exits.
// 2. Initializes an empty string to store the extracted data.
// 3. Finds all story boxes within the section, represented by elements with the class 'col-12 col-sm-6 col-lg-4 all-stories__box'.
// 4. Iterates over each story box to:
//    a. Retrieve the category title from the 'h4' element with the class 'title border-bottom'.
//    b. Skip processing if the category is 'Entertainment' or 'Sports'.
//    c. Extract all anchor tags ('a') with the class 'all-stories__link-box'.
//    d. For each anchor tag, retrieve the article title (text content) and URL (href attribute).
//    e. Append the extracted data to the result string in a formatted manner.
// 5. If any data is extracted, creates a temporary <textarea> element, copies the data to the clipboard, and alerts the user.
//    If the copy operation fails, it alerts the user and logs the error to the console.
// 6. If no articles are found, it alerts the user that there is no data to copy.
// This script is designed with the run target url being bonginoreport.com
// todo: manually define all categories

javascript:(function() {
    // Select the all-stories section
    const storiesSection = document.querySelector('section.all-stories');
    if (!storiesSection) {
        alert('No stories section found on the page.');
        return;
    }

    // Initialize result string
    let result = '';

    // Get all story boxes
    const storyBoxes = storiesSection.querySelectorAll('div.col-12.col-sm-6.col-lg-4.all-stories__box');
    
    storyBoxes.forEach(box => {
        // Get category title
        const category = box.querySelector('h4.title.border-bottom').textContent.trim();
        
        // Skip Entertainment and Sports categories
        if (category === 'Entertainment' || category === 'Sports') {
            return;
        }
        
        // Get all anchor tags within the box
        const links = box.querySelectorAll('a.all-stories__link-box');
        
        links.forEach(link => {
            const title = link.textContent.trim();
            const url = link.href;
            
            // Append formatted string
            result += `Article Title - ${title}\nArticle Url - ${url}\n\n`;
        });
    });

    // Copy to clipboard
    if (result) {
        const textarea = document.createElement('textarea');
        textarea.value = `
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
` + result;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Article data copied to clipboard!');
        } catch (err) {
            alert('Failed to copy data to clipboard. Please try again.');
            console.error('Copy error:', err);
        }
        document.body.removeChild(textarea);
    } else {
        alert('No articles found to copy.');
    }
})();