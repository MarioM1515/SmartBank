const API = "http://localhost:3000";
let userId = null;

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch(API + "/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    alert("Registrovan!");
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    if (res.status === 200) {
        const data = await res.json();
        userId = data.id;

        document.getElementById("app").style.display = "block";
        loadBalance();
        loadTransactions();
    } else {
        alert("Pogrešan login");
    }
}

async function deposit() {
    const amount = parseFloat(document.getElementById("amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Unesi validan iznos");
        return;
    }

    await fetch(API + "/update-balance", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id: userId, amount, type: "deposit" })
    });

    loadBalance();
    loadTransactions();
}

async function withdraw() {
    const amount = parseFloat(document.getElementById("amount").value);

    await fetch(API + "/update-balance", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id: userId, amount, type: "withdraw" })
    });

    loadBalance();
    loadTransactions();
}

async function loadBalance() {
    const res = await fetch(API + "/balance/" + userId);
    const data = await res.json();

    document.getElementById("balance").textContent = data.balance;
}

async function loadTransactions() {
    const res = await fetch(API + "/transactions/" + userId);
    const data = await res.json();

    const list = document.getElementById("transactions");
    list.innerHTML = "";

    data.forEach(t => {
        const li = document.createElement("li");

        // mapiranje tipa u CSS klasu
        li.className = (t.type === "deposit") ? "income" : "expense";

        li.textContent = `${t.type.toUpperCase()} - ${t.amount} RSD (${new Date(t.date).toLocaleString()})`;

        list.appendChild(li);
    });
}

function logout() {
    userId = null;

    document.getElementById("app").style.display = "none";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("amount").value = "";

    document.getElementById("balance").textContent = "0";
    document.getElementById("transactions").innerHTML = "";

    alert("Uspešno ste se odjavili!");
}

function togglePassword() {
    const password = document.getElementById("password");
    const btn = document.getElementById("togglePassword");

    if (password.type === "password") {
        password.type = "text";
        btn.textContent = "🙈";
    } else {
        password.type = "password";
        btn.textContent = "👁";
    }
}

