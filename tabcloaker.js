function setCloak() {
    const titleInput = document.getElementById("title").value;
    const iconInput = document.getElementById("icon").value;
    localStorage.setItem('cloaktitle', titleInput);
    localStorage.setItem('cloakicon', iconInput);
}

function fetchCloak() {
    const currentTitle = localStorage.getItem('cloaktitle');
    const currentIcon = localStorage.getItem('cloakicon');
    document.title = currentTitle;
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link'); link.type = 'image/x-icon'; link.rel = 'shortcut icon'; link.href = currentIcon;
}

function showCloak() {
    const currentTitle = localStorage.getItem('cloaktitle');
    const currentIcon = localStorage.getItem('cloakicon');
    document.getElementById("title").innerHTML = currentTitle
    document.getElementById("icon").innerHTML = currentIcon
}
