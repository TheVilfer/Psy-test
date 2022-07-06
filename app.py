from flask import Flask, request, render_template, jsonify, send_file
import words_generator
import get_statistic
from flaskext.markdown import Markdown

from os import listdir
from os.path import isfile, join

PUBLIC_DIR = 'public'

app = Flask(__name__)

config_path = 'config_v3.xlsx'
dfs = words_generator.load_dfs(config_path)
settings = words_generator.get_settings(dfs[0])
target_words = words_generator.get_target_words(dfs[1])
distracting_words = words_generator.get_distracting_words(dfs[1])

total_words = settings['words_count']

# Подключает библиотеку парсинга md файлов
Markdown(app)

# Генерирует html из md и отдает главную страничку
@app.route('/')
def index():
    info = open("info.md", "r", encoding="utf-8").read()
    return render_template("index.html", info=info)

# Отдает страничку с админкой
@app.route('/admin')
def admin():
    return render_template("admin.html")

# Отдает страничку с демкой кнопок
@app.route('/demo')
def demo():
    return render_template("demo.html")


 # Расставляет заголовки от ответов
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                            'Content-Type,Authorization')
    response.headers.add(
        'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

#
@app.route('/getCorrectWords', methods=['GET'])
def get_correct_words():
    round_index = request.args.get('round')
    round_index = int(round_index)
    correctWords = words_generator.get_correct_words(round_index, target_words)
    d = {'words': correctWords}
    return jsonify(d)

#
@app.route('/getWordsArray', methods=['GET'])
def get_words_array():
    round_index = request.args.get('round')
    round_index = int(round_index)
    # print("GET ALL WORDS OF:", round_index)
    roundWords = words_generator.get_round_words(round_index, dfs[1])
    # print("ALL WORDS:", roundWords)
    d = {'words': roundWords}
    return jsonify(d)

#
@app.route('/getNotification', methods=['GET'])
def get_notification_data():
    round_index = request.args.get('round')
    round_index = int(round_index)
    notificationData = words_generator.get_notification_info(round_index, dfs[1])
    return jsonify(notificationData)

#
@app.route('/sendWords', methods=['POST'])
def hello():
    get_statistic.get_statistic(request.json)
    return jsonify(request.json)

#
@app.route('/getFiles')
def get_files():
    files = [f for f in listdir(PUBLIC_DIR) if isfile(join(PUBLIC_DIR, f))]
    files_with_href = []
    for file in files:
        h = "download?file=" + PUBLIC_DIR + '/' + file
        files_with_href.append([file, h])
    d = {'files': files_with_href}
    return jsonify(d)

#
@app.route('/download', methods=['GET'])
def download_file():
    path = request.args.get('file')
    return send_file(path, as_attachment=True)