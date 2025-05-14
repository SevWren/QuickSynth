javascript:(function(){
	const storiesSection=document.querySelector('section.all-stories');
	if(!storiesSection){
		alert('No stories section found on the page.');
		return;
	}
	let result='';
	const storyBoxes=storiesSection.querySelectorAll('div.col-12.col-sm-6.col-lg-4.all-stories__box');
	storyBoxes.forEach(box=>{
		const category=box.querySelector('h4.title.border-bottom').textContent.trim();
		if(category==='Entertainment'||category==='Sports'){
			return;
		}
		const links=box.querySelectorAll('a.all-stories__link-box');
		links.forEach(link=>{
			const title=link.textContent.trim();
			const url=link.href;
			result+=`Article Title - ${title}\nArticle Url - ${url}\n\n`; // Replace \n with actual line breaks
		});
	});
	if(result){
		const textarea=document.createElement('textarea');
		textarea.value='\nSystem:\nYour role is to act as an intelligent web article processor and summarizer.\nThis prompt contains a list of news articles. Each article entry is formatted as:\nArticle Title - [Title of the article]\nArticle Url - [Full URL of the article]\n\nThe list of articles for you to process is provided below, following these instructions.\n\nYour task is to perform the following steps for EACH article URL found in the list below:\n1.  Identify the "Article Url".\n2.  Access this URL using your web browsing tool.\n3.  Internally retrieve the full source text or main content of the article from the accessed page. *Do not output this full text directly to the user.*\n4.  Based on the entire retrieved content, generate a brief and concise summary of the article. This summary should capture the main points and core message of the article (e.g., aim for 2-4 sentences).\n5.  Present the generated summary clearly. You should preface each summary with the original "Article Title" and "Article Url" for easy identification.\n\nIt is crucial that you iterate through ALL "Article Url" entries provided in the list below. Continue processing until every URL in that list has been attempted and its summary (or an error note) provided.\nIf a URL is inaccessible, or content retrieval fails for any reason, state this for the specific article (e.g., "Could not retrieve content for [Article Title] - [Article Url]: [Reason for failure if known]") and then move on to process the next URL in the list. Your goal is to provide a summary for every successfully processed article.\n\n--- ARTICLE DATA BEGINS BELOW ---\n' + result; // Ensure proper line breaks in the result
		document.body.appendChild(textarea);
		textarea.select();
		try{
			document.execCommand('copy');
			alert('Article data copied to clipboard!');
		}catch(err){
			alert('Failed to copy data to clipboard. Please try again.');
			console.error('Copy error:',err);
		}
		document.body.removeChild(textarea);
	}else{
		alert('No articles found to copy.');
	}
})();