javascript:void(function(){try{const t="ai-selector-popup-unique",o="ai-selector-overlay-unique",e=[{name:"Google Gemini",url:"https://gemini.google.com/app"},{name:"Grok (X)",url:"https://x.com/i/grok"},{name:"ChatGPT (Temp Chat)",url:"https://chatgpt.com/?temporary-chat=true"},{name:"DeepAI Chat",url:"https://deepai.org/chat"},{name:"MS Copilot",url:"https://copilot.microsoft.com/"},{name:"Perplexity",url:"https://www.perplexity.ai/"}],l="Analyze the text internally (don%27t show questions). Create a concise summary:\n- Use simple sentences (split complex ones).\n- Use bullets for key facts/details.\n- Bold the first 2-3 words of new ideas.\n- Retain important clarifying details (scope, caveats).\n- If long, use 2-3 paragraphs.\n- Formatting: **Bold** central theme & key facts/entities. *Italicize* supporting ideas, author%27s purpose, & implications/outcomes.\n- Output ONLY the formatted summary.",n="Summarize the text in 5 bullet points or less and 1 paragraph.",z="Translate the Provided text from the source language to the target language \"English\":",s={colors:{bgDark:"#1f2937",bgDarker:"#111827",bgLighter:"#374151",border:"#4b5563",text:"#f3f4f6",textDim:"#9ca3af",accent:"#60a5fa",selectedBg:"rgba(96, 165, 250, 0.3)",selectedBorder:"#60a5fa",hoverBg:"#4b5563"},padding:"1rem",paddingSmall:"0.5rem",borderRadius:"0.75rem",fontSizeLg:"1.125rem",fontSizeBase:"1rem",fontSizeSm:"0.875rem",fontSizeXs:"0.75rem"};if(document.getElementById(t))return void console.log("AI Selector Popup already exists.");let i="";const c=window.getSelection();if(c&&c.toString().trim().length>0)i=c.toString().trim(),console.log("Using selected text.");else{c.removeAllRanges();const r=document.createRange();r.selectNodeContents(document.body),c.addRange(r),i=c.toString().trim(),c.removeAllRanges(),console.log("Using body text.")}if(!i)return void alert("Could not find text to process. Select text on the page or ensure the page body has text content.");let d=null,a=null,p=null,u=null,selectedAiDisplay=null,q=null,E=null; /* Added E here */ function g(){const e=document.getElementById(t),l=document.getElementById(o);e&&e.remove(),l&&l.remove(),console.log("Popup closed.")}function h(e,t){for(const l in t)e.style[l]=t[l]}function y(t,o){if(!d)return void alert("Please select an AI assistant first.");const sourceUrl=window.location.href;const contextPrefix="The text was taken from the url %60"+sourceUrl+"%60\n Here is the text to analyze:\n\n";const currentText=E.value; /* MODIFIED: Get current text from textarea */ const finalPayload=t+"\n\n"+contextPrefix+currentText; /* MODIFIED: Use currentText */ navigator.clipboard.writeText(finalPayload).then(()=>{console.log(%60Prompt (${o}) + Text copied for ${d.name}. Length: ${finalPayload.length}%60),window.open(d.url,"_blank"),g()}).catch(e=>{console.error("Clipboard write failed:",e),alert("Error copying to clipboard: "+e.message)})}const b=document.createElement("div");b.id=o,h(b,{position:"fixed",inset:"0",backgroundColor:"rgba(0, 0, 0, 0.6)",zIndex:"2147483645",backdropFilter:"blur(3px)"}),b.onclick=g,document.body.appendChild(b);const f=document.createElement("div");f.id=t,h(f,{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"90%",maxWidth:"1000px",height:"80vh",backgroundColor:s.colors.bgDark,color:s.colors.text,borderRadius:s.borderRadius,boxShadow:"0 10px 25px rgba(0,0,0,0.4)",zIndex:"2147483646",display:"flex",flexDirection:"row",overflow:"hidden",fontFamily:"Arial, sans-serif"});const v=document.createElement("button");v.textContent="\u00D7",h(v,{position:"absolute",top:"10px",right:"15px",background:"none",border:"none",color:s.colors.textDim,fontSize:"2rem",fontWeight:"bold",cursor:"pointer",lineHeight:"1"}),v.onmouseover=()=>v.style.color=s.colors.text,v.onmouseout=()=>v.style.color=s.colors.textDim,v.onclick=g,f.appendChild(v);const k=document.createElement("div");h(k,{flex:"1",display:"flex",flexDirection:"column",borderRight:%601px solid ${s.colors.border}%60,overflow:"hidden"});const w=document.createElement("div");h(w,{padding:s.padding,backgroundColor:s.colors.bgDarker,borderBottom:%601px solid ${s.colors.border}%60,flexShrink:"0",display:"flex",justifyContent:"space-between",alignItems:"center"});const wH3=document.createElement("h3");h(wH3,{fontSize:s.fontSizeLg,fontWeight:"bold",margin:"0"}),wH3.textContent="Selected Text",w.appendChild(wH3);const wSpan=document.createElement("span");h(wSpan,{fontSize:s.fontSizeXs,backgroundColor:s.colors.bgLighter,padding:"2px 6px",borderRadius:"10px"}),wSpan.textContent=%60${i.length} chars (original)%60, /* MODIFIED: Clarified char count */ w.appendChild(wSpan),k.appendChild(w);E=document.createElement("textarea"); /* MODIFIED: Changed div to textarea */ h(E,{flexGrow:"1",overflowY:"auto",padding:s.padding,whiteSpace:"pre-wrap",wordWrap:"break-word",color:s.colors.textDim,lineHeight:"1.6",backgroundColor:s.colors.bgDark, /* ADDED: Styling for textarea */ border:"none", /* ADDED */ outline:"none", /* ADDED */ resize:"vertical", /* ADDED: or 'none' */ width:"100%", /* ADDED */ boxSizing:"border-box", /* ADDED */ fontFamily:"inherit", /* ADDED */ fontSize:s.fontSizeSm /* ADDED: Example font size */ }),E.value=i, /* MODIFIED: Use .value for textarea */ k.appendChild(E),f.appendChild(k);const L=document.createElement("div");h(L,{flex:"1",display:"flex",flexDirection:"column",borderRight:%601px solid ${s.colors.border}%60,overflow:"hidden",backgroundColor:"#2a3748"});const x=document.createElement("div");h(x,{padding:s.padding,backgroundColor:s.colors.bgDarker,borderBottom:%601px solid ${s.colors.border}%60,flexShrink:"0"});const xH3=document.createElement("h3");h(xH3,{fontSize:s.fontSizeLg,fontWeight:"bold",margin:"0"}),xH3.textContent="Select AI Assistant",x.appendChild(xH3),L.appendChild(x);const C=document.createElement("div");h(C,{flexGrow:"1",overflowY:"auto",padding:s.paddingSmall});const defaultAiIndex = e.findIndex(ai => ai.name === "ChatGPT (Temp Chat)");e.forEach((aiItem,c)=>{const r=document.createElement("div");h(r,{padding:s.paddingSmall,margin:s.paddingSmall,backgroundColor:s.colors.bgDark,borderRadius:"0.5rem",border:"1px solid transparent",cursor:"pointer",transition:"background-color 0.2s ease, border-color 0.2s ease"});const rInnerDiv=document.createElement("div");h(rInnerDiv,{display:"flex",alignItems:"center"});const rTextDiv=document.createElement("div");h(rTextDiv,{flexGrow:"1"});const rNameDiv=document.createElement("div");h(rNameDiv,{fontWeight:"500",fontSize:s.fontSizeBase}),rNameDiv.textContent=aiItem.name,rTextDiv.appendChild(rNameDiv);const rUrlDiv=document.createElement("div");h(rUrlDiv,{fontSize:s.fontSizeXs,color:s.colors.textDim,marginTop:"2px"}),rUrlDiv.textContent=aiItem.url.replace("https://","").split("/")[0],rTextDiv.appendChild(rUrlDiv),rInnerDiv.appendChild(rTextDiv),r.appendChild(rInnerDiv);r.onmouseover=()=>{d!==aiItem&&(r.style.backgroundColor=s.colors.hoverBg)};r.onmouseout=()=>{d!==aiItem&&(r.style.backgroundColor=s.colors.bgDark)};r.onclick=()=>{a&&(a.style.backgroundColor=s.colors.bgDark,a.style.borderColor="transparent",a.style.boxShadow="none");d=aiItem;a=r;a.style.backgroundColor=s.colors.selectedBg;a.style.borderColor=s.colors.selectedBorder;a.style.boxShadow=%600 0 0 2px ${s.colors.selectedBorder}%60;if(selectedAiDisplay){selectedAiDisplay.textContent = '';const mStrong=document.createElement("strong");h(mStrong,{color:s.colors.accent});mStrong.textContent=aiItem.name;const mSpan=document.createElement("span");h(mSpan,{fontSize:s.fontSizeXs,color:s.colors.textDim});mSpan.textContent=%60 (${aiItem.url.replace("https://","").split("/")[0]})%60;selectedAiDisplay.appendChild(document.createTextNode("Selected: "));selectedAiDisplay.appendChild(mStrong);selectedAiDisplay.appendChild(mSpan);}if(p){p.style.opacity="1";p.style.cursor="pointer";} if(u){u.style.opacity="1";u.style.cursor="pointer";} if(q){q.style.opacity="1";q.style.cursor="pointer";} console.log("AI Selected:",aiItem.name)};C.appendChild(r);const effectiveDefaultIndex = defaultAiIndex !== -1 ? defaultAiIndex : 0; if(c === effectiveDefaultIndex){setTimeout(()=>r.click(),0)}}),L.appendChild(C),f.appendChild(L);const S=document.createElement("div");h(S,{flex:"1",display:"flex",flexDirection:"column",overflow:"hidden",backgroundColor:"#2a3748"});const B=document.createElement("div");h(B,{padding:s.padding,backgroundColor:s.colors.bgDarker,borderBottom:%601px solid ${s.colors.border}%60,flexShrink:"0"});const BH3=document.createElement("h3");h(BH3,{fontSize:s.fontSizeLg,fontWeight:"bold",margin:"0"}),BH3.textContent="Processing Options",B.appendChild(BH3),S.appendChild(B);const T=document.createElement("div");h(T,{flexGrow:"1",display:"flex",flexDirection:"column",padding:s.padding,overflowY:"auto"});selectedAiDisplay=document.createElement("div");h(selectedAiDisplay,{marginBottom:"1.5rem",fontSize:s.fontSizeSm,color:s.colors.textDim});selectedAiDisplay.textContent="No AI selected";T.appendChild(selectedAiDisplay);const D=document.createElement("h4");h(D,{fontSize:s.fontSizeSm,fontWeight:"600",color:s.colors.textDim,marginBottom:s.paddingSmall,textTransform:"uppercase",letterSpacing:"0.05em"}),D.textContent="Prompt Format",T.appendChild(D),p=document.createElement("div"),h(p,{backgroundColor:s.colors.bgDark,padding:s.padding,borderRadius:"0.5rem",border:%601px solid ${s.colors.border}%60,marginBottom:"0.75rem",cursor:"not-allowed",opacity:"0.6",transition:"border-color 0.2s ease, transform 0.1s ease"});const pH5=document.createElement("h5");h(pH5,{fontWeight:"500",fontSize:s.fontSizeBase,margin:"0 0 4px 0"}),pH5.textContent="Detailed Format",p.appendChild(pH5);const pP=document.createElement("p");h(pP,{fontSize:s.fontSizeXs,color:s.colors.textDim,margin:"0"}),pP.textContent="Concise summary with specific formatting.",p.appendChild(pP);p.onmouseover=()=>{if(d){p.style.borderColor=s.colors.accent;p.style.cursor='pointer';}};p.onmouseout=()=>{if(d){p.style.borderColor=s.colors.border;}};p.onclick=()=>{d&&y(l,"Detailed Format")},T.appendChild(p),u=document.createElement("div"),h(u,{backgroundColor:s.colors.bgDark,padding:s.padding,borderRadius:"0.5rem",border:%601px solid ${s.colors.border}%60,marginBottom:"0.75rem",cursor:"not-allowed",opacity:"0.6",transition:"border-color 0.2s ease, transform 0.1s ease"});const uH5=document.createElement("h5");h(uH5,{fontWeight:"500",fontSize:s.fontSizeBase,margin:"0 0 4px 0"}),uH5.textContent="Simple Summary Format",u.appendChild(uH5);const uP=document.createElement("p");h(uP,{fontSize:s.fontSizeXs,color:s.colors.textDim,margin:"0"}),uP.textContent="5 bullets or less + 1 paragraph summary.",u.appendChild(uP);u.onmouseover=()=>{if(d){u.style.borderColor=s.colors.accent;u.style.cursor='pointer';}};u.onmouseout=()=>{if(d){u.style.borderColor=s.colors.border;}};u.onclick=()=>{d&&y(n,"Simple Summary")},T.appendChild(u);q=document.createElement("div"),h(q,{backgroundColor:s.colors.bgDark,padding:s.padding,borderRadius:"0.5rem",border:%601px solid ${s.colors.border}%60,marginBottom:"0.75rem",cursor:"not-allowed",opacity:"0.6",transition:"border-color 0.2s ease, transform 0.1s ease"});const qH5=document.createElement("h5");h(qH5,{fontWeight:"500",fontSize:s.fontSizeBase,margin:"0 0 4px 0"}),qH5.textContent="Translate to English",q.appendChild(qH5);const qP=document.createElement("p");h(qP,{fontSize:s.fontSizeXs,color:s.colors.textDim,margin:"0"}),qP.textContent="Translate source text to English.",q.appendChild(qP);q.onmouseover=()=>{if(d){q.style.borderColor=s.colors.accent;q.style.cursor='pointer';}};q.onmouseout=()=>{if(d){q.style.borderColor=s.colors.border;}};q.onclick=()=>{d&&y(z,"Translate to English")},T.appendChild(q);const I=document.createElement("div");h(I,{flexGrow:"1"}),T.appendChild(I);const A=document.createElement("div");h(A,{paddingTop:s.padding,borderTop:%601px solid ${s.colors.border}%60,marginTop:s.padding});const O=document.createElement("button");h(O,{width:"100%",backgroundColor:s.colors.bgLighter,color:s.colors.text,border:"none",padding:%60${s.paddingSmall} ${s.padding}%60,borderRadius:"0.5rem",fontSize:s.fontSizeSm,cursor:"pointer",textAlign:"center",transition:"background-color 0.2s ease"}),O.textContent="Copy Detailed Prompt + Edited Text Manually", /* MODIFIED Button text */ O.onmouseover=()=>O.style.backgroundColor=s.colors.hoverBg,O.onmouseout=()=>O.style.backgroundColor=s.colors.bgLighter,O.onclick=()=>{if(!d)return void alert("Please select an AI first to determine which prompt to copy.");const sourceUrl=window.location.href;const contextPrefix="The text was taken from the url %60"+sourceUrl+"%60\n Here is the text to analyze:\n\n";const currentText_manual=E.value; /* MODIFIED: Get current text from textarea */ const t_manual=l+"\n\n"+contextPrefix+currentText_manual; /* MODIFIED: Use currentText_manual */ navigator.clipboard.writeText(t_manual).then(()=>{alert("Detailed format prompt + EDITED text (with URL) copied to clipboard!") /* MODIFIED Alert */ }).catch(e=>{alert("Failed to copy automatically. See console for details."),console.error("Manual copy failed:",e)})},A.appendChild(O),T.appendChild(A),S.appendChild(T),f.appendChild(S),document.body.appendChild(f),console.log("AI Selector Popup created.")}catch(e){console.error("Bookmarklet error:",e),alert("Error executing bookmarklet: "+e.message);const l=document.getElementById(t),n=document.getElementById(o);l&&l.remove(),n&&n.remove()}})();