document.body.style = 'margin: 0px; width: 100vw; height: 100vh; overflow: hidden; position: relative;user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;'

var overlay = document.createElement("div");
overlay.id = 'overlay'
document.body.appendChild(overlay);

var loadcontainer = document.createElement("div");
loadcontainer.id = 'loadcontainer'
document.body.appendChild(loadcontainer);

var loader = document.createElement("div");
loader.innerHTML = '<div></div><div></div><div></div><div></div>'
loader.className = 'KMloader'
loadcontainer.appendChild(loader);

var loadertext = document.createElement("p");
loadertext.innerText = 'Loading...'
loadcontainer.appendChild(loadertext);

fetch('https://russell2259.github.io/barbackend/KMResources.json')
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        var css = document.createElement("style");
        css.innerHTML = data.loadercss + data.css
        document.head.appendChild(css);
        const crypt = (salt, text) => {
            const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
            const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
            const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

            return text
                .split('')
                .map(textToChars)
                .map(applySaltToChar)
                .map(byteHex)
                .join('');
        };
        const file = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        const key = crypt('AUTHkey', file)
        fetch(`https://raw.githubusercontent.com/Russell2259/barbackend/main/Key${key}.json`)
            .then(function (resp) {
                return resp.json();
            })
            .then(function (key) {
                let iFrameDetection = (window === window.parent) ? false : true;
                const loggedin = localStorage.getItem('active');
                if (!loggedin === 'true' || !iFrameDetection || !key.location === crypt('AUTHkeychecker', file)) {
                    document.write('Stop Trying');
                } else {
                    loadcontainer.remove();
                    overlay.remove();
                }
            })
            .catch((err) => {
                document.write(err);
            });
    })
    .catch((err) => {
        document.write(err);
    });
