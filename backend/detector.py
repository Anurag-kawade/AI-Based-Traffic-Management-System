import cv2 as cv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

WEIGHTS = os.path.join(BASE_DIR, "yolov4-tiny.weights")
CFG = os.path.join(BASE_DIR, "yolov4-tiny.cfg")
CLASSES = os.path.join(BASE_DIR, "classes.txt")


def detect_cars(video_path):
    CONF = 0.5
    NMS = 0.4

    # Load classes
    with open(CLASSES) as f:
        class_names = [c.strip() for c in f.readlines()]

    # Load model
    net = cv.dnn.readNet(WEIGHTS, CFG)

    # ✅ CPU mode (IMPORTANT for Mac)
    net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
    net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)

    model = cv.dnn_DetectionModel(net)
    model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

    cap = cv.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error opening video:", video_path)
        return 0

    total_cars = 0
    frames = 0
    skip = 5
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % skip != 0:
            continue

        classes_ids, scores, boxes = model.detect(frame, CONF, NMS)

        car_count = 0
        for cid in classes_ids:
            label = class_names[int(cid)]

            if label in ["car", "truck", "bus"]:
                car_count += 1

        total_cars += car_count
        frames += 1

    cap.release()

    if frames == 0:
        return 0

    return int(total_cars / frames)