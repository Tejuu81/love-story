"use strict";

/* =========================================
   OUR LOVE STORY — MAIN JAVASCRIPT
========================================= */

const $ = (selector) => document.querySelector(selector);

const pages = [...document.querySelectorAll(".page")];

const music = $("#backgroundMusic");
const musicBtn = $("#musicBtn");
const musicIcon = $("#musicIcon");
const musicLabel = $("#musicLabel");

const dateText = $("#dateText");
const dateStatus = $("#dateStatus");
const calendarDays = $("#days");
const monthLabel = $("#month");

const toast = $("#toast");

const state = {
    date: null,
    pickupTime: "10:00",
    temple: "",
    lunch: "",
    picnic: "",
    dinner: "",
    dinnerTime: "19:00",
    note: ""
};

let visibleMonth = new Date();
visibleMonth.setDate(1);

let selectedDateButton = null;
let toastTimer = null;
let heartTimer = null;


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target) return;

    pages.forEach((page) => {
        page.classList.remove("active");
    });

    target.classList.add("active");

    // Re-run the entrance animation when a page opens.
    target.style.animation = "none";
    void target.offsetWidth;
    target.style.animation = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

$("#beginBtn").addEventListener("click", () => {
    showPage("page2");
});

document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.back);
    });
});


/* =========================================
   CALENDAR
========================================= */

function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isSameDate(a, b) {
    return Boolean(
        a &&
        b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function renderCalendar() {
    calendarDays.innerHTML = "";

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    monthLabel.textContent = visibleMonth.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("span");
        blank.className = "calendar-day empty-day";
        blank.setAttribute("aria-hidden", "true");
        calendarDays.appendChild(blank);
    }

    for (let day = 1; day <= numberOfDays; day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        const button = document.createElement("button");

        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;
        button.dataset.date = dateKey(date);

        button.setAttribute("aria-label", formatDate(date));

        if (date < today) {
            button.classList.add("disabled-day");
            button.disabled = true;
            button.setAttribute("aria-disabled", "true");
        }

        if (isSameDate(date, today)) {
            button.classList.add("today");
        }

        if (state.date && isSameDate(date, state.date)) {
            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
            selectedDateButton = button;
        } else {
            button.setAttribute("aria-pressed", "false");
        }

        button.addEventListener("click", () => {
            if (button.disabled) return;

            state.date = new Date(date);

            calendarDays.querySelectorAll(".calendar-day.selected").forEach((item) => {
                item.classList.remove("selected");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");

            selectedDateButton = button;

            dateText.textContent = formatDate(date);
            dateStatus.textContent = "Our special date is saved in this little story. ♥";

            createHeartBurst(button);
        });

        calendarDays.appendChild(button);
    }

    if (state.date) {
        dateText.textContent = formatDate(state.date);
    } else {
        dateText.textContent = "Choose a date from the calendar";
    }
}

$("#prev").addEventListener("click", () => {
    visibleMonth.setMonth(visibleMonth.getMonth() - 1);
    renderCalendar();
});

$("#next").addEventListener("click", () => {
    visibleMonth.setMonth(visibleMonth.getMonth() + 1);
    renderCalendar();
});

$("#dateBtn").addEventListener("click", () => {
    if (!state.date) {
        dateStatus.textContent = "Please choose a date first, my love. ♥";
        showToast("Choose a date for our little story ♥");
        return;
    }

    showPage("page3");
});

renderCalendar();


/* =========================================
   TIME SELECTION
========================================= */

$("#pickupTime").addEventListener("change", (event) => {
    state.pickupTime = event.target.value || "10:00";
});

$("#pickupBtn").addEventListener("click", () => {
    state.pickupTime = $("#pickupTime").value || "10:00";
    showPage("page4");
});

$("#dinnerTime").addEventListener("change", (event) => {
    state.dinnerTime = event.target.value || "19:00";
});


/* =========================================
   CHOICE CARDS
========================================= */

document.querySelectorAll(".choice-grid[data-group]").forEach((group) => {
    const groupName = group.dataset.group;

    group.querySelectorAll(".choice-card").forEach((card) => {
        card.setAttribute("aria-pressed", "false");

        card.addEventListener("click", () => {
            group.querySelectorAll(".choice-card").forEach((otherCard) => {
                otherCard.classList.remove("selected");
                otherCard.setAttribute("aria-pressed", "false");
            });

            card.classList.add("selected");
            card.setAttribute("aria-pressed", "true");

            state[groupName] = card.dataset.value;

            createHeartBurst(card);
        });
    });
});


/* =========================================
   PAGE CONTINUATION
========================================= */

$("#templeBtn").addEventListener("click", () => {
    if (!state.temple) {
        showToast("Choose our little destination first ♥");
        return;
    }

    showPage("page5");
});

$("#lunchBtn").addEventListener("click", () => {
    if (!state.lunch) {
        showToast("Choose something delicious for us ♥");
        return;
    }

    showPage("page6");
});

$("#picnicBtn").addEventListener("click", () => {
    if (!state.picnic) {
        showToast("Choose our little adventure first ♥");
        return;
    }

    showPage("page7");
});


/* =========================================
   TIME FORMAT
========================================= */

function formatTime(value) {
    if (!value) return "Not selected";

    const parts = value.split(":");

    if (parts.length !== 2) return value;

    let hours = Number(parts[0]);
    const minutes = parts[1];

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}


/* =========================================
   SUMMARY
========================================= */

function addSummaryRow(container, label, value) {
    const row = document.createElement("div");
    row.className = "summary-row";

    const heading = document.createElement("span");
    heading.className = "summary-label";
    heading.textContent = label;

    const content = document.createElement("span");
    content.className = "summary-value";
    content.textContent = value || "Not selected";

    row.append(heading, content);
    container.appendChild(row);
}

function buildSummary() {
    const container = $("#summary");

    container.replaceChildren();

    addSummaryRow(
        container,
        "OUR DATE ♥",
        state.date ? formatDate(state.date) : "Not selected"
    );

    addSummaryRow(
        container,
        "PICKUP TIME",
        formatTime(state.pickupTime)
    );

    addSummaryRow(
        container,
        "OUR DESTINATION",
        state.temple
    );

    addSummaryRow(
        container,
        "LUNCH",
        state.lunch
    );

    addSummaryRow(
        container,
        "ADVENTURE",
        state.picnic
    );

    addSummaryRow(
        container,
        "EVENING",
        state.dinner
    );

    addSummaryRow(
        container,
        "DINNER TIME",
        formatTime(state.dinnerTime)
    );

    if (state.note.trim()) {
        const note = document.createElement("p");
        note.className = "summary-note";
        note.textContent = `“${state.note.trim()}”`;

        container.appendChild(note);
    }
}

$("#finishBtn").addEventListener("click", () => {
    if (!state.dinner) {
        showToast("Choose how we should end our beautiful day ♥");
        return;
    }

    state.pickupTime = $("#pickupTime").value || "10:00";
    state.dinnerTime = $("#dinnerTime").value || "19:00";
    state.note = $("#note").value || "";

    buildSummary();
    showPage("page8");

    createHeartRain();
});


/* =========================================
   COPY SUMMARY
========================================= */

function getPlainTextSummary() {
    const date = state.date ? formatDate(state.date) : "Not selected";

    let text = [
        "♥ OUR LITTLE LOVE PLAN ♥",
        "",
        `Our Date: ${date}`,
        `Pickup Time: ${formatTime(state.pickupTime)}`,
        `Destination: ${state.temple || "Not selected"}`,
        `Lunch: ${state.lunch || "Not selected"}`,
        `Adventure: ${state.picnic || "Not selected"}`,
        `Evening Plan: ${state.dinner || "Not selected"}`,
        `Dinner Time: ${formatTime(state.dinnerTime)}`
    ];

    if (state.note.trim()) {
        text.push("", `A Little Message: ${state.note.trim()}`);
    }

    text.push("", "Made with love, just for you. ♥");

    return text.join("\n");
}

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = text;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();

            const successful = document.execCommand("copy");

            temporaryInput.remove();

            if (!successful) {
                throw new Error("Copy command failed");
            }
        }

        showToast("Our little plan has been copied! ♥");
    } catch (error) {
        showToast("Copy isn't available here. Try opening the website in a browser.");
    }
}

