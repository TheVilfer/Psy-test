filesUrl = 'getFiles'
window.onload = function() {
    setUrls();
}

function getFiles() {
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
        let url = filesUrl;
        xhr.open('GET', url);
        xhr.send();
    });
}


function setUrls() {
    getFiles().then(res => {
        let files = res.files;
        console.log(files);
        viewUrls(files);
    })
}

function viewUrls(files) {
    let container = document.getElementById('main-container');
    container.innerHTML = '';
    for (file of files) {
        let f = file[0];
        let h = file[1];
        let s = `<li><a href="${h}">${f}</a></li>`;
        console.log(s);
        container.innerHTML += s;
    }
}