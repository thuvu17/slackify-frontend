# Slackify - Your workout playlist companion 🏃🎵💪
Slackify is a web application designed to enhance your workout experience by generating personalized song and playlist recommendations based on your mood, the BPM (beats per minute)/tempo of your treadmill run, and the length of your workout. With Slackify, you can effortlessly find the perfect music to keep you motivated and in sync with your fitness routine.

This includes all frontend codes for Slackify using React.

# Slackify Menu Front-end
Our demo-frontend that currently runs on http://localhost:3000

# Local Setup
1. Clone this repository with git clone
2. Download Node.js
3. Move (cd slackify-frontend) into the repo folder and install the dependencies with npm install:
    * `npm install axios`
    * `npm install react-router-dom`
4. From the back-end run `$ pip install -U flask-cors`
```
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"
```
5. Run the project with npm start

### About Us
- Yongwen Lei
- Quan Phung
- Thu Vu
- Joy Zhu