$("#copyBtn").addEventListener("click", () => {
    copyText(getPlainTextSummary());
});


/* =========================================
   WHATSAPP SHARE
========================================= */

$("#shareBtn").addEventListener("click", () => {
    const message = getPlainTextSummary();

    const whatsappUrl =
        "https://wa.me/?text=" + encodeURIComponent(message); 
 
    window.open(whatsappUrl, "_blank", "noopener,noreferrer"); 
}); 
 
 
/* ========================================= 
   MUSIC 
========================================= */ 
 
function updateMusicButton(isPlaying) { 
    musicIcon.textContent = isPlaying ? "♫" : "♪"; 
    musicLabel.textContent = isPlaying ? "Music Playing" : "Play Our Music"; 
 
    musicBtn.setAttribute("aria-pressed", String(isPlaying)); 
} 
 
musicBtn.addEventListener("click", async () => { 
    if (music.paused) { 
        try { 
            await music.play(); 
            updateMusicButton(true); 
            showToast("Let our song play in the background. ♫"); 
        } catch (error) { 
            updateMusicButton(false); 
            showToast("Add song.mp3 to the website folder to play music."); 
        } 
    } else { 
        music.pause(); 
        updateMusicButton(false); 
    } 
}); 
 
music.addEventListener("play", () => { 
    updateMusicButton(true); 
}); 
 
music.addEventListener("pause", () => { 
    updateMusicButton(false); 
}); 
 
 
/* ========================================= 
   TOAST MESSAGE 
========================================= */ 
 
