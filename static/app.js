const wordsUrl = 'getWordsArray';
const correctWordsUrl = 'getCorrectWords';
const uploadUrl = 'sendWords';
const notificationUrl = 'getNotification';
// const TIME1 = 10;
// const TIME2 = 5;

let ROUNDS = 194;

const TIME1 = 30;
const TIME2 = 5;
const ANIMATION_TYPE = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    "none": ''
};


function setOnClick(elements) {
    for (const elem of elements) {
        elem.addEventListener("click", function () {
            taskClicked(elem);
        });
    }
}

function taskClicked(elem) {
    if (window.isNotificationShowed) {
        elem.classList.add("task-selected--after-notification");
        return;
    }
    elem.classList.add("task-selected");
}

function setTimer(timers, iteration) {
    console.log("Iteration:", iteration);

    let round = Math.floor(iteration / 2);
    let randomSeconds = randomInteger(13, 17);
    let seconds = timers[iteration].time;
    console.log("SECONDS ROUND:", seconds);

    window.notificationClicked = false;
    window.isNotificationShowed = false;
    let notificationRound;
    let secondsTmp = -20;

    getNotificationData(window.rounds[round]).then(res => {
        notificationRound = res;
        console.log("Is have Notif:", notificationRound.isHaveNotification, "Notif type:", notificationRound.notificationType, "№ Rounds: ", window.rounds[round], "Notif time in ", randomSeconds);
    });
    let timer = setInterval(function () {
        let timerElem = timers[iteration].elem;
        if (Math.floor(seconds) >= 13 && Math.floor(seconds) <= randomSeconds && notificationRound.isHaveNotification) {
            showNotification(notificationRound.notificationType);
            window.isNotificationShowed = true;
            notificationRound.isHaveNotification = false;
        }
        if (window.notificationClicked) {
            window.notificationClicked = false;
            window.notificationClickedTime = seconds;
        }
        if (window.doneGame == true) {
            window.doneGame = false;

            if (((iteration % 2) == 0) != true) {
                secondsTmp = timers[iteration].time - seconds;
                seconds = -1;
            }

            // secondsTmp = timers[iteration].time - seconds;
            // seconds = -1;

        }
        if (seconds <= -1) {
            clearInterval(timer);

            if ((iteration + 1) < timers.length) {
                setTimer(timers, iteration + 1);
                switchCard();
                if ((iteration % 2) == 0) {
                    console.log("Switch to game");
                    cleanSelectedWords();
                    let correctWordsElem = document.getElementById('words-container');
                    console.log("Rounds (set correct word of):", round);
                    if ((round + 1) < ROUNDS) {
                        setCorrectWords(correctWordsElem, window.rounds[round + 1]);
                    }

                } else {
                    let data = collectData(window.rounds[round], randomSeconds, notificationRound.notificationType);
                    if (secondsTmp == -20) {
                        secondsTmp = timers[iteration].time;
                    }
                    data['seconds'] = secondsTmp - 1;
                    console.log(data);
                    window.gameStatistic["rounds"].push(data);

                    // postData(data);
                    let wordsElems = document.getElementsByClassName('task');
                    setWords(wordsElems, window.rounds[round + 1]);
                    console.log("Switch to time");
                }
                // console.log(timerElem.id);
            } else {
                let data = collectData(window.rounds[round], randomSeconds, notificationRound.notificationType);
                if (secondsTmp == -20) {
                    secondsTmp = timers[iteration].time;
                }
                data['seconds'] = secondsTmp - 1;
                window.gameStatistic["rounds"].push(data);
                // postData();
                console.log("finish");
                let container = document.getElementById('finish-container')
                container.classList.remove('close');
                container.classList.add('open');
            }

            let data = collectData(window.rounds[round + 1], randomSeconds, notificationRound.notificationType);
            // console.log(data);
            // postData(data);
        } else {
            timerElem.innerHTML = seconds;
        }
        seconds = seconds - 0.01;
    }, 10);
}

