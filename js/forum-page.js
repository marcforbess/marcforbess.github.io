/**
 * Forum Page Logic
 * Handles dynamic rendering of forum posts and simple interactions.
 */

const SESSION_KEY = "forbes_co_session";

const mockPosts = [
    {
        id: 3,
        author: "Theodore Rockingchair",
        username: "@the_rock",
        isVerified: false,
        avatar: "https://ui-avatars.com/api/?name=The&Rock&background=f8d7e6&color=7f2f4b",
        text: `
        Here are 4 things I absolutely believe with all my life:
        <br>
        1. Everyone has a favorite number
        <br>
        2. If you are in a relationship, you will always remember your anniversary day
        <br>
        3. Remembering how many digits in your first name is not easy
        <br>
        4. When someone asks how many siblings do you have, you should not include yourself
        <br>
        <br>
        I might have put them in an order but all these to me stand SIDE BY SIDE!
        <br>
        <br>
        `,
        time: "43m",
        stats: { comments: 5, shares: 0, likes: 19 }
    },
    {
        id: 1,
        author: "Marc Forbes",
        username: "@marcforbes",
        isVerified: false,
        avatar: "https://ui-avatars.com/api/?name=Marc+Forbes&background=f8d7e6&color=7f2f4b",
        text: "Spent some time trying to create some simple games for my girlfriend. Let me know what you think about it!<br>Just a simple game, really. Have a look at it, but you probably think its a ripoff; And you know what? It very well might just be. But nonetheless, its here. Click <a href='word-guess.html'>here</a> to play!",
        // image: "media/cat-icon.png",
        time: "2h",
        stats: { comments: 12, shares: 5, likes: 48 }
    },
    {
        id: 21,
        author: "Cardiovascular Bronchitis",
        username: "@cardi_b",
        isVerified: true,
        avatar: "media/icespice.jpeg",
        text: "Starships were meant to fly..",
        // image: "media/hochi.jpeg",
        time: "3h",
        stats: { comments: 45, shares: 12, likes: 210 }
    },
    {
        id: 22,
        author: "forbes.co Official Account",
        username: "@forbesco",
        isVerified: true,
        avatar: "https://ui-avatars.com/api/?name=forbes+co&background=f8d7e6&color=7f2f4b",
        text: `It look's like Caesar Sighfur left his previous post hanging for some unknown reason. After some internal investigations, we were able to find out the actual keyword he intended to include in his most recent post.
        We would very much like to share it but unfortunately due to strict policies and regulations, we are unable to fully disclose it. However, what we can do is share the encrypted keyword. So, here you go I guess.
        <br>
        <p>Encrypted Keyword: <strong>jzqvo um bw bpm amkzmb dictb vwe</strong></p>
        <br>
        `,
        time: "8h",
        stats: { comments: 8, shares: 8, likes: 8 }
    },
    {
        id: 2,
        author: "Caesar Sighfur",
        username: "@caesar_sighfur",
        isVerified: false,
        avatar: "media/avatar_jesse.png",
        text: `Am I the only one here who realises that theres like this easter egg this forum has where if you type in a specific keyword and click 'Post', something will happen.
        I myself have stumbled upon this, and I have a strong desire to post it here, well basically the keyword is....
        `,
        time: "13h",
        stats: { comments: "3.4k", shares: "20.4K", likes: "687K" }
    }
];

const feedEl = document.getElementById('forum-feed');
const sessionStatus = document.getElementById("session-status");
const postTextarea = document.querySelector('.create-post textarea');
const postBtn = document.querySelector('.post-btn');

/**
 * Renders the forum feed
 */
function renderFeed() {
    if (!feedEl) return;
    feedEl.innerHTML = '';

    mockPosts.forEach(post => {
        const card = document.createElement('article');
        card.className = 'post-card';

        let imageHtml = '';
        if (post.image) {
            imageHtml = `<img src="${post.image}" alt="Post image" class="post-image">`;
        }

        const verifiedBadge = `
            <span class="badge">
                <i class="bi bi-patch-check-fill" style="color: #405DE6;"></i>
            </span>
        `;

        card.innerHTML = `
            <img src="${post.avatar}" alt="${post.author}" class="user-avatar">
            <div class="post-content">
                <div class="post-header">
                    <span class="post-author">${post.author}</span>
                    <span class="post-username">${post.username}</span>
                    ` + (post.isVerified ? verifiedBadge : "") + `
                    <span class="post-dot">•</span>
                    <span class="post-time">${post.time}</span>
                </div>
                <p class="post-text">${post.text}</p>
                ${imageHtml}
                <div class="post-footer">
                    <button class="stat-btn comment"><i class="bi bi-chat"></i> ${post.stats.comments}</button>
                    <button class="stat-btn retweet"><i class="bi bi-arrow-repeat"></i> ${post.stats.shares}</button>
                    <button class="stat-btn heart"><i class="bi bi-heart"></i> ${post.stats.likes}</button>
                    <button class="stat-btn"><i class="bi bi-share"></i></button>
                </div>
            </div>
        `;
        feedEl.appendChild(card);
    });
}

function handlePost() {
    const text = postTextarea.value.trim();
    if (!text) return;

    // Secret Vault Redirect
    if (text.toLowerCase() === "bring me to the secret vault now") {
        const overlay = document.getElementById('system-overlay');
        const message = document.getElementById('system-message');
        if (overlay) {
            overlay.style.display = 'flex';
            if (message) message.textContent = "Establishing secure connection...";

            setTimeout(() => {
                window.location.href = 'vault.html';
            }, 1200);
        } else {
            window.location.href = 'vault.html';
        }
        return;
    }

    const session = getSession();
    const username = session?.username || "team member";

    const newPost = {
        id: Date.now(),
        author: username,
        username: `@${username.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(username) + "&background=f8d7e6&color=7f2f4b",
        text: text,
        time: "now",
        stats: { comments: 0, shares: 0, likes: 0 }
    };

    mockPosts.unshift(newPost);
    postTextarea.value = '';
    renderFeed();
}

/**
 * Session handling
 */
function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_error) {
        return null;
    }
}

function updateSessionUi() {
    const session = getSession();
    const username = session?.username || "team member";
    if (sessionStatus) {
        sessionStatus.textContent = `Insights for ${username}.`;
        sessionStatus.style.color = "#7f2f4b";
    }
}

// Event Listeners
if (postBtn) {
    postBtn.addEventListener('click', handlePost);
}

// Initialization
function init() {
    updateSessionUi();
    renderFeed();
}

document.addEventListener('DOMContentLoaded', init);
