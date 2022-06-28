fetch('https://www-sites-opensocial.googleusercontent.com/gadgets/proxy/refresh=3600&container=enterprise/https://raw.githubusercontent.com/Russell2259/barbackend/main/HCLoginData.json')
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        const loggedin = localStorage.getItem('active')
        const url = window.location.pathname;
        let result = url.includes('Login.html')
        if (loggedin === 'true' && result === true) {
            window.location.href = 'close.html';
        }
        const username = document.getElementById('username');
        const usernameform = document.getElementById('next');
        const password = document.getElementById('password');
        const passworderror = document.getElementById('passworderror');
        const passwordform = document.getElementById('login');
        const usernameerror = document.getElementById('usernameerror');
        usernamebox.style.display = 'block';
        passwordbox.style.display = 'none';
        usernameform.addEventListener('click', (e) => {
            let users = data.usernames;
            let usernamemessages = [];
            let correct = users.includes(username.value)
            let blank = username.value === '' || username.value === null
            if (correct === true) {
                usernamebox.style.display = 'none';
                passwordbox.style.display = 'block';
                localStorage.setItem('username', username.value);
            } else if (username.value === '' || username.value === null) {
                if (username.value === '' || username.value === null) {
                    usernamemessages.push('Please enter a username');
                } else {
                    usernamemessages.push('');
                }
            } if (correct === false && blank === false) {
                usernamemessages.push('Incorrect username');
            }
            if (usernamemessages.length > 0) {
                usernameerror.innerText = usernamemessages;
            }
            passwordform.addEventListener('click', (e) => {
                let passwordmessages = [];
                let blank = password.value === '' || password.value === null
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
                if (blank === false) {
                    const encrypted_password = crypt('BirdsAreEvil', password.value);
                    const username = localStorage.getItem('username');
                    fetch(`https://www-sites-opensocial.googleusercontent.com/gadgets/proxy/refresh=3600&container=enterprise/https://raw.githubusercontent.com/Russell2259/barbackend/main/${encrypted_password}.json`)
                        .then(function (resp) {
                            return resp.json();
                        })
                        .then(function (data) {
                            let correct = username === data.username;
                            if (correct === true) {
                                localStorage.setItem('active', 'true');
                                localStorage.setItem('account', data.id);
                                window.location.href = 'close.html';
                            }
                        });
                } else if (blank === true) {
                    if (blank === true) {
                        passwordmessages.push('Please enter a password');
                    }
                }
                if (blank === false) {
                    passwordmessages.push('Incorrect password');
                }
                if (passwordmessages.length > 0) {
                    passworderror.innerText = passwordmessages;
                }
            });
        });
    });

function resetlogin() {
    localStorage.setItem('active', 'false');
    localStorage.setItem('account', '');
    localStorage.setItem('username', '');
}
