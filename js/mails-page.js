/**
 * Mails Page Logic
 * Handles loading chats from an object, selecting active conversation, 
 * and rendering message history.
 */

const SESSION_KEY = "forbes_co_session";

const mockConversations = [
    {
        id: 99,
        name: "Unknown Number",
        avatar: "https://ui-avatars.com/api/?name=?&background=f8d7e6&color=7f2f4b",
        time: "Yesterday",
        status: "online",
        messages: [
            { text: "Hey Jasmine", time: "2:27 PM", type: "received" },
            { text: "Its me, the guy that's working at the same place as you, and we talk a little sometimes", time: "2:27 PM", type: "received" },
            { text: "I was wondering if you'd like to grab a coffee or something someday", time: "2:27 PM", type: "received" },
            { text: "I know you have a boyfriend and all, but this is invitation is just casual, no other intentions", time: "2:28 PM", type: "received" },
            { text: "I hope you're able to see this as just like a friend thing.", time: "2:28 PM", type: "received" },
            { text: "Let me know if you're up for it! I'll be available any time :)", time: "2:32 PM", type: "received" },

        ],
        showBlockOption: true
    },
    {
        id: 1,
        name: "Marc Forbes",
        avatar: "https://ui-avatars.com/api/?name=Marc+Forbes&background=f8d7e6&color=7f2f4b",
        time: "10:30 AM",
        status: "online",
        messages: [
            { text: "Hello test 123", time: "10:25 AM", type: "received" },
            { text: "Ya baby", time: "10:25 AM", type: "sent" },
        ]
    },
    {
        id: 2,
        name: "Noel",
        avatar: "https://ui-avatars.com/api/?name=Noel+Reeves&background=f8d7e6&color=7f2f4b",
        time: "Yesterday",
        status: "offline",
        messages: [
            { text: "Bij", time: "11:23 AM", type: "received" },
            { text: "What?", time: "11:29 AM", type: "sent" },
        ]
    },
    {
        id: 3,
        name: "Nessa",
        avatar: "https://ui-avatars.com/api/?name=Vanessa&background=f8d7e6&color=7f2f4b",
        time: "Yesterday",
        status: "offline",
        messages: [
            { text: "Hi Jas, you free anytime this week?", time: "4:04 PM", type: "received" },
            { text: "I think so", time: "4:09 PM", type: "sent" },
            { text: "Any plans?", time: "4:09 PM", type: "sent" },
        ]
    },
    {
        id: 4,
        name: "Jolly Twin",
        avatar: "https://ui-avatars.com/api/?name=Jocelyn&background=f8d7e6&color=7f2f4b",
        time: "Yesterday",
        status: "online",
        messages: [
            { text: "de", time: "6:07 PM", type: "received" },
            { text: "我很自信的骑我的紫色的自行车从重庆到长城", time: "6:09 PM", type: "received" },
            { text: "???", time: "6:11 PM", type: "sent" },
        ]
    },
    {
        id: 5,
        name: "Divya",
        avatar: "https://ui-avatars.com/api/?name=Divya&background=f8d7e6&color=7f2f4b",
        time: "Yesterday",
        status: "online",
        messages: [
            { text: "Hi Jas", time: "3:47 PM", type: "received" },
            { text: "Ak sama si Eddy dtg pg KL nnti April", time: "3:47 PM", type: "received" },
            { text: "Okie", time: "4:28 PM", type: "sent" },
        ]
    },
    {
        id: 98,
        name: "Argonaut Dova",
        avatar: "https://ui-avatars.com/api/?name=Argonaut+Dova&background=f8d7e6&color=7f2f4b", // fallback avatar
        time: "8:00 AM",
        status: "online",
        blocked: true,
        blockReason: "This user has been blocked because they should be.",
        messages: [
            { text: "Hi Jas, edry ni", time: "2:00 PM", type: "received" },
            { text: "Lama nda chat kan", time: "2:00 PM", type: "received" },
            { text: "Ak rindumu ba tu la mo chat", time: "2:01 PM", type: "received" },
            { text: "Kau masi sama si mark ka hehe?", time: "2:01 PM", type: "received" },
            { text: "Jas?", time: "4:41 PM", type: "received" },
            { text: "Memang 1 tick ka?", time: "4:42 PM", type: "received" },
            { text: "Waina, diblock ba aq ni", time: "11:56 PM", type: "received" },
        ]
    },
    {
        id: 100,
        name: "Mirza",
        avatar: "https://ui-avatars.com/api/?name=Mirza&background=f8d7e6&color=7f2f4b", // fallback avatar
        time: "8:00 AM",
        status: "online",
        blocked: true,
        blockReason: "This user has been blocked because they should be.",
        messages: [
            { text: "Ui Jas, aq ni si Mirza", time: "8:43 PM", type: "received" },
            { text: "Sebenarnya aq masih lagi sukaimu, dari dulu lagi jas msa kita di skolah dlu", time: "8:43 PM", type: "received" },
            { text: "Boleh ka aq minta kau fikirkan balik lagi, mnatau kau sedar yg kita ni sbnarnya jodoh ba", time: "8:44 PM", type: "received" },
            { text: "Apa ba ni dicakapkan olehmu mir? Mabuk ka", time: "9:12 PM", type: "sent" },
            { text: "Ya, aq xda control skrg jas, stress aq", time: "9:12 PM", type: "received" },
            { text: "Aq balik2 juga ingat yg kita terjumpa dkt watson tu baru2, mcm takdir pula", time: "9:12 PM", type: "received" },
            { text: "Smua kawan2 ku pun bilang jas kita ngam, dan aq rasa kalau kau fikir balik, kau sedar juga tu", time: "9:12 PM", type: "received" },
            { text: "Ew, bye", time: "10:31 PM", type: "sent" },
        ]
    }
];

