// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const envelope = document.getElementById('envelope');
    const envelopeFlap = document.getElementById('envelope-flap');
    const continueBtn = document.getElementById('continue-btn');
    const restartBtn = document.getElementById('restart-btn');
    const stages = document.querySelectorAll('.stage');
    const envelopeStage = document.getElementById('envelope-stage');
    const letterStage = document.getElementById('letter-stage');
    const flowersStage = document.getElementById('flowers-stage');
    const pageSound = document.getElementById('page-turn');

    // Current stage tracker
    let currentStage = 0;

    // Stage transition function
    function goToStage(stageIndex) {
        stages.forEach(stage => stage.classList.remove('active'));
        
        setTimeout(() => {
            stages[stageIndex].classList.add('active');
            currentStage = stageIndex;
            
            // Special actions for each stage
            if (stageIndex === 2) { // Flowers stage
                animateNumbers();
            }
        }, 300);
    }

    // Envelope click handler
    envelope.addEventListener('click', function() {
        // Add opening animation
        envelope.classList.add('opening');
        
        // Play sound effect (if available)
        try {
            pageSound.currentTime = 0;
            pageSound.play().catch(() => {
                // Silently handle audio play failure
            });
        } catch (e) {
            // Silently handle audio error
        }
        
        // Transition to letter stage after animation
        setTimeout(() => {
            goToStage(1);
        }, 800);
    });

    // Continue button click handler
    continueBtn.addEventListener('click', function() {
        goToStage(2);
    });

    // Restart button click handler
    restartBtn.addEventListener('click', function() {
        // Reset envelope
        envelope.classList.remove('opening');
        
        // Reset numbers
        const numbers = document.querySelectorAll('.number');
        numbers.forEach(number => {
            number.textContent = '0';
        });
        
        // Go back to envelope stage
        goToStage(0);
    });

    // Number animation function
    function animateNumbers() {
        const numbers = document.querySelectorAll('.number');
        
        numbers.forEach(number => {
            const target = number.getAttribute('data-target');
            const isInfinity = target === '∞';
            
            if (isInfinity) {
                setTimeout(() => {
                    number.textContent = '∞';
                }, 2000);
                return;
            }
            
            const targetNum = parseInt(target);
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = targetNum / steps;
            let current = 0;
            let step = 0;
            
            const timer = setInterval(() => {
                current += increment;
                step++;
                
                if (step >= steps) {
                    number.textContent = targetNum.toLocaleString();
                    clearInterval(timer);
                } else {
                    number.textContent = Math.floor(current).toLocaleString();
                }
            }, duration / steps);
        });
    }

    // Add floating hearts animation
    function createFloatingHeart() {
        if (currentStage !== 2) return; // Only on flowers stage
        
        const heart = document.createElement('div');
        heart.innerHTML = '𖹭';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '5';
        heart.style.opacity = '0.8';
        heart.style.transition = 'all 3s ease-out';
        
        document.body.appendChild(heart);
        
        // Animate upward
        setTimeout(() => {
            heart.style.top = '-10vh';
            heart.style.opacity = '0';
        }, 100);
        
        // Remove element after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 3200);
    }

    // Create floating hearts periodically on flowers stage
    setInterval(createFloatingHeart, 2000);

    // Add hover effects to letter
    const letter = document.getElementById('letter');
    if (letter) {
        letter.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) scale(1.02)';
        });
        
        letter.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(-10deg) scale(1)';
        });
    }

    // Add sparkle effect to buttons
    function addSparkleEffect(button) {
        button.addEventListener('mouseenter', function() {
            const sparkles = ['𖹭', '♥︎', 'ꨄ', '𐙚'];
            const sparkle = document.createElement('span');
            sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkle 1s ease-out forwards';
            
            this.style.position = 'relative';
            this.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode && sparkle.parentNode === this) {
                    this.removeChild(sparkle);
                }
            }, 1000);
        });
    }

    // Apply sparkle effects to buttons
    addSparkleEffect(continueBtn);
    addSparkleEffect(restartBtn);

    // Add typing effect to letter (subtle)
    const letterContent = document.querySelector('.letter-content');
    if (letterContent) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                }
            });
        });
        
        observer.observe(letterContent);
    }

    // Add CSS for fadeInUp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Add touch support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // Swipe up to continue (only on letter stage)
        if (diff > swipeThreshold && currentStage === 1) {
            goToStage(2);
        }
        // Swipe down to go back (only on flowers stage)
        else if (diff < -swipeThreshold && currentStage === 2) {
            goToStage(0);
        }
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                if (currentStage === 0) {
                    envelope.click();
                } else if (currentStage === 1) {
                    continueBtn.click();
                }
                break;
            case 'Escape':
                if (currentStage > 0) {
                    restartBtn.click();
                }
                break;
            case 'ArrowRight':
                if (currentStage === 0) {
                    envelope.click();
                } else if (currentStage === 1) {
                    continueBtn.click();
                }
                break;
            case 'ArrowLeft':
                if (currentStage > 0) {
                    restartBtn.click();
                }
                break;
        }
    });

    // Add particle effect for envelope opening
    function createConfetti() {
        const colors = ['#ff6b8a', '#fecfef', '#ff9a9e', '#d63384', '#f1c2c7'];
        const particles = [];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const rect = envelope.getBoundingClientRect();
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0, y = 0;
            let opacity = 1;
            
            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02 + 2; // gravity
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // Modify envelope click to add confetti
    envelope.addEventListener('click', function() {
        if (!envelope.classList.contains('opening')) {
            createConfetti();
        }
    });

    // Add romantic music note animation
    function createMusicNote() {
        if (currentStage === 1) { // Only on letter stage
            const notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
            const note = document.createElement('div');
            note.innerHTML = notes[Math.floor(Math.random() * notes.length)];
            note.style.position = 'fixed';
            note.style.left = Math.random() * 100 + 'vw';
            note.style.top = '100vh';
            note.style.fontSize = '1.2rem';
            note.style.color = '#ff6b8a';
            note.style.pointerEvents = 'none';
            note.style.zIndex = '5';
            note.style.opacity = '0.7';
            note.style.transition = 'all 4s ease-out';
            
            document.body.appendChild(note);
            
            setTimeout(() => {
                note.style.top = '-10vh';
                note.style.opacity = '0';
                note.style.transform = 'rotate(360deg)';
            }, 100);
            
            setTimeout(() => {
                if (note.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 4200);
        }
    }

    // Create music notes periodically on letter stage
    setInterval(createMusicNote, 3000);

    // Add a subtle glow effect to active elements
    function addGlowEffect(element, color = '#ff6b8a') {
        const originalBoxShadow = element.style.boxShadow;
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = `0 0 20px ${color}40, ${originalBoxShadow}`;
        });
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = originalBoxShadow;
        });
    }

    // Apply glow effects
    addGlowEffect(envelope, '#d63384');
    if (continueBtn) addGlowEffect(continueBtn, '#ff6b8a');
    if (restartBtn) addGlowEffect(restartBtn, '#ff9a9e');

    // Initialize accessibility features
    envelope.setAttribute('tabindex', '0');
    envelope.setAttribute('role', 'button');
    envelope.setAttribute('aria-label', 'Click to open the love letter');
    
    if (continueBtn) {
        continueBtn.setAttribute('aria-label', 'Continue to see the flower bouquet');
    }
    
    if (restartBtn) {
        restartBtn.setAttribute('aria-label', 'Start over from the beginning');
    }

    // Add focus styles for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .envelope:focus {
            outline: 3px solid #ff6b8a;
            outline-offset: 5px;
        }
        
        .continue-btn:focus,
        .restart-btn:focus {
            outline: 3px solid #fff;
            outline-offset: 3px;
        }
    `;
    document.head.appendChild(focusStyle);

    // Preload next stage content for smooth transitions
    function preloadImages() {
        const imageUrls = [
            // Add any image URLs if you had them
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    preloadImages();

    // Add a subtle heartbeat effect to the wax seal
    const waxSeal = document.querySelector('.wax-seal');
    if (waxSeal) {
        setInterval(() => {
            if (currentStage === 0) {
                waxSeal.style.animation = 'none';
                setTimeout(() => {
                    waxSeal.style.animation = 'pulse 2s infinite';
                }, 10);
            }
        }, 4000);
    }

    // Performance optimization: Clean up animations when not visible
    document.addEventListener('visibilitychange', function() {
        const hearts = document.querySelectorAll('.heart');
        if (document.hidden) {
            hearts.forEach(heart => {
                heart.style.animationPlayState = 'paused';
            });
        } else {
            hearts.forEach(heart => {
                heart.style.animationPlayState = 'running';
            });
        }
    });

    console.log('𖹭 Love letter initialized! 𖹭');

    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');

    let isPlaying = false;

    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicIcon.textContent = '▶︎ •၊၊||၊|။|||| | ';
            musicText.textContent = 'Play Music';
            isPlaying = false;
        } else {
            backgroundMusic.play();
            musicIcon.textContent = '▶︎ •၊၊||၊|။|||| | ';
            musicText.textContent = 'Pause Music';
            isPlaying = true;
        }
    });
});
