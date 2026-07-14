// Dynamic background particles generator (bananas, hearts, stars)
function createBackgroundParticles() {
    const container = document.getElementById('hearts-container');
    const particleEmojis = ['🍌', '💛', '🌟', '💪', '✨', '🎈', '🎉'];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Pick a random emoji
            const randomEmoji = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
            particle.textContent = randomEmoji;
            
            // Random horizontal positioning
            particle.style.left = `${Math.random() * 100}vw`;
            
            // Random size variation
            const size = Math.random() * 12 + 16; // 16px to 28px
            particle.style.fontSize = `${size}px`;
            
            // Random floating speed
            const duration = Math.random() * 5 + 6; // 6s to 11s
            particle.style.animationDuration = `${duration}s`;
            
            // Random delay to stagger spawning
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(particle);
            
            // Remove after animation finishes
            setTimeout(() => {
                particle.remove();
            }, (duration + 5) * 1000);
        }, i * 300);
    }
}

// Keep spawning particles in background
setInterval(createBackgroundParticles, 12000);

// Global Variables
let currentQuoteIndex = 0;

const motivationalQuotes = [
    "Remember: You are one in a Minion, Smerithee! 💛🍌",
    "Bello! Just wanted to remind you that you are doing amazing! 🌟",
    "Keep going, Smerithee! The Minions believe in you! 🚀",
    "Take a deep breath. You've got this! 💪✨",
    "Sending you a giant banana-sized hug! 🍌🤗",
    "Whenever you feel down, remember: you are incredible! 💛",
    "You are stronger than you think, Smerithee! 🌟",
    "Go conquer the day! 🚀💛",
    "Don't forget to smile today! 💛",
    "You can do hard things! 💪✨"
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

// Confetti celebration bursts with Minion colors (Yellow, Blue, White)
function launchMinionConfetti() {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 25, 
        spread: 360, 
        ticks: 50, 
        zIndex: 1000,
        colors: ['#ffe135', '#0060b6', '#ffffff'] // Minion yellow, denim blue, white
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 30 * (timeLeft / duration);
        // confettis from left & right corners
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 200);
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize background
    createBackgroundParticles();

    // 2. Envelope interaction
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', () => {
        const wrapper = envelope.parentElement;
        wrapper.classList.add('open');
        
        // Wait for envelope animations to play out, then switch screens
        setTimeout(() => {
            navigateToScreen('screen-envelope', 'screen-cheer');
            // Trigger a welcoming confetti splash!
            setTimeout(launchMinionConfetti, 400);
        }, 1500);
    });

    // 3. "Cheer Me Up" Button click actions
    const btnCheer = document.getElementById('btn-cheer');
    const quoteDisplay = document.getElementById('quote-display');

    btnCheer.addEventListener('click', () => {
        // Cycle sequentially to next quote
        currentQuoteIndex = (currentQuoteIndex + 1) % motivationalQuotes.length;
        
        // Add pop animations
        quoteDisplay.classList.add('quote-pop');
        
        // Update the displayed text
        quoteDisplay.textContent = motivationalQuotes[currentQuoteIndex];
        
        // Remove animation class after it completes to allow repeating
        setTimeout(() => {
            quoteDisplay.classList.remove('quote-pop');
        }, 500);

        // Fire Minion confetti burst!
        launchMinionConfetti();
    });
});
