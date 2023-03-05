import csv
import copy
import itertools

import cv2 as cv
import numpy as np
import mediapipe as mp

import KeypointClassifier

min_detection_confidence = 0.8
min_tracking_confidence = 0.5

max_hands = 1 

mp_hands = mp.solutions.hands

keypoint_classifier = KeypointClassifier()

hands = mp_hands.Hands(
    max_num_hands = max_hands,
    min_detection_confidence = min_detection_confidence,
    min_tracking_confidence = min_tracking_confidence
)

with open('datasets/classes.csv') as file:
    keypoint_classifier_labels = csv.reader(file)
    keypoint_classifier_labels = [row[0] for row in keypoint_classifier_labels]

def main():
    cap = cv.VideoCapture(0)
    mode = 0

    while cap.isOpened():
        
        ret, frame = cap.read()

        if not ret:
            break

        key = cv.waitKey(10)
        if key == 27:
            break        

        number, mode = select_mode(key, mode)

        frame = cv.flip(frame, 1)
        debug_image = copy.deepcopy(frame)

        frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        
        frame.flags.writeable = False
        results = hands.process(frame)
        frame.flags.writeable = True

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):

                brect = calc_bounding_rect(debug_image, hand_landmarks)
                landmarks = calc_landmarks(debug_image, hand_landmarks)
                # print(landmarks)

                pre_processed_landmark_list = pre_process_landmark(landmarks)
                # print(pre_processed_landmark_list)
                
                hand_orientation = process_handedness(handedness)
                # print(hand_orientation)
                
                logging_csv(number, mode, hand_orientation, pre_processed_landmark_list)

                # hand_sign_id = keypoint_classifier(pre_processed_landmark_list)
                hand_sign_id = keypoint_classifier([hand_orientation] + pre_processed_landmark_list)

                debug_image = draw_debug_tool(
                    debug_image, 
                    mode, 
                    landmarks,
                    brect, 
                    keypoint_classifier_labels[hand_sign_id]
                )

        debug_image = draw_debug(debug_image, mode, number)
        cv.imshow('gesture_recognition.ipynb', debug_image)

    cap.release()
    cv.destroyAllWindows()

def calc_bounding_rect(image, hand_landmarks):
    width, height = image.shape[1], image.shape[0]

    landmark_array = np.empty((0, 2), int)

    for landmark in hand_landmarks.landmark:
        landmark_x = min(int(landmark.x * width), width - 1)
        landmark_y = min(int(landmark.y * height), height - 1)

        landmark_point = [np.array((landmark_x, landmark_y))]

        landmark_array = np.append(landmark_array, landmark_point, axis = 0)

    x, y, w, h = cv.boundingRect(landmark_array)
    return [x, y, x + w, y + h]

def calc_landmarks(image, hand_landmarks):
    w, h = image.shape[1], image.shape[0]
    
    landmark_points = []

    for _, landmark in enumerate(hand_landmarks.landmark):
        x = min(int(landmark.x * w), w - 1)
        y = min(int(landmark.y * h), h - 1)

        landmark_points.append([x, y])

    return landmark_points

def pre_process_landmark(landmark_list):
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

def process_handedness(handedness):
    return 0 if handedness.classification[0].label == 'Left' else 1

