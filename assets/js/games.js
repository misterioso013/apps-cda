window.onload = function () {
    var url = window.location.href;
    // verifcar se a url tem o parametro id
    if (url.indexOf('?id=') > -1) {
        const id = url.split('?id=')[1];
        loadGame(id);
    }
    else {
        loadGame();
    }

    function loadGame(id) {
        let newID;
        let lastgame = window.localStorage.getItem('lastgame');
        const lastTime = window.localStorage.getItem('lastTime');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../config.json', true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var config = xhr.response;
            if (!id) {
                // verificar se o jogo foi jogado a mais de 10 minutos
                if (lastTime) {
                    var now = new Date().getTime();
                    var diff = now - Number(lastTime);
                    console.log(diff);
                    if (diff > 1000 * 60 * 10) {
                        lastgame = null;
                    }
                }
                if (lastgame) {
                    newID = lastgame;
                } else {
                    document.getElementById('main-page').style.display = 'flex';
                    return;
                }
            } else {
                newID = id;
                window.localStorage.setItem('lastgame', id);
                window.localStorage.setItem('lastTime', new Date().getTime());
                history.pushState({}, '', 'index.html');
            }

            if (!config.games[id] && !config.games[newID]) {
                document.getElementById('main-page').style.display = 'flex';
                return;
            }

            const game = config.games[id || newID];
            document.title = game.name;
            document.getElementById('game-name').innerHTML = game.name;
            document.getElementById('game-description').innerHTML = game.description;
            document.getElementById('game-image').src = game.image;
            document.getElementById('game-image').alt = game.name;
            document.getElementById('game-image').title = game.name;
            document.getElementById('game-credits').innerHTML = 'Fonte: <a href="' + game.source + '" target="_blank">' + game.source + '</a>';
            document.getElementById('game-image').style.display = 'block';
            document.getElementById('main-page').style.display = 'none';
            document.getElementById('game-page').style.display = 'flex';

            // carregar o iframe
            const btnPlay = document.getElementById('game-play');
            btnPlay.addEventListener('click', () => {
                const iframe = document.createElement('iframe');
                iframe.src = game.link;
                iframe.allow = 'fullscreen';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.margin = '0';
                iframe.style.padding = '0';
                iframe.style.overflow = 'hidden';
                iframe.style.display = 'block';
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.right = '0';
                iframe.style.bottom = '0';
                iframe.style.zIndex = '999999';
                document.getElementById('game-page').appendChild(iframe);
            })

            window.addEventListener('popstate', (e) => {
                document.getElementById('game-page').style.display = 'none';
                document.getElementById('main-page').style.display = 'flex';
                document.getElementById('game-page').removeChild(document.querySelector('iframe'));
            })

        }
        xhr.send();
    }
}