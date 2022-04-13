from flask import Flask, request, render_template, jsonify, send_file
import words_generator
import get_statistic

from os import listdir
from os.path import isfile, join

PUBLIC_DIR = 'public'

# if __name__ == '__main__':
app = Flask(__name__)

config_path = 'config_v2.xlsx'
dfs = words_generator.load_dfs(config_path)
settings = words_generator.get_settings(dfs[0])
target_words = words_generator.get_target_words(dfs[1])
distracting_words = words_generator.get_distracting_words(dfs[1])

total_words = settings['words_count']


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/admin')
def admin():
    return render_template("admin.html")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                            'Content-Type,Authorization')
    response.headers.add(
        'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@app.route('/getCorrectWords', methods=['GET'])
def get_correct_words():
    round_index = request.args.get('round')
    round_index = int(round_index)
    print("GET CORRECT WORDS OF", round_index)
    correctWords = words_generator.get_correct_words(round_index, target_words)
    print("CORRECT WORDS:", correctWords)
    d = {'words': correctWords}
    return jsonify(d)

@app.route('/getWordsArray', methods=['GET'])
def get_words_array():
    round_index = request.args.get('round')
    round_index = int(round_index)
    print("GET ALL WORDS OF:", round_index)
    roundWords = words_generator.get_round_words(round_index, dfs[1])
    print("ALL WORDS:", roundWords)
    d = {'words': roundWords}
    return jsonify(d)

@app.route('/getNotification', methods=['GET'])
def get_notification_data():
    round_index = request.args.get('round')
    round_index = int(round_index)
    print("GET NOTIFICATION DATA OF:", round_index)
    notificationData = words_generator.get_notification_info(round_index, dfs[1])
    print("DATA:", notificationData)
    return jsonify(notificationData)

@app.route('/sendWords', methods=['POST'])
def hello():
    get_statistic.get_statistic(request.json)
    return jsonify(request.json)

@app.route('/getFiles')
def get_files():
    files = [f for f in listdir(PUBLIC_DIR) if isfile(join(PUBLIC_DIR, f))]
    files_with_href = []
    for file in files:
        h = "download?file=" + PUBLIC_DIR + '/' + file
        files_with_href.append([file, h])
    d = {'files': files_with_href}
    return jsonify(d)

@app.route('/download', methods=['GET'])
def download_file():
    path = request.args.get('file')
    return send_file(path, as_attachment=True)

# app.run(debug=True, host='194.67.113.25', port=5000)
# app.run(debug=True, host='localhost', port=5000)