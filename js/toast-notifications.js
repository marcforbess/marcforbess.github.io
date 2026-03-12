const toastContainer = document.getElementById("toast-container");
const toastDurationMs = 2800;
let activeToastTimeoutId;

function createToastIcon(type) {
  const iconWrapper = document.createElement("div");
  iconWrapper.className = `toast-icon ${type}`;

  if (type === "success") {
    iconWrapper.innerHTML = `
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle class="icon-circle" cx="26" cy="26" r="22"></circle>
        <path class="icon-check" d="M16 27L23 34L37 20"></path>
      </svg>
    `;
  } else {
    iconWrapper.innerHTML = `
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle class="icon-circle" cx="26" cy="26" r="22"></circle>
        <path class="icon-cross-a" d="M19 19L33 33"></path>
        <path class="icon-cross-b" d="M33 19L19 33"></path>
      </svg>
    `;
  }

  return iconWrapper;
}

function showToast(message, type = "error") {
  if (!toastContainer) {
    return;
  }

  toastContainer.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "status");

  const icon = createToastIcon(type);
  const copy = document.createElement("div");
  copy.className = "toast-copy";

  const title = document.createElement("p");
  title.className = "toast-title";
  title.textContent = type === "success" ? "Good job!" : "Wait what?";

  const detail = document.createElement("p");
  detail.className = "toast-message";
  detail.textContent = message;

  copy.appendChild(title);
  copy.appendChild(detail);
  toast.appendChild(icon);
  toast.appendChild(copy);
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  clearTimeout(activeToastTimeoutId);
  activeToastTimeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 220);
  }, toastDurationMs);
}

window.showToast = showToast;