def logging_csv(number, mode, handedness, landmark_list):
    
    if mode == 0:
        pass
    
    if mode == 1 and (0 <= number <= 9):
        csv_path = 'datasets/keypoint.csv'

        with open(csv_path, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([number, handedness, *landmark_list])
    
    return

def select_mode(key, mode):

    number = -1
    if ord('0') <= key <= ord('9'):
        number = key - ord('0')

    if key == ord('n'):
        mode = 0

    if key == ord('r'):
        mode = 1

    if key == ord('d'):
        mode = 2

    return number, mode

def draw_landmarks(image, points):
    # Refer to https://mediapipe.dev/images/mobile/hand_landmarks.png for hand landmark guidelines
    if len(points) < 0:
        return image
    
    # MediaPipe was trained on 21 points, it would be very unnecessary making it dynamic. -Raymond

    # cv.line(image, x, y, color(RGB), thickness)
    cv.line(image, tuple(points[1]), tuple(points[2]), (255, 255, 255), 2)
    cv.line(image, tuple(points[2]), tuple(points[3]), (255, 255, 255), 2)
    cv.line(image, tuple(points[3]), tuple(points[4]), (255, 255, 255), 2)
    # cv.line(image, tuple(points[4]), tuple(points[5]), (255, 255, 255), 2)
    cv.line(image, tuple(points[5]), tuple(points[6]), (255, 255, 255), 2)
    cv.line(image, tuple(points[6]), tuple(points[7]), (255, 255, 255), 2)
    cv.line(image, tuple(points[7]), tuple(points[8]), (255, 255, 255), 2)
    # cv.line(image, tuple(points[8]), tuple(points[9]), (255, 255, 255), 2)
    cv.line(image, tuple(points[9]), tuple(points[10]), (255, 255, 255), 2)
    cv.line(image, tuple(points[10]), tuple(points[11]), (255, 255, 255), 2)
    cv.line(image, tuple(points[11]), tuple(points[12]), (255, 255, 255), 2)
    # cv.line(image, tuple(points[12]), tuple(points[13]), (255, 255, 255), 2)
    cv.line(image, tuple(points[13]), tuple(points[14]), (255, 255, 255), 2)
    cv.line(image, tuple(points[14]), tuple(points[15]), (255, 255, 255), 2)
    cv.line(image, tuple(points[15]), tuple(points[16]), (255, 255, 255), 2)
    # cv.line(image, tuple(points[16]), tuple(points[17]), (255, 255, 255), 2)
    cv.line(image, tuple(points[17]), tuple(points[18]), (255, 255, 255), 2)
    cv.line(image, tuple(points[18]), tuple(points[19]), (255, 255, 255), 2)
    cv.line(image, tuple(points[19]), tuple(points[20]), (255, 255, 255), 2)

    cv.line(image, tuple(points[0]), tuple(points[1]), (255, 255, 255), 2)
    cv.line(image, tuple(points[0]), tuple(points[5]), (255, 255, 255), 2)
    cv.line(image, tuple(points[0]), tuple(points[17]), (255, 255, 255), 2)
    
    cv.line(image, tuple(points[5]), tuple(points[9]), (255, 255, 255), 2)
    cv.line(image, tuple(points[9]), tuple(points[13]), (255, 255, 255), 2)
    cv.line(image, tuple(points[13]), tuple(points[17]), (255, 255, 255), 2)

    return image

def draw_points(image, points):

    for point in points:
        # cv.circle(image, point(center), radius, color, thickness)
        cv.circle(image, (point[0], point[1]), 5, (255, 255, 255), -1)
        cv.circle(image, (point[0], point[1]), 5, (0, 0, 0), 1)

    return image

def draw_bounding_rect(image, brect):

    cv.rectangle(image, (brect[0], brect[1]), (brect[2], brect[3]), (0, 0, 0), 2)

    return image

def draw_hand_sign(image, hand_sign_text):
    info_box = ""

    if hand_sign_text != "":
        info_box = hand_sign_text
    
    cv.putText(image, info_box, (10, 130), cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    return image

def draw_information_box(image, brect, hand_sign_text):
    
    cv.rectangle(image, (brect[0], brect[1]), (brect[2], brect[1] - 22), (0, 0, 0), -1)
    cv.putText(image, hand_sign_text, (brect[0] + 5, brect[1] - 4), cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

    return image

def draw_debug(image, mode, number):

    if mode == 1:
        cv.putText(image, "Recording...", (4, 20), cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        if 0 <= number <= 9:
            cv.putText(image, "NUM: " + str(number), (10, 110), cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

    return image

def draw_debug_tool(image, mode, landmarks, brect, hand_sign_text = None):

    if mode == 1 or mode == 2:

        image = draw_landmarks(image, landmarks)
        image = draw_points(image, landmarks)
        image = draw_bounding_rect(image, brect)
        image = draw_information_box(image, brect, hand_sign_text)

    return image

if __name__ == '__main__':
    main()
    