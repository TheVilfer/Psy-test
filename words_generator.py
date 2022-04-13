import pandas as pd
import random

def load_dfs(file_path):
    settings_df = pd.read_excel(file_path, engine='openpyxl', sheet_name="Общие сведения")
    gridData = pd.read_excel(file_path, engine='openpyxl', sheet_name="Сетка")
    return settings_df, gridData


def get_settings(settings_df):
    words_count = settings_df.iloc[0]['Значение']
    rounds_count = settings_df.iloc[1]['Значение']
    time_remember = settings_df.iloc[2]['Значение']
    time_practice = settings_df.iloc[3]['Значение']

    result_dict = {
        "words_count": words_count,
        "rounds_count": rounds_count,
        "time_remember": time_remember,
        "time_practice": time_practice
    }

    return result_dict


def get_target_words(gridData):
    rounds_words = {}

    for index, row in gridData.iterrows():
        normalized_words = []
        round_index = index
        words = row['target']
        for bad_words in words.split(' '):
            bad_words = bad_words.replace(" ", "")
            bad_words = bad_words.title()
            if (len(bad_words)) != 0:
                normalized_words.append(bad_words)

        rounds_words[round_index] = {
            "normalized_words": normalized_words,
        }

    return rounds_words


def get_notification_info(round_index,gridData):
    notification_info = {}

    # for index, row in gridData.iterrows():
    #     round_index = index
    #     isHaveNotification = True if (row['not_p'] == 'p') else False
    #     notificationType = row['not_type']

    #     notification_info[round_index] = {
    #         "isHaveNotification": isHaveNotification,
    #         "notificationType": notificationType
    #     }
    notificationData = gridData.loc[round_index,'not_pa':'not_type'].values.tolist()
    notification_info = {
        "isHaveNotification": True if (notificationData[0] == 'p') else False,
        "notificationType": notificationData[1]
    }
    return notification_info


def get_distracting_words(gridData):
    words = {}
    # words = unique(unpack(gridData.loc[:,'s91':'s210'].values.tolist())) # Все слова из сетки
    # words = [w.replace(" ", "") for w in words] # Убираем пробелы
    # words = [w.title() for w in words] # Первый символ заглавный
    for index, row in gridData.iterrows():
        round_index = index
        wordData = unique(row['s91':'s210'])
        wordData = [w.replace(" ", "") for w in wordData] # Убираем пробелы
        wordData = [w.title() for w in wordData] # Первый символ заглавный
        
        words[round_index] = wordData
    return words


def get_round_words(round_index,gridData):
    wordData = []
    
    wordData = gridData.loc[round_index,'s1':'s210'].values.tolist()
    random.shuffle(wordData)
    random.shuffle(wordData)
    random.shuffle(wordData)

    return wordData

def get_correct_words(round_index, target_words_dict):
    target = target_words_dict[round_index]['normalized_words']
    return target


# def get_correct_words_percentage(round_index, target_words_dict):
#     target = target_words_dict[round_index]['words_percentage']
#     return target

def unpack(obj: iter):
    for o in obj:
        if isinstance(o, (list, tuple)):
            yield from unpack(o)
        else: yield o

def unique(obj: iter):
    args = []
    for a in obj:
        if a not in args:
            args.append(a)
            yield a

if __name__ == '__main__':
    config_path = 'config_v2.xlsx'
    dfs = load_dfs(config_path)
    settings = get_settings(dfs[0])
    target_words = get_target_words(dfs[1])
    distracting_words = get_distracting_words(dfs[1])

    total_words = settings['words_count']

    get_round_words(2, dfs[1])

