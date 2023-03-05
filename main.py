
import csv

import mediapipe as mp

from flask import Flask, request, render_template

from src.jitsi_app import jitsi_app
from src.jitsi_app.constants import *

from src.sign_recognition import KeypointClassifier

app = Flask(__name__,
            template_folder=TEMPLATES_FOLDER,
            static_folder=STATIC_FOLDER)

sign_recognition = KeypointClassifier(model_name=MODEL, class_path=MODEL_CLASS)

@app.route('/')
@app.route('/index')
def jitsi_app():
    return render_template('jitsi.html')

@app.route('/get_sign', methods=['GET', 'POST'])
def get_sign():
    pass