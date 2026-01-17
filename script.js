const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

let players = [];
let rotation = 0;

/* ---------- Challenges ---------- */
const challenges = [
  { type: "dare", text: "ทำหน้าตาตลก 5 วิ 🤪" },
  { type: "dare", text: "ร้องเพลง 10 วิ 🎶" },
  { type: "dare", text: "เล่าเรื่องฮา ๆ 😂" },
  { type: "minigame", text: "สุ่มมินิเกม 🃏" }
];

const minigames = [
  "เป่ายิ้งฉุบ ✊✋✌️",
  "พูดชื่อสัตว์ 5 วิ 🐶",
  "จำคำ 3 คำ 🧠",
  "แฟชั่นโชว์ 1 รอบ 💃",
  "ทำเสียงเอฟเฟกต์ 🎮",
  "เลือกคนให้หมุนต่อ 🔄",
  "ตอบเร็ว ⚡",
  "ทำท่าตลก 🤡",
  "เล่าเรื่องสั้น ⏱"
];

/* ---------- Resize ---------- */
function resize() {
  const size = Math.min(window.innerWidth - 40, 360);
  canvas.width = size;
  canvas.height = size;
  draw();
}
window.addEventListener("resize", resize);
resize();

/* ---------- Draw Wheel ---------- */
function draw() {
  const c = canvas.width / 2;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (!players.length) return;

  const slice = Math.PI * 2 / players.length;

  players.forEach((p,i)=>{
    const start = rotation + i * slice - Math.PI/2;
    const end = start + slice;
    const mid = start + slice/2;

    ctx.beginPath();
    ctx.moveTo(c,c);
    ctx.arc(c,c,c-10,start,end);
    ctx.fillStyle = `hsl(${i*360/players.length},80%,60%)`;
    ctx.fill();
    ctx.strokeStyle="#fff";
    ctx.stroke();

    ctx.save();
    ctx.translate(c,c);
    ctx.rotate(mid);
    ctx.rotate(Math.PI/2);
    ctx.textAlign="center";
    ctx.font="bold 16px Arial";
    ctx.fillStyle="#fff";
    ctx.strokeStyle="#000";
    ctx.lineWidth=3;
    ctx.strokeText(p,0,-c*0.6);
    ctx.fillText(p,0,-c*0.6);
    ctx.restore();
  });
}

/* ---------- Players ---------- */
function addPlayer(){
  const input=document.getElementById("nameInput");
  if(!input.value.trim())return;
  players.push(input.value.trim());
  input.value="";
  updateList();
  draw();
  spinBtn.disabled=players.length<2;
}

function updateList(){
  const ul=document.getElementById("playerList");
  ul.innerHTML="";
  players.forEach((p,i)=>{
    ul.innerHTML+=`<li>${p}<button onclick="removePlayer(${i})">ลบ</button></li>`;
  });
}

function removePlayer(i){
  players.splice(i,1);
  updateList();
  draw();
  spinBtn.disabled=players.length<2;
}

function clearAll(){
  players=[];
  updateList();
  draw();
  spinBtn.disabled=true;
}

/* ---------- Spin ---------- */
function spinWheel(){
  if(players.length<2)return;
  spinBtn.disabled=true;

  const rounds=4+Math.random()*3;
  const slice=360/players.length;
  rotation+=rounds*360+Math.random()*slice;
  canvas.style.transform=`rotate(${rotation}deg)`;

  setTimeout(()=>{
    const norm=(rotation%360+360)%360;
    const index=Math.floor((360-norm)/slice)%players.length;
    const ch=challenges[Math.floor(Math.random()*challenges.length)];

    document.getElementById("winner").textContent=players[index];
    document.getElementById("resultText").textContent=ch.text;
    showResult();

    if(ch.type==="minigame"){
      setTimeout(openMinigame,800);
    }
    spinBtn.disabled=false;
  },3000);
}

/* ---------- Result ---------- */
function showResult(){
  overlay.style.display="block";
  resultPopup.style.display="block";
}
function hideResult(){
  overlay.style.display="none";
  resultPopup.style.display="none";
}

/* ---------- Minigame Cards ---------- */
function openMinigame(){
  hideResult();
  minigameOverlay.style.display="block";
  minigamePopup.style.display="block";

  const grid=document.getElementById("cardGrid");
  const result=document.getElementById("minigameResult");
  grid.innerHTML="";
  result.textContent="";

  const shuffled=[...minigames].sort(()=>Math.random()-0.5).slice(0,9);

  shuffled.forEach(game=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <div class="card-inner">
        <div class="card-front">🂠</div>
        <div class="card-back">${game}</div>
      </div>
    `;

    card.onclick=()=>{
      document.querySelectorAll(".card").forEach(c=>c.onclick=null);
      card.classList.add("flip");
      result.textContent="มินิเกมที่ได้ 🎮";
    };

    grid.appendChild(card);
  });
}

function closeMinigame(){
  minigameOverlay.style.display="none";
  minigamePopup.style.display="none";
}
