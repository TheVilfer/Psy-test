import pandas as pd
import words_generator
import xlsxwriter
import datetime
import io
import telebot
bot = telebot.TeleBot("5111191996:AAGI53jKayeQSrjMcRW8-BZqW1HN_Uhewp4")


output = io.BytesIO()
config_path = 'config_v2.xlsx'
dfs = words_generator.load_dfs(config_path)
settings = words_generator.get_settings(dfs[0])
target_words = words_generator.get_target_words(dfs[1])
distracting_words = words_generator.get_distracting_words(dfs[1])


def get_statistic(data):
    name = data['mainInfo']['name']
    years = data['mainInfo']['years']
    operating_system = data['mainInfo']['os']

    info_column_names = ["Имя", "Полных лет", "Операционная система"]
    info_df = pd.DataFrame(columns=info_column_names)
    info_df.loc[0] = [name, years, operating_system]

    rounds_column_names = ["Проба", "not_p", "not_type", "Общее время","Время появления уведомления","Время нажатия на уведомление", "Количество целевых слов до уведомления", "Цель 1 ДО", "Цель 2 ДО", "Цель 3 ДО", "Количество целевых слов после уведомления", "Цель 1 ПОСЛЕ", "Цель 2 ПОСЛЕ", "Цель 3 ПОСЛЕ", "Дистракторы до уведомления", "Дистракторы после уведомления"]
    rounds_df = pd.DataFrame(columns=rounds_column_names)

    for i in range(len(data['rounds'])):
        round_index = int(data['rounds'][i]['roundIndex'])
        selected_words_before = data['rounds'][i]['selectedWordsBefore']
        selected_words_after = data['rounds'][i]['selectedWordsAfter']
        correct_words = words_generator.get_correct_words(round_index, target_words)
        not_pa = "p" if data['rounds'][i]['notifType'] != "none" else "n"
        not_type = data['rounds'][i]['notifType']

        all_words = data['rounds'][i]['allWords']
        correct_words_before_tmp = []
        correct_words_after_tmp = []
        seconds = data['rounds'][i]['seconds'] + 1
        notifTimeClicked = seconds - data['rounds'][i]['notifTimeClicked']
        notifTimeClicked = abs(notifTimeClicked)
        if notifTimeClicked == 30:
            notifTimeClicked = 0
        notifTime = data['rounds'][i]['notifTime']
        for word in selected_words_before:
            if word in correct_words:
                correct_words_before_tmp.append(word)
        for word in selected_words_after:
            if word in correct_words:
                correct_words_after_tmp.append(word)

        correct_words_bofore_len = len(correct_words_before_tmp)
        correct_words_after_len = len(correct_words_after_tmp)

        correct_words_before_counter = {
            'distract': 0
        }
        correct_words_after_counter = {
            'distract': 0
        }

        for correct_word in correct_words:
            correct_words_before_counter[correct_word] = 0
            correct_words_after_counter[correct_word] = 0

        for selected_word in selected_words_before:
            if selected_word in correct_words_before_counter:
                correct_words_before_counter[selected_word] += 1
            else:
                correct_words_before_counter['distract'] += 1
        
        for selected_word in selected_words_after:
            if selected_word in correct_words_after_counter:
                correct_words_after_counter[selected_word] += 1
            else:
                correct_words_after_counter['distract'] += 1

        targets_before = []
        targets_after = []
        for key in correct_words_before_counter:
            if key != 'distract':
                targets_before.append(correct_words_before_counter[key])
        
        for key in correct_words_after_counter:
            if key != 'distract':
                targets_after.append(correct_words_after_counter[key])

        rounds_df.loc[i] = [round_index,not_pa,not_type,seconds, notifTime, notifTimeClicked, correct_words_bofore_len, targets_before[0], targets_before[1], targets_before[2],correct_words_after_len, targets_after[0], targets_after[1], targets_after[2],correct_words_before_counter['distract'] ,correct_words_after_counter['distract']]

    file_path = 'public/' + name + ' ' + str(datetime.datetime.now()) + '.xlsx'

    writer = pd.ExcelWriter(file_path, engine='xlsxwriter')
    writerTelegram = pd.ExcelWriter(output, engine='xlsxwriter')

    info_df.to_excel(writer, sheet_name='Справка')
    rounds_df.to_excel(writer, sheet_name='Пробы')

    info_df.to_excel(writerTelegram, sheet_name='Справка')
    rounds_df.to_excel(writerTelegram, sheet_name='Пробы')

    tab_select = data['poll']['tabSelect']
    notification_select = data['poll']['notificationSelect']
    stir_select = data['poll']['stirSelect']
    irritation_select = data['poll']['irritationSelect']
    different_select = data['poll']['differentSelect']
    irritation_type_1_select = data['poll']['irritationType1Select']
    irritation_type_2_select = data['poll']['irritationType2Select']
    irritation_type_3_select = data['poll']['irritationType3Select']
    irritation_type_4_select = data['poll']['irritationType4Select']
    irritation_type_5_select = data['poll']['irritationType5Select']


    pull_column_names = ["Вопрос", "Ответ"]
    pull_df = pd.DataFrame(columns=pull_column_names)

    pull_df.loc[0] = ['Сколько вкладок у вас было открыто во время эксперимента?', tab_select]
    pull_df.loc[1] = ['Замечали ли Вы уведомления во время выполнения задания?', notification_select]
    pull_df.loc[2] = ['Считаете ли Вы, что эти уведомления мешали выполнению основного задания?', stir_select]
    pull_df.loc[3] = ['Чувствовали ли Вы раздражение из-за уведомлений? Оцените по шкале от 0 до 5, где 0 – не было раздражения, 5 – очень раздражало', irritation_select]
    pull_df.loc[4] = ['Заметили ли Вы разницу между уведомления по способу их появления?', different_select]
    pull_df.loc[5] = ['Уведомление плавно возникало снизу вверх', irritation_type_1_select]
    pull_df.loc[6] = ['Уведомление просто появлялось без лишней анимации', irritation_type_2_select]
    pull_df.loc[7] = ['Уведомление появлялось и мигало', irritation_type_3_select]
    pull_df.loc[8] = ['Уведомление становилось непрозрачным', irritation_type_4_select]
    pull_df.loc[9] = ['Уведомление появлялось в нижней центральной части экрана, затем перемещалось вправо ', irritation_type_5_select]


    pull_df.to_excel(writer, sheet_name='Опрос')
    pull_df.to_excel(writerTelegram, sheet_name='Опрос')

    writer.save()
    writerTelegram.save()
    bot.send_document(185697637, open(file_path,'rb'))


