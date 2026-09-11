const games=[
 {name:"Minecraft",players:"141M",likes:"2.5M",emoji:"⛏️",cat:"Sandbox",img:"🎮",desc:"Construa, explore e sobreviva em um mundo infinito"},
 {name:"Fortnite",players:"500M",likes:"3.2M",emoji:"🎯",cat:"Battle Royale",img:"🔫",desc:"Batalha de 100 jogadores em uma ilha épica"},
 {name:"Roblox",players:"280M",likes:"2.1M",emoji:"🧱",cat:"Multiplayer",img:"🎨",desc:"Plataforma com milhões de jogos criados por usuários"},
 {name:"Among Us",players:"50M",likes:"1.8M",emoji:"👽",cat:"Social",img:"🚀",desc:"Encontre o impostor entre seus amigos"},
 {name:"Valorant",players:"25M",likes:"890K",emoji:"🎪",cat:"Competitivo",img:"🔥",desc:"Shooter tático 5v5 de alta intensidade"},
 {name:"Elden Ring",players:"20M",likes:"2.3M",emoji:"👑",cat:"RPG",img:"⚔️",desc:"RPG de ação em um mundo aberto misterioso"}
];

const skins=[
 {name:"Padrão",emoji:"🧑🏻",color:"#b9e9ff"},
 {name:"Ninja",emoji:"🥷",color:"#1a1a2e"},
 {name:"Astronauta",emoji:"👨🏻‍🚀",color:"#ffffff"},
 {name:"Pirata",emoji:"🏴‍☠️",color:"#8b4513"},
 {name:"Mago",emoji:"🧙🏻",color:"#9d45e8"},
 {name:"Superhéroe",emoji:"🦸🏻",color:"#ff0000"},
 {name:"Zumbi",emoji:"🧟",color:"#4a7c59"},
 {name:"Alien",emoji:"👽",color:"#00ff00"}
];

let currentSkin=0;
let currentGame=null;

const page=document.getElementById("page");
const toast=document.getElementById("toast");
const modalOverlay=document.getElementById("modal-overlay");
const modal=document.getElementById("modal");

function notify(msg){
 toast.textContent=msg; toast.classList.add("show");
 setTimeout(()=>toast.classList.remove("show"),2200);
}

function showModal(title,msg,onConfirm){
 modal.innerHTML=`<h2>${title}</h2><p>${msg}</p><div class="modal-buttons"><button class="modal-btn secondary" onclick="closeModal()">Cancelar</button><button class="modal-btn primary" onclick="confirmModal()">Confirmar</button></div>`;
 modal.classList.add("show");
 modalOverlay.classList.add("show");
 window.confirmCallback=onConfirm;
}

function closeModal(){
 modal.classList.remove("show");
 modalOverlay.classList.remove("show");
}

function confirmModal(){
 if(window.confirmCallback)window.confirmCallback();
 closeModal();
}

function gameCard(g){
 return `<article class="game-card" onclick="selectGame(${games.indexOf(g)})">
   <div class="game-thumb">${g.emoji}</div>
   <div class="game-info">
     <h3>${g.name}</h3>
     <div class="muted">👍 ${g.likes} &nbsp; 👥 ${g.players}</div>
     <button class="primary play" data-game="${g.name}">▶ Jogar</button>
   </div>
 </article>`;
}

function renderHome(){
 page.innerHTML=`<div class="page">
 <section class="hero"><div class="hero-content">
   <div class="muted">BEM-VINDO DE VOLTA</div>
   <h1>kimuBia! 🌟</h1><p>Explore mundos épicos, jogue com amigos e crie suas próprias aventuras.</p>
   <button class="primary play" data-game="Mundo Principal">▶ Jogar agora</button>
 </div></section>
 <div class="section-head"><h2>Acesso rápido</h2></div>
 <div class="grid">
   <article class="game-card"><div class="game-thumb">🎮</div><div class="game-info"><h3>Encontrar jogos</h3><div class="muted">Descubra novas aventuras</div><button class="primary" onclick="navigate('games')">Ver jogos</button></div></article>
   <article class="game-card"><div class="game-thumb">🎨</div><div class="game-info"><h3>Editar Skin</h3><div class="muted">Customize seu personagem</div><button class="primary" onclick="navigate('skin')">Customizar</button></div></article>
   <article class="game-card"><div class="game-thumb">⭐</div><div class="game-info"><h3>Meu Perfil</h3><div class="muted">Veja suas conquistas</div><button class="primary" onclick="navigate('profile')">Abrir perfil</button></div></article>
 </div>
 <div class="section-head"><h2>🔥 Em Alta</h2><button class="link" onclick="navigate('games')">Ver todos →</button></div>
 <div class="grid">${games.slice(0,3).map(gameCard).join("")}</div>
 </div>`;
 bindPlay();
}

