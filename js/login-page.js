const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const themeKicker = document.getElementById("theme-kicker");
const themeTitle = document.getElementById("theme-title");
const themeDescription = document.getElementById("theme-description");
const themeIllustration = document.getElementById("theme-illustration");
const metricAValue = document.getElementById("metric-a-value");
const metricALabel = document.getElementById("metric-a-label");
const metricBValue = document.getElementById("metric-b-value");
const metricBLabel = document.getElementById("metric-b-label");
const visualText = document.getElementById("visual-text");
const visualMetrics = document.querySelector(".visual-metrics");
const SESSION_KEY = "forbes_co_session";

const mockAccount = {
  username: "jasmine",
  password: "jasmine123",
};

const funThemes = [
  {
    kicker: "forbes.co HQ",
    title: "Fresh blooms, fresh ideas",
    description:
      "Tulips keep growing even after they are cut, and can stretch almost an inch in a vase.",
    metrics: [
      { value: "17", label: "Tulip notes" },
      { value: "5", label: "Fresh ideas" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <rect x="36" y="162" width="228" height="12" rx="6" fill="#ffe7a1" />
        <path d="M84 162V108" stroke="#5f8b57" stroke-width="5" stroke-linecap="round" />
        <path d="M140 162V92" stroke="#5f8b57" stroke-width="5" stroke-linecap="round" />
        <path d="M196 162V112" stroke="#5f8b57" stroke-width="5" stroke-linecap="round" />
        <path d="M76 122L84 108L92 122L84 130L76 122Z" fill="#f48fb3" />
        <path d="M132 106L140 90L148 106L140 114L132 106Z" fill="#ffb3cd" />
        <path d="M188 126L196 112L204 126L196 134L188 126Z" fill="#f7a3c2" />
        <path d="M84 126L70 116L79 132" stroke="#7aa16f" stroke-width="4" stroke-linecap="round" />
        <path d="M140 116L124 106L133 122" stroke="#7aa16f" stroke-width="4" stroke-linecap="round" />
        <path d="M196 130L180 120L189 136" stroke="#7aa16f" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
  },
  {
    kicker: "forbes.co HQ",
    title: "Cats run the internet",
    description:
      "Cats can rotate their ears 180 degrees and use them like mini radars to track sounds.",
    metrics: [
      { value: "9", label: "Cat moods" },
      { value: "27", label: "Purr moments" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <circle cx="150" cy="122" r="56" fill="#ffdcae" />
        <path d="M110 86L125 56L141 89" fill="#ffdcae" />
        <path d="M159 89L175 56L190 86" fill="#ffdcae" />
        <circle cx="130" cy="120" r="6" fill="#6b5560" />
        <circle cx="170" cy="120" r="6" fill="#6b5560" />
        <path d="M145 137L150 132L155 137L150 142L145 137Z" fill="#f38eb4" />
        <path d="M120 138H98M120 146H96M180 138H202M180 146H204" stroke="#8f7680" stroke-width="3" stroke-linecap="round" />
        <circle cx="228" cy="72" r="18" fill="#ffe8a7" />
      </svg>
    `,
  },
  {
    kicker: "forbes.co HQ",
    title: "Turn up the playlist",
    description:
      "Music can improve focus, and familiar songs often help people stay in a productive flow state.",
    metrics: [
      { value: "24", label: "Tracks queued" },
      { value: "92", label: "BPM energy" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <rect x="86" y="58" width="128" height="98" rx="18" fill="#ffd5e6" />
        <circle cx="150" cy="107" r="28" fill="#fff4b8" />
        <circle cx="150" cy="107" r="10" fill="#ffd5e6" />
        <path d="M214 72V130C214 138 208 144 200 144C192 144 186 138 186 130C186 122 192 116 200 116C203 116 206 117 208 118V81L242 72V122C242 130 236 136 228 136C220 136 214 130 214 122" stroke="#92506d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `,
  },
  {
    kicker: "forbes.co HQ",
    title: "A little glam, a lot of color",
    description:
      "Ancient Egyptians used early makeup for both style and sun protection around the eyes.",
    metrics: [
      { value: "12", label: "Shade picks" },
      { value: "4", label: "Looks saved" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <rect x="60" y="120" width="180" height="42" rx="12" fill="#ffd5e6" />
        <circle cx="94" cy="141" r="12" fill="#f38eb4" />
        <circle cx="130" cy="141" r="12" fill="#ffbf8f" />
        <circle cx="166" cy="141" r="12" fill="#ffd878" />
        <circle cx="202" cy="141" r="12" fill="#cdb0ff" />
        <rect x="120" y="64" width="22" height="60" rx="11" fill="#ffdcae" />
        <rect x="120" y="48" width="22" height="22" rx="8" fill="#f48fb3" />
        <path d="M170 78L194 54L208 68L184 92L170 96V78Z" fill="#ffe7a1" />
      </svg>
    `,
  },
  {
    kicker: "forbes.co HQ",
    title: "Soft knits and swishy dresses",
    description:
      "Knitwear stretches because loops of yarn move with you, which makes it comfy and durable.",
    metrics: [
      { value: "31", label: "Fits curated" },
      { value: "8", label: "Style edits" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <path d="M92 86L120 66H180L208 86L192 110V162H108V110L92 86Z" fill="#ffd5e6" />
        <path d="M120 66L134 82H166L180 66" stroke="#c96b95" stroke-width="4" />
        <path d="M108 124H192M108 138H192M108 152H192" stroke="#f0a8c9" stroke-width="3" />
        <path d="M236 152C226 130 215 118 202 112C205 134 214 148 236 152Z" fill="#ffe5a0" />
        <path d="M238 152C246 132 254 122 266 116C263 136 254 150 238 152Z" fill="#ffc8dd" />
      </svg>
    `,
  },
  {
    kicker: "forbes.co HQ",
    title: "Golden crispy happiness",
    description:
      "Fried chicken gets its crunch when hot oil quickly dehydrates the coating into a crisp shell.",
    metrics: [
      { value: "11", label: "Recipe tweaks" },
      { value: "3", label: "Crunch levels" },
    ],
    illustration: `
      <svg class="brand-illustration" viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="18" width="268" height="184" rx="22" fill="#fff8fb" />
        <ellipse cx="138" cy="122" rx="62" ry="42" fill="#ffcd74" />
        <ellipse cx="162" cy="118" rx="44" ry="34" fill="#ffb95d" />
        <circle cx="210" cy="118" r="16" fill="#fff8fb" stroke="#e8d9e0" stroke-width="5" />
        <rect x="206" y="96" width="10" height="44" rx="5" fill="#fff8fb" />
        <path d="M94 150L80 165H212L198 150H94Z" fill="#ffd5e6" />
        <circle cx="104" cy="102" r="5" fill="#f5a84f" />
        <circle cx="126" cy="90" r="4" fill="#f5a84f" />
        <circle cx="150" cy="145" r="5" fill="#f5a84f" />
      </svg>
    `,
  },
];

let currentThemeIndex = 0;
const enableThemeRotation = true;
const themeRotationMs = 4500;
const maxThemeTitleChars = 46;
const maxThemeDescriptionChars = 145;

function capTextLength(text, maxChars) {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars).trimEnd()}...`;
}

function createSession(username) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      username,
      loggedInAt: Date.now(),
    })
  );
}

function applyTheme(theme) {
  themeKicker.textContent = "Did you know? Apparently...";
  themeTitle.textContent = capTextLength(theme.title, maxThemeTitleChars);
  themeDescription.textContent = capTextLength(
    theme.description,
    maxThemeDescriptionChars
  );
  themeIllustration.innerHTML = theme.illustration;
  metricAValue.textContent = theme.metrics[0].value;
  metricALabel.textContent = theme.metrics[0].label;
  metricBValue.textContent = theme.metrics[1].value;
  metricBLabel.textContent = theme.metrics[1].label;
}

function rotateTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % funThemes.length;

  visualText.classList.add("is-swapping");
  themeIllustration.classList.add("is-swapping");
  visualMetrics.classList.add("is-swapping");

  setTimeout(() => {
    applyTheme(funThemes[currentThemeIndex]);
    visualText.classList.remove("is-swapping");
    themeIllustration.classList.remove("is-swapping");
    visualMetrics.classList.remove("is-swapping");
  }, 200);
}

applyTheme(funThemes[currentThemeIndex]);

if (enableThemeRotation) {
  setInterval(rotateTheme, themeRotationMs);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showToast("Seriously? You thought it was that easy?", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";

  setTimeout(() => {
    const isValid =
      username === mockAccount.username && password === mockAccount.password;

    if (isValid) {
      showToast("It is you! Never doubted it for a second.", "success");
      createSession(username);
      loginForm.reset();

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 650);
    } else {
      showToast("Nice try. But nope. Are you sure you're supposed to be here?", "error");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";
  }, 800);
});
