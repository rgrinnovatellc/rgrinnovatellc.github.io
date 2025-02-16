---
layout: default
title: "Uddhav Ph.D Research Agenda"
---

<style>
  body {
    background-color: black;
    color: white;
    font-family: Arial, sans-serif;
  }

  textarea {
    background-color: #222;
    color: white;
    width: 100%;
    height: 200px;
    border: 1px solid white;
    padding: 10px;
  }

  button {
    background-color: #444;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  button:hover {
    background-color: #666;
  }

  #htmlView {
    border: 1px solid white;
    padding: 10px;
  }
</style>

<button id="toggleView">View</button>
<button id="toggleEdit" style="display: none;">Edit</button>

<div id="htmlView"></div>
<textarea id="markdownEditor" style="display: none;">{% raw %}
## 📌 **Follow-Up**
- Email A, B, C
- Share Drafts A, B, C  
{% endraw %}</textarea>

<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js"></script>
<script>
  const markdownEditor = document.getElementById("markdownEditor");
  const htmlView = document.getElementById("htmlView");
  const toggleView = document.getElementById("toggleView");
  const toggleEdit = document.getElementById("toggleEdit");

  const converter = new showdown.Converter();

  function renderMarkdown() {
    htmlView.innerHTML = converter.makeHtml(markdownEditor.value);
  }

  toggleView.addEventListener("click", () => {
    markdownEditor.style.display = "none";
    htmlView.style.display = "block";
    toggleView.style.display = "none";
    toggleEdit.style.display = "inline";
    renderMarkdown();
  });

  toggleEdit.addEventListener("click", () => {
    markdownEditor.style.display = "block";
    htmlView.style.display = "none";
    toggleEdit.style.display = "none";
    toggleView.style.display = "inline";
  });

  // Render initially
  renderMarkdown();
</script>
