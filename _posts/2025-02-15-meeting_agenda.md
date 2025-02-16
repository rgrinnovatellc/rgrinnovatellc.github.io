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

  details {
    margin-bottom: 10px;
    border: 1px solid white;
    padding: 10px;
  }

  summary {
    cursor: pointer;
    font-weight: bold;
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

<h2>Research Notes</h2>

{% assign notes = site.posts | sort: 'date' %}

{% for note in notes %}
{% assign note_date = note.date | date: "%Y-%m-%d" %}
{% assign current_date = 'now' | date: "%Y-%m-%d" %}

  <details {% if note_date == current_date %}open{% endif %} data-date="{{ note_date }}">
    <summary>{{ note.date | date: "%B %d, %Y" }}</summary>
    <div id="htmlView_{{ note.date | date: '%Y%m%d' }}"></div>
    <textarea id="markdownEditor_{{ note.date | date: '%Y%m%d' }}" style="display: none;">{{ note.content }}</textarea>
    <button onclick="toggleEditMode('{{ note.date | date: '%Y%m%d' }}')">Edit</button>
  </details>
{% endfor %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js"></script>
<script>
  const converter = new showdown.Converter();

  function renderMarkdown(id) {
    const markdownEditor = document.getElementById(`markdownEditor_${id}`);
    const htmlView = document.getElementById(`htmlView_${id}`);
    htmlView.innerHTML = converter.makeHtml(markdownEditor.value);
  }

  function toggleEditMode(id) {
    const markdownEditor = document.getElementById(`markdownEditor_${id}`);
    const htmlView = document.getElementById(`htmlView_${id}`);

    if (markdownEditor.style.display === "none") {
      markdownEditor.style.display = "block";
      htmlView.style.display = "none";
    } else {
      markdownEditor.style.display = "none";
      htmlView.style.display = "block";
      renderMarkdown(id);
    }
  }

  document.querySelectorAll("details").forEach((detail) => {
    const id = detail.getAttribute("data-date").replace(/-/g, "");
    renderMarkdown(id);
  });
</script>
