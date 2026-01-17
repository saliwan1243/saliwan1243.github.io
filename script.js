const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let players = [];
let rotationDeg = 0;

const dares = [
    "ดื่มหมดแก้ว! 🍻",
    "คนขวาดื่ม 1 ช็อต ➡️",
    "เล่าเรื่องอายที่สุด 😳",
    "ร้องเพลง 🎤",
    "ทั้งโต๊ะดื่ม 🥂"
];

/* ---------- Responsive ---------- */
function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, 360);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- Draw Wheel ---------- */
function drawWheel() {
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);
    if (players.length === 0) return;

    const slice = (2 * Math.PI) / players.length;

    players.forEach((name, i) => {
        const start = i * slice - Math.PI / 2;
        const end = start + slice;
        const mid = start + slice / 2;

        // ช่อง
        const hue = i * (360 / players.length);
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.fillStyle = `hsl(${hue},80%,60%)`;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // ---------- ชื่อ (แก้ตรงนี้) ----------
        ctx.save();
        ctx.translate(center, center);

        // หมุนไปที่กึ่งกลางช่อง
        ctx.rotate(mid);

        // แล้วหมุนกลับให้ตัวหนังสือตั้งตรง
        ctx.rotate(Math.PI / 2);

        let fontSize = 18;
        if (players.length <= 3) fontSize = 22;
        if (players.length >= 8) fontSize = 14;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textRadius = radius * 0.6;

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000";
        ctx.strokeText(name, 0, -textRadius);

        ctx.fillStyle = "#fff";
        ctx.fillText(name, 0, -textRadius);

        ctx.restore();
    });
}

/* ---------- Players ---------- */
function addPlayer() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim();
    if (!name || players.includes(name)) return;

    players.push(name);
    input.value = "";
    updateList();
    drawWheel();
    spinBtn.disabled = players.length < 2;
}

function removePlayer(i) {
    players.splice(i, 1);
    updateList();
    drawWheel();
    spinBtn.disabled = players.length < 2;
}

function updateList() {
    const ul = document.getElementById("playerList");
    ul.innerHTML = "";
    players.forEach((p, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${p} <button onclick="removePlayer(${i})">ลบ</button>`;
        ul.appendChild(li);
    });
}

function clearAll() {
    players = [];
    updateList();
    drawWheel();
    spinBtn.disabled = true;
}

/* ---------- Spin ---------- */
function spinWheel() {
    if (players.length < 2) return;
    spinBtn.disabled = true;

    const rounds = 5 + Math.random() * 3;
    const sliceDeg = 360 / players.length;
    const offset = Math.random() * sliceDeg;

    rotationDeg += rounds * 360 + offset;
    canvas.style.transform = `rotate(${rotationDeg}deg)`;

    setTimeout(() => {
        const normalized = (rotationDeg % 360 + 360) % 360;
        const index = Math.floor((360 - normalized) / sliceDeg) % players.length;

        showPopup(
            players[index],
            dares[Math.floor(Math.random() * dares.length)]
        );
        spinBtn.disabled = false;
    }, 3000);
}

/* ---------- Popup ---------- */
function showPopup(name, dare) {
    document.getElementById("winner").textContent = name;
    document.getElementById("dare").textContent = dare;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
}

function hidePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
}
