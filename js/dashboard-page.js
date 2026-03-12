const SESSION_KEY = "forbes_co_session";

const sessionStatus = document.getElementById("session-status");
const ordersTodayEl = document.getElementById("orders-today");
const revenueTodayEl = document.getElementById("revenue-today");
const lowStockCountEl = document.getElementById("low-stock-count");
const logsBody = document.getElementById("logs-body");
const taskList = document.getElementById("task-list");
const musicCover = document.getElementById("music-cover");
const trackNameEl = document.getElementById("track-name");
const trackArtistEl = document.getElementById("track-artist");
const playPauseBtn = document.getElementById("play-pause");
const playIcon = document.getElementById("play-icon");
const prevBtn = document.getElementById("prev-track");
const nextBtn = document.getElementById("next-track");
const progressBar = document.getElementById("progress-bar");
const musicWidget = document.querySelector(".music-widget");

const mockSystemLogs = [
  { time: "9:42 PM", event: "Payment callback not received for order ID 69420", priority: "LOW" },
  { time: "10:15 PM", event: "Premium Waffle Knit Cardigan pending shipment", priority: "MEDIUM" },
  { time: "11:05 PM", event: "FATAL: Hochi welfare check not completed within 2 weeks", priority: "HIGH", type: "system_error", url: "hochi-welfare.html" },
  { time: "11:30 PM", event: "Config value not set, using default", priority: "MEDIUM" }
];

const mockTasks = [
  { text: "Meet up with friends for birthday dinner", completed: false },
  { text: "Prepare outfit for birthday outing on Saturday", completed: true },
  { text: "Submit medical leave fund claim", completed: false },
  { text: "Obtain EA form and do tax filing", completed: false }
];

const playlist = [
  { name: "Risk it all", artist: "Bruno Mars", cover: "media/music-risk-it-all.jpeg" },
  { name: "Heartstrings (and Zombie Things)", artist: "Batzombie", cover: "media/music-heartstrings.jpeg" },
  { name: "Never Let Go", artist: "LNGSHOT", cover: "media/music-never-let-go.png" },
];

let currentTrackIndex = 0;
let isPlaying = false;
let progressInterval = null;
let progressPercent = 0;

function hasSession() {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function requireSessionOrRedirect() {
  if (!hasSession()) {
    window.location.replace("index.html");
    return false;
  }

  return true;
}

function renderLogs() {
  if (!logsBody) return;
  logsBody.innerHTML = "";
  mockSystemLogs.forEach((log) => {
    const row = document.createElement("tr");
    if (log.url) {
      row.classList.add("clickable-log");
      row.title = "Click to view";
      row.onclick = () => window.location.href = log.url;
    }
    row.innerHTML = `
      <td data-label="Timestamp" class="log-time">${log.time}</td>
      <td data-label="Description" class="log-event"><span class="log-event-text">${log.event}</span></td>
      <td data-label="Priority"><span class="priority-tag ${log.priority.toLowerCase()}">${log.priority}</span></td>
    `;
    logsBody.appendChild(row);
  });
}

function renderTasks() {
  taskList.innerHTML = "";
  mockTasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = `task-item ${task.completed ? "done" : ""}`;
    item.innerHTML = `
      <label class="task-label">
        <input type="checkbox" ${task.completed ? "checked" : ""} 
               onchange="toggleTask(${index})">
        <span class="checkmark"></span>
        <span class="task-text">${task.text}</span>
      </label>
    `;
    taskList.appendChild(item);
  });
}

window.toggleTask = function (index) {
  mockTasks[index].completed = !mockTasks[index].completed;
  renderTasks();
};

function renderStats() {
  const today = new Date();
  const isMarch12 = (today.getMonth() === 2 && today.getDate() === 12);
  ordersTodayEl.textContent = isMarch12 ? "My Birthday" : "My Belated Birthday";

  revenueTodayEl.textContent = "12,003,2000";

  // Dynamic Inventory calculation
  const INVENTORY_DATA_KEY = "forbes_inventory_data";
  const savedItems = localStorage.getItem(INVENTORY_DATA_KEY);
  let unlockedCount = 0;
  let totalItems = 8; // Default fallback matching initial defaultItems count

  if (savedItems) {
    const items = JSON.parse(savedItems);
    unlockedCount = items.filter(i => i.unlocked).length;
    totalItems = items.length;
  }

  lowStockCountEl.textContent = unlockedCount;
}

function updateSessionUi() {
  const session = getSession();
  const username = session?.username || "team member";
  sessionStatus.textContent = `Over to you, ${username}.`;
  sessionStatus.style.color = "#7f2f4b";
}

// Logout logic migrated to sidebar.js


function updateMusicUi() {
  const track = playlist[currentTrackIndex];
  musicCover.src = track.cover;
  trackNameEl.textContent = track.name;
  trackArtistEl.textContent = track.artist;

  if (isPlaying) {
    playIcon.className = "bi bi-pause-fill";
    musicWidget.classList.add("playing");
    startProgress();
  } else {
    playIcon.className = "bi bi-play-fill";
    musicWidget.classList.remove("playing");
    stopProgress();
  }
}

function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    progressPercent += 0.5;
    if (progressPercent >= 100) {
      progressPercent = 0;
      nextTrack();
    }
    progressBar.style.width = `${progressPercent}%`;
  }, 100);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  progressPercent = 0;
  updateMusicUi();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  progressPercent = 0;
  updateMusicUi();
}

function initMusicPlayer() {
  playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updateMusicUi();
  });

  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  updateMusicUi();
}

if (requireSessionOrRedirect()) {
  renderStats();
  renderLogs();
  renderTasks();
  updateSessionUi();
  initMusicPlayer();
}
