function showIframe() {
    document.getElementById('branchIframe').classList.add('active'); // home
    document.getElementById('dashboardContent').classList.remove('active'); // branch
    document.getElementById('subbranch').classList.remove('active'); // subbranch
}

function showDashboard() {
    document.getElementById('branchIframe').classList.remove('active'); // home
    document.getElementById('dashboardContent').classList.add('active'); // branch
    document.getElementById('subbranch').classList.remove('active'); // subbranch
}

function showSubBranch() {
    document.getElementById('branchIframe').classList.remove('active'); // home
    document.getElementById('dashboardContent').classList.remove('active'); // branch
    document.getElementById('subbranch').classList.add('active'); // subbranch
}