document.addEventListener("DOMContentLoaded", () => {
    const mainWebsite = document.getElementById("mainWebsite");
    const introScreen = document.getElementById("introScreen");
    const thirdPage = document.getElementById("thirdPage");
    
    const startBtn = document.getElementById("startBtn");
    const homeBtn = document.getElementById("homeBtn");
    const audio = document.getElementById("introMusic");
    const progressFill = document.getElementById("progressFill");
    const progressTime = document.getElementById("progressTime");

    let progressInterval = null;

    // URL-ல் skipIntro=true இருக்கிறதா எனப் பார்க்க
    const urlParams = new URLSearchParams(window.location.search);
    const skipIntro = urlParams.get('skipIntro');

    // Check if the user has already visited in this session OR coming back via link
    const hasVisited = sessionStorage.getItem("tvk_visited");

    if (hasVisited || skipIntro === "true") {
        // Direct to 3rd Page (Dashboard)
        sessionStorage.setItem("tvk_visited", "true");
        showPage(thirdPage);
    } else {
        // Show Page 1 for first time visit
        showPage(mainWebsite);
    }

    // 1. Start Button Event
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            showPage(introScreen);
            startIntroAudioAndTimer();
        });
    }

    // 2. Home Button Event
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            if (progressInterval) clearInterval(progressInterval);
            sessionStorage.setItem("tvk_visited", "true");
            showPage(thirdPage);
        });
    }

    // Helper Function to Switch Pages
    function showPage(targetPage) {
        [mainWebsite, introScreen, thirdPage].forEach(page => {
            if (page) page.classList.remove("active-page");
        });
        if (targetPage) targetPage.classList.add("active-page");
    }

    // Play Audio & Sync Progress Timer
    function startIntroAudioAndTimer() {
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(err => {
            console.log("Audio play waiting for user interaction:", err);
        });

        audio.onloadedmetadata = () => {
            initProgress(audio.duration);
        };

        if (audio.duration && !isNaN(audio.duration)) {
            initProgress(audio.duration);
        } else {
            initProgress(5); // Fallback duration 5 seconds
        }
    }

    function initProgress(duration) {
        const totalDuration = duration || 5;
        
        progressInterval = setInterval(() => {
            const currentTime = audio.currentTime;
            const percentage = (currentTime / totalDuration) * 100;
            if (progressFill) progressFill.style.width = `${Math.min(percentage, 100)}%`;

            const currentSecFormatted = Math.floor(currentTime).toString().padStart(2, "0");
            const totalSecFormatted = Math.floor(totalDuration).toString().padStart(2, "0");
            if (progressTime) progressTime.textContent = `${currentSecFormatted} / ${totalSecFormatted}`;

            if (currentTime >= totalDuration || audio.ended) {
                clearInterval(progressInterval);
                sessionStorage.setItem("tvk_visited", "true"); // Save visit state
                showPage(thirdPage);
            }
        }, 100);
    }
});
