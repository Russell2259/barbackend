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

fetch('https://raw.githubusercontent.com/Russell2259/barbackend/main/LoaderPage.json')
    .then(function (resp) {
        return resp.json();
    })
    .then(function (loader) {
        var css = document.createElement("style");
        css.innerHTML = loader.loadercss + loader.css + 'body {margin: 0px; width: 100vw; height: 100vh; overflow: hidden; position: relative;user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -o-user-select: none;}'
        css.id = 'authcss'
        document.head.appendChild(css);
        const hosturl = window.location.href;
        let peer;
        peer = new Peer();
        peer.on('open', id => {
            var EmbAuth = document.createElement("iframe");
            EmbAuth.src = `https://russell2259.github.io/barbackend/Auth.html?token=${id}&type=send`
            EmbAuth.style = 'display: none;'
            EmbAuth.id = 'peerconn'
            document.body.appendChild(EmbAuth);
            localStorage.setItem(hosturl, id);
        });
        peer.on('connection', conn => connection(conn));
        function connection(conn) {
            conn.on('open', () => {
                conn.send(hosturl);
                const connid = localStorage.getItem(hosturl);
                conn.on('data', data => {
                    const decrypt = (salt, encoded) => {
                        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
                        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
                        return encoded
                            .match(/.{1,2}/g)
                            .map((hex) => parseInt(hex, 16))
                            .map(applySaltToChar)
                            .map((charCode) => String.fromCharCode(charCode))
                            .join("");
                    };
                    const message = decrypt(connid, data)
                    if (message.includes('err')) {
                        const err = message.replace('err', '');
                        document.write(err);
                    } else {
                        if (message.includes('status')) {
                            const status = message.replace('status', '')
                            let iFrameDetection = (window === window.parent) ? false : true;
                            if (iFrameDetection === true) {
                                if (status === 'BAR HC' || status === 'BAR Member' && iFrameDetection) {
                                    loadcontainer.remove();
                                    overlay.remove();
                                    document.getElementById('peerconn').remove();
                                    document.getElementById('Auth').remove();
                                    document.getElementById('peerjs').remove();
                                    document.getElementById('authcss').remove();
                                    document.body.style = ''
                                    peer.destroy();
                                } else {
                                    peer.destroy();
                                    window.location.href = 'https://russell2259.github.io/barbackend/403.html'
                                }
                            } else {
                                peer.destroy();
                                window.location.href = 'https://russell2259.github.io/barbackend/403.html'
                            }

                        }
                    }
                });
            });
        }
    })
    .catch((err) => {
        document.write(err);
    });