function showToast(message) { 
    toast.textContent = message; 
    toast.classList.add("show"); 
 
    clearTimeout(toastTimer); 
 
    toastTimer = setTimeout(() => { 
        toast.classList.remove("show"); 
    }, 2800); 
} 
 
 
/* ========================================= 
   HEART EFFECTS 
========================================= */ 
 
function createHeartBurst(element) { 
    const rect = element.getBoundingClientRect(); 
 
    const centerX = rect.left + rect.width / 2; 
    const centerY = rect.top + rect.height / 2; 
 
    for (let i = 0; i < 7; i++) { 
        const heart = document.createElement("span"); 
 
        heart.textContent = i % 2 === 0 ? "♥" : "✦"; 
        heart.style.position = "fixed"; 
        heart.style.left = `${centerX}px`; 
        heart.style.top = `${centerY}px`; 
        heart.style.color = i % 2 === 0 ? "#ff729a" : "#e9bf80"; 
        heart.style.fontSize = `${10 + Math.random() * 10}px`; 
        heart.style.pointerEvents = "none"; 
        heart.style.zIndex = "30"; 
        heart.style.transition = "transform 700ms ease, opacity 700ms ease"; 
 
        document.body.appendChild(heart); 
 
        const angle = (Math.PI * 2 * i) / 7; 
        const distance = 25 + Math.random() * 35; 
 
        requestAnimationFrame(() => { 
            heart.style.transform = 
                `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`; 
 
            heart.style.opacity = "0"; 
        }); 
 
        setTimeout(() => heart.remove(), 750); 
    } 
} 
 
function createFloatingHeart() { 
    const container = $("#floatingHearts"); 
    const heart = document.createElement("span"); 
 
    heart.className = "floating-heart"; 
    heart.textContent = Math.random() > 0.35 ? "♥" : "✦"; 
 
    heart.style.left = `${Math.random() * 100}%`; 
    heart.style.fontSize = `${12 + Math.random() * 18}px`; 
    heart.style.animationDuration = `${9 + Math.random() * 9}s`; 
 
    container.appendChild(heart); 
 
    setTimeout(() => heart.remove(), 19000); 
} 
 
function createHeartRain() { 
    for (let i = 0; i < 18; i++) { 
        setTimeout(createFloatingHeart, i * 140); 
    } 
} 
 
heartTimer = setInterval(() => { 
    if (document.hidden) return; 
    createFloatingHeart(); 
}, 1800); 
 
 
/* ========================================= 
   REPLAY THE STORY 
========================================= */ 
 
$("#replayBtn").addEventListener("click", () => { 
    state.date = null; 
    state.pickupTime = "10:00"; 
    state.temple = ""; 
    state.lunch = ""; 
    state.picnic = ""; 
    state.dinner = ""; 
    state.dinnerTime = "19:00"; 
    state.note = ""; 
 
    $("#pickupTime").value = "10:00"; 
    $("#dinnerTime").value = "19:00"; 
    $("#note").value = ""; 
 
    document.querySelectorAll(".choice-card.selected").forEach((card) => { 
        card.classList.remove("selected"); 
        card.setAttribute("aria-pressed", "false"); 
    }); 
 
    visibleMonth = new Date(); 
    visibleMonth.setDate(1); 
 
    selectedDateButton = null; 
 
    dateText.textContent = "Choose a date from the calendar"; 
    dateStatus.textContent = "Tap a heart to choose our special day."; 
 
    renderCalendar(); 
 
    // Music is intentionally NOT stopped or restarted. 
    // It continues playing while the story is replayed. 
 
    showPage("page1"); 
}); 
 
 
/* ========================================= 
   INITIAL STATE 
========================================= */ 
 
updateMusicButton(false); 
 
window.addEventListener("beforeunload", () => { 
    clearInterval(heartTimer); 
}); 
 

// CINEMATIC PASSWORD UNLOCK
(function () {
    function setupPassword() {
        const passwordForm = document.getElementById("passwordForm");
        const passwordInput = document.getElementById("secretPassword");
        const passwordScreen = document.getElementById("passwordScreen");
        const passwordError = document.getElementById("passwordError");
        const passwordCard = document.querySelector(".password-card");

        if (!passwordForm || !passwordInput || !passwordScreen || !passwordError || !passwordCard) {
            console.error("Password page elements are missing from index.html");
            return;
        }

        passwordForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === "आहो💛🩷 माझं तुमच्यावर खूप खूप प्रेम आहे! 🥹❤️‍🩹🫶🏻") {
                passwordError.textContent = "";
                passwordScreen.classList.add("password-hidden");

                setTimeout(function () {
                    passwordScreen.style.display = "none";
                }, 850);
            } else {
                passwordError.textContent = "आहो ❤️! पासवर्ड चुकीचा आहे. पुन्हा प्रयत्न करा ❤️";
                passwordCard.classList.remove("password-shake");
                void passwordCard.offsetWidth;
                passwordCard.classList.add("password-shake");
                passwordInput.value = "";
                passwordInput.focus();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupPassword);
    } else {
        setupPassword();
    }
})();

 
