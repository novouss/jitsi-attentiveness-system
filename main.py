
from flask import Flask, request, render_template

from src.jitsi_app import jitsi_app
from src.jitsi_app.constants import *

from src.sign_recognition.KeypointClassifier import KeypointClassifier

app = Flask(__name__, template_folder=TEMPLATES_FOLDER, static_folder=STATIC_FOLDER)

sign_recognition = KeypointClassifier(model_path=MODEL, class_path=MODEL_CLASS)

jitsi_application = jitsi_app.JitsiApp()

@app.after_request
def add_header(r):
    """
    Add header to disable cache
    """

    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

@app.route('/')
@app.route('/index')
def jitsi_app():
    return render_template('jitsi.html')

@app.route('/get_sign_classification', methods=['GET', 'POST'])
def get_sign_classification():

    content = {
        'log': 'Unknown Sign',
        'sign_classification': None,
        'status': False,
    }
    
    try:
        
        if 'dataURL_frame' in request.form.keys():
            data_url_frame = request.form['dataURL_frame']
            classification = sign_recognition(data_url_frame)

            content = {
                'log': 'Sign Identified',
                'sign_classification': classification,
                'status': True,
            }
        return content, HTTP_200_OK 
    
    except Exception as e:
        # print(str(e))
        content = {
            'log': str(e),
            'sign_classification': None,    
            'status': False,
        }
        return content, HTTP_205_RESET_CONTENT

@app.route('/reset_sign_classification', methods=['GET'])
def reset_sign_classification():

    content = {
        'log': 'Reset correctly performed',
        'sign_classification': None,
        'status': False,
    }

    return content, HTTP_200_OK

if __name__ == '__main__':
    app.run()