function renderGames(){
 page.innerHTML=`<div class="page">
 <div class="section-head"><div><h1>🎮 Todos os Jogos</h1><div class="muted">Escolha uma aventura para jogar.</div></div></div>
 <input class="search" id="search" placeholder="🔎 Buscar jogos..." />
 <div class="filters">${["Todos","Sandbox","Battle Royale","Multiplayer","Social","Competitivo","RPG"].map((x,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${x}">${x}</button>`).join("")}</div>
 <div class="grid" id="game-grid">${games.map(gameCard).join("")}</div>
 </div>`;
 bindPlay();
 document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{
   document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
   filterGames(btn.dataset.filter,document.getElementById("search").value);
 });
 document.getElementById("search").oninput=e=>{
   const active=document.querySelector(".filter.active").dataset.filter;
   filterGames(active,e.target.value);
 };
}

function filterGames(cat,text){
 const q=text.toLowerCase();
 const list=games.filter(g=>(cat==="Todos"||g.cat===cat)&&g.name.toLowerCase().includes(q));
 document.getElementById("game-grid").innerHTML=list.length?list.map(gameCard).join(""):`<p class="muted">Nenhum jogo encontrado.</p>`;
 bindPlay();
}

function renderSkin(){
 page.innerHTML=`<div class="page">
 <div class="section-head"><h1>🎨 Editor de Skin</h1><p class="muted">Customize a aparência do seu personagem</p></div>
 
 <div style="background:#0b1b2e;border:1px solid #24445f;border-radius:20px;padding:30px;text-align:center;margin-bottom:30px">
   <div style="font-size:120px;margin-bottom:15px">${skins[currentSkin].emoji}</div>
   <h2>${skins[currentSkin].name}</h2>
   <p class="muted">Clique em uma skin para ativar</p>
 </div>

 <h3 style="margin-top:30px">Escolha seu personagem:</h3>
 <div class="skin-grid">
   ${skins.map((s,i)=>`<div class="skin-option ${i===currentSkin?'active':''}" onclick="selectSkin(${i})">
     <div class="emoji">${s.emoji}</div>
     <h3>${s.name}</h3>
   </div>`).join("")}
 </div>

 <div style="margin-top:30px;background:#0b1b2e;border:1px solid #24445f;border-radius:16px;padding:20px">
   <h3>Cores personalizadas:</h3>
   <div class="skin-colors">
     <div class="color-btn active" style="background:#b9e9ff" onclick="customizeColor('#b9e9ff')"></div>
     <div class="color-btn" style="background:#ff6b9d" onclick="customizeColor('#ff6b9d')"></div>
     <div class="color-btn" style="background:#00d4ff" onclick="customizeColor('#00d4ff')"></div>
     <div class="color-btn" style="background:#00ff88" onclick="customizeColor('#00ff88')"></div>
     <div class="color-btn" style="background:#ffd700" onclick="customizeColor('#ffd700')"></div>
     <div class="color-btn" style="background:#ff8c42" onclick="customizeColor('#ff8c42')"></div>
   </div>
 </div>

 <button class="primary" style="width:100%;margin-top:30px;padding:18px" onclick="notify('Skin salva com sucesso! ✨')">💾 Salvar Skin</button>
 </div>`;
}

function selectSkin(index){
 currentSkin=index;
 renderSkin();
 notify(`Skin alterada para ${skins[index].name}!`);
}

function customizeColor(color){
 document.querySelectorAll(".color-btn").forEach(b=>b.classList.remove("active"));
 event.target.classList.add("active");
 notify("Cor atualizada!");
}

function renderPlay(){
 if(currentGame===null){
   page.innerHTML=`<div class="page">
   <div class="section-head"><h1>▶️ Jogar</h1><p class="muted">Selecione um jogo para começar</p></div>
   <div class="grid">${games.map(gameCard).join("")}</div>
   </div>`;
   bindPlay();
   return;
 }

 const game=games[currentGame];
 page.innerHTML=`<div class="play-container">
   <div class="game-player">
     <div class="game-banner">${game.emoji}</div>
     <div class="game-details">
       <h1>${game.name}</h1>
       <p>${game.desc}</p>
       
       <div class="game-stats">
         <div class="stat-item">
           <b>👥 ${game.players}</b>
           <span>Jogadores Ativos</span>
         </div>
         <div class="stat-item">
           <b>⭐ ${game.likes}</b>
           <span>Curtidas</span>
         </div>
         <div class="stat-item">
           <b>🌍 Global</b>
           <span>Disponibilidade</span>
         </div>
       </div>

       <button class="play-btn" onclick="launchGame('${game.name}')">🚀 Iniciar ${game.name}</button>
       <button class="play-btn" style="background:#132941;color:#18a8ff;margin-top:10px" onclick="selectGame(null)">← Voltar aos Jogos</button>
     </div>
   </div>
 </div>`;
}

function selectGame(index){
 currentGame=index;
 renderPlay();
}

function launchGame(name){
 showModal("Iniciar Jogo",`Você está pronto para entrar em ${name}?`,()=>{
   notify(`🚀 Abrindo ${name}... Conectando ao servidor!`);
   setTimeout(()=>notify(`✅ Bem-vindo a ${name}! Divirta-se!`),1500);
 });
}

function renderProfile(){
 page.innerHTML=`<div class="page">
 <div class="section-head"><h1>👤 Meu Perfil</h1></div>
 <section class="profile-card">
  <div class="profile-top">
   <div class="avatar">${skins[currentSkin].emoji}</div>
   <div style="flex:1"><h1>kimuBia</h1><div class="muted">@kimuBia • Membro desde 2024</div><br><span class="level">Nível 12</span><div class="progress"><i></i></div><div class="muted" style="margin-top:7px">320 / 600 XP</div></div>
  </div>
  <div class="stats"><div class="stat"><b>🪙 1.250</b><span class="muted">Moedas</span></div><div class="stat"><b>⭐ 12</b><span class="muted">Conquistas</span></div><div class="stat"><b>👥 245</b><span class="muted">Amigos</span></div></div>
  <button class="edit" onclick="navigate('skin')">🎨 Editar Personagem →</button>
 </section>
 <div class="section-head"><h2>🏆 Seu Progresso</h2></div>
 <div style="background:#0b1b2e;border:1px solid #24445f;border-radius:16px;padding:20px">
   <p><b>📊 Tempo jogado:</b> 127 horas</p>
   <p><b>🎮 Jogos favoritos:</b> Minecraft, Fortnite, Roblox</p>
   <p><b>🏅 Badges:</b> 🥇 Champion • 🎯 Sharpshooter • 🧠 Strategist</p>
 </div>
 <div class="section-head"><h2>Recomendado para você</h2><button class="link" onclick="navigate('games')">Ver todos →</button></div>
 <div class="grid">${games.slice(0,3).map(gameCard).join("")}</div>
 </div>`;
 bindPlay();
}

function bindPlay(){
 document.querySelectorAll(".play").forEach(btn=>btn.onclick=(e)=>{
   e.stopPropagation();
   const gameName=btn.dataset.game;
   const gameIndex=games.findIndex(g=>g.name===gameName);
   if(gameIndex!==-1){
     currentGame=gameIndex;
     navigate('play');
   }else{
     notify("🎮 Abrindo "+gameName+"...");
   }
 });
}

function navigate(name){
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
 if(name==="home")renderHome();
 if(name==="games")renderGames();
 if(name==="skin")renderSkin();
 if(name==="play")renderPlay();
 if(name==="profile")renderProfile();
 window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".nav-btn").forEach(btn=>btn.onclick=()=>navigate(btn.dataset.page));
modalOverlay.onclick=closeModal;
navigate("home");
