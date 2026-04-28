from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from detector import detect_cars
from algo import optimize_traffic

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ✅ ADD THIS ROUTE (IMPORTANT)
@app.route("/")
def home():
    return "Backend is running successfully 🚀"


@app.route("/upload", methods=["POST"])
def upload():
    try:
        files = request.files.getlist("videos")

        print("Files received:", len(files))

        if len(files) != 4:
            return jsonify({"error": "Upload exactly 4 videos"}), 400

        paths = []

        # Save files
        for i, f in enumerate(files):
            path = os.path.join(UPLOAD_FOLDER, f"v{i}.mp4")
            f.save(path)
            paths.append(path)

        print("Saved videos:", paths)

        # Detect cars
        cars = []
        for p in paths:
            count = detect_cars(p)
            cars.append(count)

        print("Cars detected:", cars)

        # Optimize traffic
        signal = optimize_traffic(cars)

        print("Signal:", signal)

        return jsonify({
            "cars": cars,
            "signal": signal
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5001"))
    app.run(host="127.0.0.1", port=port, debug=True)