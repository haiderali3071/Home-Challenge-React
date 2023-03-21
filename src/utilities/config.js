
// Don't change data source positions
const DATA_SOURCE1 = "guardian api";
const DATA_SOURCE2 = "news api";

function storeToken(token) {
    window.localStorage.setItem("auth_token", token);
}

function getToken() { 
    return window.localStorage.getItem("auth_token");
}

function openPage(url) {
    window.open(url, '_blank', 'noreferrer');
}

module.exports = {
    DATA_SOURCE1,
    DATA_SOURCE2,
    storeToken,
    getToken,
    openPage,
}