let activeChatId = null;

// DOM Elements
const chatsListEl = document.getElementById('chats-list');
const noChatSelectedEl = document.getElementById('no-chat-selected');
const activeChatEl = document.getElementById('active-chat');
const chatMessagesEl = document.getElementById('chat-messages');
const chatNameEl = document.getElementById('chat-name');
const chatAvatarEl = document.getElementById('chat-avatar');
const chatStatusEl = document.getElementById('chat-status');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const backBtn = document.getElementById('chat-back');
const mailContainer = document.querySelector('.mail-container');
const chatInputArea = document.querySelector('.chat-input-area');
const blockedNoticeEl = document.getElementById('blocked-notice');
const blockReasonText = document.getElementById('block-reason-text');
const unknownContactBanner = document.getElementById('unknown-contact-banner');
const blockUserBtn = document.getElementById('block-user-btn');
const blockConfirmModal = document.getElementById('block-confirm-modal');
const modalCancelBlock = document.getElementById('modal-cancel-block');
const modalConfirmBlock = document.getElementById('modal-confirm-block');
const replyWarningModal = document.getElementById('reply-warning-modal');
const replyWarningClose = document.getElementById('reply-warning-close');
const sessionStatus = document.getElementById("session-status");

/**
 * Renders the list of recent conversations in the sidebar
 */
