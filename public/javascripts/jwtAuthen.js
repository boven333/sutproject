
function authen() {
    const jwt = localStorage.getItem('jwtToken');

    if (!jwt) { 
        (window.location.href = '/');
    }
}
authen();