function showNotification(animationType) {
    toastr.options = {
        "closeButton": true,
        "debug": true,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "0",
        "extendedTimeOut": "0",
    };
    toastr.options.showEasing = 'linear';
    if (animationType == 1) {
        toastr.options.showMethod = 'slideDown';
    }
    if (animationType == 2) {
        toastr.options.showEasing = "easeOutQuad";
        toastr.options.showMethod = 'show';
        toastr.options.showDuration = "100";
    }
    if (animationType == 4) {
        toastr.options.showMethod = 'fadeIn';
    }
    toastr.options.onclick = function () {
        window.notificationClicked = true;
    };
    toastr.options.onShown = function () {
        if (animationType == 3) {
            document.querySelector("#toast-container").classList.add("blink");
        }
        if (animationType == 5) {
            document.querySelector("#toast-container").classList.add("moved");
        }
    };
    toastr.info('');
    return 0;
}

function generateTimers() {
    const timerElem1 = document.getElementById('timer-text-1');
    const timerElem2 = document.getElementById('timer-text-2');
    let roundsArray = [];
    for (i = 0; i < ROUNDS; i++) {
        if (i % 2 == 0) {
            timeObj = {
                elem: timerElem2,
                time: TIME2
            }
        } else {
            timeObj = {
                elem: timerElem1,
                time: TIME1
            }
        }
        roundsArray.push(timeObj);
    }
    return roundsArray;
}

function pushTimers() {
    let timers = generateTimers();
    setTimer(timers, 0);

}

function getWords(roundIndex) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                resolve(res);
            } else {
                console.warn('request_error');
            }
        };
        let url = wordsUrl + '?round=' + roundIndex.toString()
        xhr.open('GET', url);
        xhr.send();
    });
}

function getCorrectWords(roundIndex) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                resolve(res);
            } else {
                console.warn('request_error');
            }
        };
        let url = correctWordsUrl + '?round=' + roundIndex.toString();
        xhr.open('GET', url);
        xhr.send();
    });
}

function getNotificationData(roundIndex) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                resolve(res);
            } else {
                console.warn('request_error');
            }
        };
        let url = notificationUrl + '?round=' + roundIndex.toString();
        xhr.open('GET', url);
        xhr.send();
    });
}

function setWords(wordsElems, roundIndex) {
    wordsElems = shuffle(wordsElems);
    getWords(roundIndex).then(res => {
        let words = res.words;
        let i = 0;
        for (const elem of wordsElems) {
            elem.innerHTML = words[i];
            i++;
        }
    })
}

function setCorrectWords(wordsElem, roundIndex) {
    getCorrectWords(roundIndex).then(res => {
        let words = res.words;
        let i = 0;
        wordsElem.innerHTML = '';
        for (const word of words) {
            wordsElem.innerHTML += "<p>" + word + "</p>";
            i++;
        }
    })
}

function collectData(r, notifTime, notifType) {
    let wordsElems = document.getElementsByClassName('task-selected');
    let wordsElemAfter = document.getElementsByClassName('task-selected--after-notification');
    let notificationClickedTime = window.notificationClickedTime;
    window.notificationClickedTime = 0;
    let words = [];
    let wordsAfter = [];
    for (const elem of wordsElems) {
        words.push(elem.innerHTML);
    }
    for (const elem of wordsElemAfter) {
        wordsAfter.push(elem.innerHTML);
    }

    wordsElems = document.getElementsByClassName('task');
    let words_getted = [];
    for (const elem of wordsElems) {
        words_getted.push(elem.innerHTML);
    }

    wordsElems = document.getElementById('words-container');
    wordsElemsP = wordsElems.getElementsByTagName("p");
    // console.log(wordsElemsP);
    let words_correct = [];
    for (const elem of wordsElemsP) {
        words_correct.push(elem.innerHTML);
    }


    let data = {
        selectedWordsBefore: words,
        selectedWordsAfter: wordsAfter,
        allWords: words_getted,
        correctWords: words_correct,
        roundIndex: r,
        notifTime: notifTime,
        notifType: notifType,
        notifTimeClicked: notificationClickedTime

    };
    return data;
}

