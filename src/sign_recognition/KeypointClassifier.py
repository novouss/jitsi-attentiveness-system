import csv
import copy
import itertools
import cv2 as cv
import numpy as np

import mediapipe as mp
import tensorflow as tf

from src.jitsi_app.constants import *

mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    max_num_hands = 1,
    min_detection_confidence = 0.8,
    min_tracking_confidence = 0.5,
)

class KeypointClassifier(object):
    def __init__(self, model_path, class_path, num_threads=1):

        self.interpreter = tf.lite.Interpreter(model_path=model_path, num_threads=num_threads)

        with open(class_path) as file:
            self.class_labels = csv.reader(file)
            self.class_labels = [row[0] for row in self.class_labels]

        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    def __call__(self, video_frame):

        # frame = cv.imread(video_frame, 1)
        _, encoded_img = cv.imencode('.png', video_frame)
        decoded_img = cv.imdecode(encoded_img, cv.IMREAD_ANYCOLOR)
        
        frame = cv.flip(decoded_img, 1)
        image = copy.deepcopy(decoded_img)
        frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)

        results = hands.process(frame)

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                landmarks = self.calc_landmarks(image, hand_landmarks)
                # print(landmarks)

                pre_processed_landmark_list = self.pre_process_landmark(landmarks)
                # print(pre_processed_landmark_list)

                hand_orientation = self.process_handedness(handedness)
                # print(hand_orientation)

            sign_id = self.result([hand_orientation] + pre_processed_landmark_list)
            return self.class_labels[sign_id]
        
        return 'Hand undetected'

    def calc_landmarks(self, image, hand_landmarks):
        w, h = image.shape[1], image.shape[0]
        
        landmark_points = []

        for _, landmark in enumerate(hand_landmarks.landmark):
            x = min(int(landmark.x * w), w - 1)
            y = min(int(landmark.y * h), h - 1)

            landmark_points.append([x, y])

        return landmark_points

    def pre_process_landmark(self, landmark_list):
        temp_landmark_list = copy.deepcopy(landmark_list)

        base_x, base_y = 0, 0
        for index, landmark in enumerate(temp_landmark_list):
            if index == 0:
                base_x, base_y = landmark[0], landmark[1]

            temp_landmark_list[index][0] = temp_landmark_list[index][0] - base_x
            temp_landmark_list[index][1] = temp_landmark_list[index][1] - base_y

        temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
        max_value = max(list(map(abs, temp_landmark_list)))

        temp_landmark_list = list(map(lambda n: n/max_value, temp_landmark_list))

        return temp_landmark_list
    
    def process_handedness(self, handedness):
        return 0 if handedness.classification[0].label == 'Left' else 1

    def result(self, landmark_list):
        input_details_tensor_index = self.input_details[0]['index']
        self.interpreter.set_tensor(input_details_tensor_index, np.array([landmark_list], dtype=np.float32))
        self.interpreter.invoke()

        output_details_tensor_index = self.output_details[0]['index']

        result = self.interpreter.get_tensor(output_details_tensor_index)

        result_index = np.argmax(np.squeeze(result))

        return result_index