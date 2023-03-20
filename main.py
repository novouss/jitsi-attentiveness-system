
from flask import Flask, request, render_template

# import urllib
import base64
import cv2 as cv
import numpy as np

from src.jitsi_app import jitsi_app
from src.jitsi_app.constants import *

from src.sign_recognition.KeypointClassifier import KeypointClassifier

app = Flask(__name__, template_folder=TEMPLATES_FOLDER, static_folder=STATIC_FOLDER)

sign_recognition = KeypointClassifier(model_path=MODEL, class_path=MODEL_CLASS)

jitsi_application = jitsi_app.JitsiApp()

def url_to_image(url):

	img_data = base64.b64decode(url.split(',')[1])

	img_array = np.frombuffer(img_data, np.uint8)
	image = cv.imdecode(img_array, cv.IMREAD_COLOR)

	return image

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

@app.route('/get_sign_label', methods=['POST'])
def get_sign_label():

	content = {
		'log': 'Unknown Sign',
		'sign_label': None,
		'sign_class': None,
		'status': False,
	}
	
	try:      
		if 'number' in request.form.keys():

			index = int(request.form['number']);
			label = sign_recognition.get_class_labels(index);                        

			content = {
				'log': 'Sign Label Identified',
				'sign_label': label,
				'sign_class': None,
				'status': True,
			}

			return content, HTTP_200_OK

		return content, HTTP_205_RESET_CONTENT
	
	except Exception as e:
		print(str(e))
		content = {
			'log': 'get_sign_label' + str(e),
			'sign_label': None,    
			'sign_class': None,
			'status': False,
		}
		return content, HTTP_205_RESET_CONTENT

@app.route('/get_sign_classification', methods=['GET', 'POST'])
def get_sign_classification():

	content = {
		'log': 'Unknown Sign',
		'sign_label': None,
		'sign_class': None,
		'status': False,
	}
	
	try:

		if 'dataURL_frame' in request.form.keys():
			data_url_frame = request.form['dataURL_frame']
			image = url_to_image(data_url_frame)

			label, index = sign_recognition(image)
			
			content = {
				'log': 'Sign Identified',
				'sign_label': label,
				'sign_class': str(index),
				'status': True,
			}
		
		return content, HTTP_200_OK 
	
	except Exception as e:
		print(str(e))
		content = {
			'log': '[get_sign_classification]' + str(e),
			'sign_label': None,    
			'sign_class': None,
			'status': False,
		}
		return content, HTTP_205_RESET_CONTENT

@app.route('/reset_sign_classification', methods=['GET'])
def reset_sign_classification():

	content = {
		'log': 'Reset correctly performed',
		'sign_label': None,
		'sign_class': None,
		'status': False,
	}

	return content, HTTP_200_OK

if __name__ == '__main__':
	app.run()