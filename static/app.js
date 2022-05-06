const wordsUrl = 'getWordsArray';
const correctWordsUrl = 'getCorrectWords';
const uploadUrl = 'sendWords';
const notificationUrl = 'getNotification';
// const TIME1 = 10;
// const TIME2 = 5;

let ROUNDS = 194;
// let ROUNDS = 2;

const TIME1 = 30;
const TIME2 = 5;


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
                    setTimeout(() => {
                        setWords(wordsElems, window.rounds[round + 1]);
                    }, 1500);
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
                let container = document.getElementById('finish-container');
                let wordsTask = document.getElementById("main-container");
                toggleShowWindows(wordsTask);
                toggleShowWindows(container);
                // container.classList.remove('close');
                // container.classList.add('open');
            }
            // console.log(data);
            // postData(data);
        } else {
            timerElem.innerHTML = seconds;
        }
        seconds = seconds - 0.01;
    }, 10);
}

function showNotification(animationType) {
    const ANIMATION_TYPE = {
    1: 'animate__animated animate__fadeInUp',
    2: '',
    3: 'animate--blink',
    4: 'animate__animated animate__fadeIn',
    5: 'animate--moving',
    "none": ''
};
    document.body.insertAdjacentHTML('beforeend', createNotification(ANIMATION_TYPE[animationType]));
    
    return 0;
}

function destroyNotification() {
    window.notificationClicked = true;
    let notificationFrame = document.querySelector(".notification");
    if (notificationFrame){
        notificationFrame.remove();
    }
}

function createNotification(classList){
    return `<div class="notification ${classList}" onclick="destroyNotification()">
        <div class="icon-container">
            <svg width="31" height="43" viewBox="0 0 31 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M19.938 4.87836C20.135 3.58881 19.732 2.23657 18.747 1.24254C17.0902 -0.414179 14.4037 -0.414179 12.7559 1.24254C11.7708 2.22761 11.3678 3.58881 11.5649 4.8694C12.8634 4.35896 14.2693 4.07239 15.747 4.07239C17.2246 4.07239 18.6395 4.35896 19.938 4.87836Z"
                    fill="white" />
                <path
                    d="M30.738 36.9918C27.2634 32.5052 25.4096 27.0157 25.4096 21.3202V15.4545C25.4096 10.1261 21.0574 5.78284 15.738 5.78284C10.4096 5.78284 6.06636 10.0993 6.06636 15.4545V21.3202C6.06636 26.9799 4.17681 32.5142 0.737999 36.9918H30.738Z"
                    fill="white" />
                <path
                    d="M28.7858 15.5172C28.3111 15.5172 27.944 15.15 27.944 14.6754C27.944 11.3351 26.3589 8.20075 23.5649 6.07836C23.1977 5.77388 23.1261 5.27239 23.3947 4.86045C23.6992 4.49328 24.2365 4.42164 24.6037 4.6903C27.8096 7.15299 29.6634 10.7888 29.6634 14.6306C29.6275 15.15 29.2514 15.5172 28.7858 15.5172Z"
                    fill="white" />
                <path
                    d="M2.69024 15.5172C2.21561 15.5172 1.84845 15.15 1.84845 14.6754C1.84845 10.7978 3.70218 7.1888 6.90815 4.73507C7.27531 4.4306 7.82158 4.5291 8.12606 4.90522C8.43054 5.28134 8.33203 5.81866 7.95591 6.12313C5.16188 8.24552 3.5768 11.3798 3.5768 14.7201C3.56785 15.15 3.16486 15.5172 2.69024 15.5172Z"
                    fill="white" />
                <path
                    d="M10.544 38.7112C11.2514 40.9052 13.3111 42.4903 15.738 42.4903C18.1649 42.4903 20.2246 40.9052 20.932 38.7112H10.544Z"
                    fill="white" />
            </svg>
        </div>
        <div class="notification-close">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                width="20px" height="20px">
                <g id="surface4180719">
                    <path
                        style=" stroke:none;fill-rule:nonzero;fill:rgb(40.000001%,40.000001%,40.000001%);fill-opacity:1;"
                        d="M 4.707031 3.292969 L 3.292969 4.707031 L 10.585938 12 L 3.292969 19.292969 L 4.707031 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.707031 L 19.292969 3.292969 L 12 10.585938 Z M 4.707031 3.292969 " />
                </g>
            </svg>
        </div>
    </div>`;
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
    console.log('debug------', roundIndex.toString());
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

    toggleShowWindows(wordsTask);
    // wordsTask.classList.toggle("close");
    // wordsTask.classList.toggle("open");

    toggleShowWindows(mainContainer);
    // mainContainer.classList.toggle("open");
    // mainContainer.classList.toggle("close");

    destroyNotification();
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
            toggleShowWindows(container);
            toggleShowWindows(wordsTask);
            // container.classList.add('close');
            // wordsTask.classList.toggle("close");
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

function animateObj(obj, type) {
    if (type == 0) {
    obj.animate([
        { transform: 'rotateY(0deg)' },
        { transform: 'rotateY(90deg)' }
    ], {
        duration: 1000,
        iteration: 1,
    })
    return 0;
    }
    if (type == 1) {
        obj.animate([
            { transform: 'rotateY(90deg)' },
            { transform: 'rotateY(0deg)' }
        ], {
            duration: 1000,
            iteration: 1,
        })
        return 0;
    }
}

function toggleShowWindows(obj){
    const timeAnimation = 100;
    if (obj.classList.contains("open")) {
        obj.classList.remove("open");
        animateObj(obj,0);
        setTimeout(() => {
            obj.classList.add("close");
        }, timeAnimation);
    }
    if (obj.classList.contains("close")) {
        obj.classList.remove("close");
        animateObj(obj,1);
        setTimeout(() => {
            obj.classList.add("open");
        }, timeAnimation);
    }
}

function finishBtn() {
    if (window.upload == false) {
        let tabSelect = document.getElementById('tab-select').value;
        let notificationSelect = document.getElementById('notification-select').value;
        let stirSelect = document.getElementById('stir-select').value;
        let irritationSelect = document.getElementById('irritation-select').value;
        let differentSelect = document.getElementById('different-select').value;
        let irritationType1Select = document.getElementById('irritation-type-1-select').value;
        let irritationType2Select = document.getElementById('irritation-type-2-select').value;
        let irritationType3Select = document.getElementById('irritation-type-3-select').value;
        let irritationType4Select = document.getElementById('irritation-type-4-select').value;
        let irritationType5Select = document.getElementById('irritation-type-5-select').value;

        let poll = {
            'tabSelect': tabSelect,
            'notificationSelect': notificationSelect,
            'stirSelect': stirSelect,
            'irritationSelect': irritationSelect,
            'differentSelect': differentSelect,
            'irritationType1Select': irritationType1Select,
            'irritationType2Select': irritationType2Select,
            'irritationType3Select': irritationType3Select,
            'irritationType4Select': irritationType4Select,
            'irritationType5Select': irritationType5Select
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


    for (let i_1 = 1; i_1 <= Math.floor(ROUNDS / 2); i_1++) {
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