from flask import Flask, render_template, jsonify
import json
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/art')
def art():
    return render_template('art.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route("/get_questions")
def get_questions():
    with open("static/Images/questions.json") as f:
        data = json.load(f)
    return jsonify(data)

@app.route("/get_art_data")
def get_art_data():
    with open("static/Images/art-data.json") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)