function postData() {
    let data = window.gameStatistic;
    var xhr = new XMLHttpRequest();
    console.log(data);
    xhr.open("POST", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
        }
    };
    data = JSON.stringify(data);
    xhr.send(data);
}

function switchCard() {
    let wordsTask = document.getElementById("words-task");
    let mainContainer = document.getElementById("main-container");

    wordsTask.classList.toggle("close");
    wordsTask.classList.toggle("open");

    mainContainer.classList.toggle("open");
    mainContainer.classList.toggle("close");

    toastr.clear();
}


function cleanSelectedWords() {
    let wordsElems = document.getElementsByClassName('task');
    for (const elem of wordsElems) {
        elem.classList.remove("task-selected");
        elem.classList.remove("task-selected--after-notification");
    }
}

function loadMainInfo() {
    if (window.gameStarted == false) {
        let inputName = document.getElementById('input-name');
        let inputYears = document.getElementById('input-years');

        let name = inputName.value;
        let years = inputYears.value;

        if (name.length != 0 && years.length != 0) {
            let detectedOS = "Unknown OS";
            if (navigator.appVersion.indexOf("Mac") != -1)
                detectedOS = "MacOS";
            if (navigator.appVersion.indexOf("Win") != -1)
                detectedOS = "Windows";
            if (navigator.appVersion.indexOf("Linux") != -1)
                detectedOS = "Linux";
            window.gameStatistic['mainInfo'] = {
                "name": name,
                "years": years,
                "os": detectedOS
            }

            let container = document.getElementById('input-container');
            let wordsTask = document.getElementById("words-task");
            container.classList.remove('open');
            container.classList.add('close');
            wordsTask.classList.toggle("close");
            console.log(window.gameStatistic);
            pushTimers();
        }
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function finishBtn() {
    if (window.upload == false) {
        let tabSelect = document.getElementById('tab-select').value;
        let notificationSelect = document.getElementById('notification-select').value;
        let hardSelect = document.getElementById('hard-select').value;
        let noteSelect = document.getElementById('note-select').value;
        let note2Select = document.getElementById('note-2-select').value;

        let poll = {
            'tabSelect': tabSelect,
            'notificationSelect': notificationSelect,
            'hardSelect': hardSelect,
            'noteSelect': noteSelect,
            'note2Select': note2Select
        }

        window.gameStatistic["poll"] = poll;
        postData();
        console.log(window.gameStatistic);
        window.upload = true;

        document.getElementById('real-finish').innerHTML = 'Вот теперь точно все! Код: kovriki21';

    }

}

window.onload = function () {

    let selectTabs = document.getElementById('tab-select');
    for (i = 2; i <= 100; i++) {
        selectTabs.innerHTML += `<option value="${i}">${i}</option>`;
    }

    window.rounds = [];
    window.isNotificationShowed = false;


    for (let i_1 = 1; i_1 <= (ROUNDS / 2); i_1++) {
        window.rounds.push(i_1);
    }
    shuffle(window.rounds);

    console.log("ROUNDS ARRAY:",window.rounds);

    window.gameStatistic = {
        "mainInfo": null,
        "rounds": []
    };
    let mainInfoBtn = document.getElementById('main-info-btn');
    window.gameStarted = false;

    mainInfoBtn.addEventListener("click", function () {
        loadMainInfo();
        window.gameStarted = true;
    });

    let wordsElems = document.getElementsByClassName('task');
    let correctWordsElem = document.getElementById('words-container');
    setOnClick(wordsElems);
    setWords(wordsElems, window.rounds[0]);
    setCorrectWords(correctWordsElem, window.rounds[0]);


    // pushTimers();

    window.doneGame = false;
    window.upload = false;
    document.addEventListener('keydown', function (event) {
        if (event.code == 'Space') {
            window.doneGame = true;
        }
    });

}