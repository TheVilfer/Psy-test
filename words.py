import random
from flask import jsonify


def get_correct_words():
    return ['1', '2', '3']


def get_words():
    return ['Привет', 'Пока', 'Тест']


def words_generator():
    words_writer = get_words() + get_correct_words()
    words = []
    for i in range(210):
        words.append(random.choice(words_writer))
    return words