function renderChatsSidebar() {
    chatsListEl.innerHTML = '';
    mockConversations.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${activeChatId === chat.id ? 'active' : ''} ${chat.blocked ? 'blocked' : ''}`;
        const lastMsgObj = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
        const msgPreview = lastMsgObj ? lastMsgObj.text : "No messages yet";

        chatItem.innerHTML = `
            <img src="${chat.avatar}" alt="${chat.name}" class="avatar-small">
            <div class="chat-item-info">
                <div class="chat-item-head">
                    <h4>${chat.name}</h4>
                    <span class="chat-time">${chat.time}</span>
                </div>
                <p class="chat-item-preview">${chat.blocked ? '<i class="bi bi-slash-circle"></i> Blocked' : msgPreview}</p>
            </div>
            ${chat.blocked ? '<span class="blocked-badge">Blocked</span>' : ''}
        `;
        chatItem.addEventListener('click', () => selectChat(chat.id));
        chatsListEl.appendChild(chatItem);
    });
}

/**
 * Selects a conversation and renders the messages
 */
function selectChat(id) {
    activeChatId = id;
    const chat = mockConversations.find(c => c.id === id);
    if (!chat) return;

    // Show chat window, hide placeholder
    noChatSelectedEl.style.display = 'none';
    activeChatEl.style.display = 'flex';

    // Update Header Info
    chatNameEl.textContent = chat.name;
    chatAvatarEl.src = chat.avatar;

    // Handle Blocked State
    if (chat.blocked) {
        chatStatusEl.textContent = "Blocked";
        chatStatusEl.className = "status-blocked";
        chatInputArea.style.display = 'none';
        blockedNoticeEl.style.display = 'flex';
        blockReasonText.textContent = chat.blockReason || "This user is blocked.";
        if (unknownContactBanner) unknownContactBanner.style.display = 'none';
    } else {
        chatStatusEl.textContent = chat.status === 'online' ? 'Online' : 'Offline';
        chatStatusEl.className = chat.status === 'online' ? 'status-online' : 'status-offline';
        chatInputArea.style.display = 'flex';
        blockedNoticeEl.style.display = 'none';

        if (unknownContactBanner) {
            unknownContactBanner.style.display = chat.showBlockOption ? 'block' : 'none';
        }
    }

    // Render Messages
    renderMessages(chat.messages);
    // Toggle container class for mobile
    if (mailContainer) {
        mailContainer.classList.add('chat-open');
    }

    // refresh active state in list
    renderChatsSidebar();
}

/**
 * Closes the chat window for mobile view
 */
function closeChat() {
    activeChatId = null;
    if (mailContainer) {
        mailContainer.classList.remove('chat-open');
    }
}

/**
 * Renders message bubbles in the chat window
 */
function renderMessages(messages) {
    chatMessagesEl.innerHTML = '';
    messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.type}`;
        msgEl.innerHTML = `
            ${msg.text}
            <span class="message-time">${msg.time}</span>
        `;
        chatMessagesEl.appendChild(msgEl);
    });

    // Auto Scroll to bottom
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Handles sending a new message
 */
function handleSendMessage() {
    const text = messageInput.value.trim();
    if (!text || activeChatId === null) return;

    // Special case for chat 99 easter egg
    if (activeChatId === 99) {
        if (replyWarningModal) {
            replyWarningModal.style.display = 'flex';
        }
        messageInput.value = '';
        return;
    }

    const chat = mockConversations.find(c => c.id === activeChatId);
    if (!chat) return;

    // Add message to mock data
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = { text, time: timeString, type: 'sent' };
    chat.messages.push(newMessage);
    chat.time = timeString;

    // Update UI
    messageInput.value = '';
    renderMessages(chat.messages);
    renderChatsSidebar();
}

/**
 * Blocks a user by ID
 */
function blockUser(id) {
    const chat = mockConversations.find(c => c.id === id);
    if (!chat) return;

    chat.blocked = true;
    chat.blockReason = "This user has been blocked because they should be.";
    chat.status = "offline";

    // Trigger Unlock if it's the unknown number
    if (id === 99 && window.showUnlockModal) {
        window.showUnlockModal({
            itemId: 11,
            title: "New Discovery!",
            itemName: "Loyalty Token Unlocked",
            description: "Your loyalty is unmatched! You chose protection over mystery."
        });
    }

    selectChat(id);
}

/**
 * Session handling similar to dashboard
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
        sessionStatus.textContent = `Inbox for ${username}.`;
        sessionStatus.style.color = "#7f2f4b";
    }
}

// Event Listeners
if (sendBtn) {
    sendBtn.addEventListener('click', handleSendMessage);
}

if (backBtn) {
    backBtn.addEventListener('click', closeChat);
}

if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

if (blockUserBtn) {
    blockUserBtn.addEventListener('click', () => {
        if (blockConfirmModal) blockConfirmModal.style.display = 'flex';
    });
}

if (modalCancelBlock) {
    modalCancelBlock.addEventListener('click', () => {
        if (blockConfirmModal) blockConfirmModal.style.display = 'none';
    });
}

if (modalConfirmBlock) {
    modalConfirmBlock.addEventListener('click', () => {
        if (activeChatId) {
            blockUser(activeChatId);
            if (blockConfirmModal) blockConfirmModal.style.display = 'none';
        }
    });
}

if (replyWarningClose) {
    replyWarningClose.addEventListener('click', () => {
        if (replyWarningModal) replyWarningModal.style.display = 'none';
    });
}

// Initialization
function init() {
    updateSessionUi();
    renderChatsSidebar();
}

document.addEventListener('DOMContentLoaded', init);
