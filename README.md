# Portfolio

## 📖 **Overview**
A minimalist portfolio website showcasing my artwork, game projects, and resume. A fixed side rail links to About, Resume, Projects, Artwork (Mixed Media / Traditional Media), and Contact, and each artwork opens in a lightbox with its medium, size, and date.

## **Project Structure**
	•	/site — the live website (index.html, css/, js/, assets/).
	•	/site/js/artworks.js — artwork list; add a piece here and drop its image in site/assets/images/artwork/.
	•	app.py — Flask app that serves /site (old page URLs like /art redirect to the matching section).
	•	requirements.txt, Procfile — Python dependencies and the gunicorn start command for hosting.
	•	/archive/terminal-site — the previous terminal-style version of the site, kept for reference (not served).

## **Running Locally**
	pip install -r requirements.txt
	python app.py

Then open http://127.0.0.1:5000. The site is plain HTML/CSS/JS, so site/index.html also works opened directly in a browser.

## **Technologies Used**
	•	Flask + gunicorn (serving)
	•	HTML, CSS, JavaScript (frontend)

## **Contact**

Feel free to reach out via email for questions or suggestions: yishanlin.studio@gmail.com
