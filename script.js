// Dynamic background hearts generator
function createBackgroundHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 15;

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');
            
            // Random horizontal positioning
            heart.style.left = `${Math.random() * 100}vw`;
            
            // Random size variation
            const size = Math.random() * 15 + 10;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            
            // Random floating speed
            const duration = Math.random() * 5 + 5;
            heart.style.animationDuration = `${duration}s`;
            
            // Random delay to stagger spawning
            heart.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(heart);
            
            // Remove after animation finishes and recreate to sustain the background loop
            setTimeout(() => {
                heart.remove();
            }, (duration + 5) * 1000);
        }, i * 300);
    }
}

// Keep spawning hearts in background
setInterval(createBackgroundHearts, 12000);

// Global Variables
let noClickCount = 0;
let selectedDay = '';

const noPhrases = [
    "No 😢",
    "Are you sure? 🥺",
    "Really sure? 💔",
    "Think again! 😭",
    "Pleaseee? 👉👈",
    "What if I buy you filter coffee? ☕",
    "And we get crispy dosas? 🥞",
    "I'll be very sad... 😭",
    "Click YES! 🐻",
    "Oops, did your cursor slip?",
    "Nice try, but Yes is waiting!",
    "No is disabled now! 😉"
];

// Screen Navigation
function navigateToScreen(currentId, targetId) {
    const currentScreen = document.getElementById(currentId);
    const targetScreen = document.getElementById(targetId);
    
    currentScreen.style.opacity = '0';
    currentScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentScreen.classList.remove('active');
        targetScreen.classList.add('active');
        
        // Trigger reflow for transition
        targetScreen.offsetHeight;
        
        targetScreen.style.opacity = '1';
        targetScreen.style.transform = 'translateY(0)';
    }, 500);
}

// Confetti celebration bursts
function launchConfettiCelebration() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // confettis from left & right corners
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Gather all details and construct final plan message
function constructPlanText() {
    return `Hey! I accepted your date invitation! 🥰 Can't wait to see you in the Bay Area! 💖`;
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize background
    createBackgroundHearts();

    // 2. Envelope interaction
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', () => {
        const wrapper = envelope.parentElement;
        wrapper.classList.add('open');
        
        // Wait for envelope animations to play out, then switch screens
        setTimeout(() => {
            navigateToScreen('screen-envelope', 'screen-proposal');
        }, 1500);
    });

    // 3. "No" Button Actions
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');

    btnNo.addEventListener('click', (e) => {
        noClickCount++;
        
        // Add shake animation
        btnNo.classList.add('shake');
        setTimeout(() => btnNo.classList.remove('shake'), 400);

        // Update No button text
        const nextTextIndex = Math.min(noClickCount, noPhrases.length - 1);
        btnNo.textContent = noPhrases[nextTextIndex];

        // Update proposal bear image to become progressively sadder
        const proposalImg = document.querySelector('#screen-proposal .illustration');
        if (proposalImg) {
            if (noClickCount >= 1 && noClickCount < 4) {
                proposalImg.src = 'assets/sad_bear_1.png';
            } else if (noClickCount >= 4) {
                proposalImg.src = 'assets/sad_bear_2.png';
            }
        }

        // Grow YES button using padding and font-size to prevent card overlap
        const baseFontSize = 18;
        const basePaddingV = 14;
        const basePaddingH = 28;
        
        const newFontSize = baseFontSize + (noClickCount * 4);
        const newPaddingV = basePaddingV + (noClickCount * 3);
        const newPaddingH = basePaddingH + (noClickCount * 6);
        
        btnYes.style.fontSize = `${newFontSize}px`;
        btnYes.style.padding = `${newPaddingV}px ${newPaddingH}px`;
        
        // Shift colors slightly to make YES even more dominant
        const hueShift = Math.min(noClickCount * 8, 45);
        btnYes.style.filter = `hue-rotate(-${hueShift}deg)`;

        // Shrink NO button slightly to make it physically harder to target
        const noScale = Math.max(0.65, 1 - (noClickCount * 0.08));
        btnNo.style.transform = `scale(${noScale})`;
    });

    // 4. "Yes" Button Actions
    btnYes.addEventListener('click', () => {
        navigateToScreen('screen-proposal', 'screen-celebration');
        setTimeout(() => {
            launchConfettiCelebration();
        }, 600);
    });

    // 5. Send via WhatsApp Actions
    const btnWhatsapp = document.getElementById('btn-send-whatsapp');
    btnWhatsapp.addEventListener('click', () => {
        const text = constructPlanText();
        const encodedText = encodeURIComponent(text);
        const url = `https://api.whatsapp.com/send?text=${encodedText}`;
        window.open(url, '_blank');
    });
});
