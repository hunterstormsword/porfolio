document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');
    const landing = document.getElementById('landing');
    const mainContent = document.getElementById('main-content');
    const typingText = document.getElementById('typing-text');

    const promptMessage = "Accessing encrypted design files...";
    let charIndex = 0;

    function typeTerminalMessage() {
        if (charIndex < promptMessage.length) {
            typingText.textContent += promptMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeTerminalMessage, 45);
        }
    }

    setTimeout(() => {
        typingText.textContent = "";
        typeTerminalMessage();
    }, 800);

    function playDecryptionSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();

            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(80, ctx.currentTime);
            subOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
            subGain.gain.setValueAtTime(0.4, ctx.currentTime);
            subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chimeOsc.type = 'triangle';
            chimeOsc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.05);
            chimeOsc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
            chimeOsc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.25);
            chimeGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.05);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

            subOsc.connect(subGain);
            subGain.connect(ctx.destination);
            chimeOsc.connect(chimeGain);
            chimeGain.connect(ctx.destination);

            subOsc.start(ctx.currentTime);
            chimeOsc.start(ctx.currentTime + 0.05);
            subOsc.stop(ctx.currentTime + 0.6);
            chimeOsc.stop(ctx.currentTime + 0.7);
        } catch (e) {
            console.log("Audio blocked");
        }
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            playDecryptionSound();
            landing.classList.add('fade-out');
            mainContent.classList.remove('hidden');

            setTimeout(() => {
                landing.style.display = 'none';
            }, 800);
        });
    }

    initHackGame();
    initProjectFilters();
});

// ==========================================================================
// CATEGORY FILTER LOGIC
// ==========================================================================

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.cyber-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('card-hidden');
                } else {
                    card.classList.add('card-hidden');
                }
            });
        });
    });
}

// ==========================================================================
// DYNAMIC MODAL DATA (YOUTUBE EMBED INTEGRATION)
// ==========================================================================

const projectData = {
    chrono: {
        title: "Chrono Trace",
        role: "Lead Designer & Product Manager | VR Parkour Prototype",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/oV1I2GuBmMg?rel=0' },
            { type: 'image', src: 'assets/screenshots/chrono-1.png', alt: 'Chrono Trace VR Parkour' },
            { type: 'image', src: 'assets/screenshots/chrono-2.png', alt: 'Locomotion Mechanics' },
            { type: 'image', src: 'assets/screenshots/chrono-3.png', alt: 'Environmental Narrative' }
        ],
        features: [
            "<strong>Physics-Based VR Locomotion:</strong> Authored climbing mechanics using Rigidbody calculations and momentum retention.",
            "<strong>Environmental Narrative Triggers:</strong> Unfolded story beats organically via architectural milestones instead of UI text overlays.",
            "<strong>Immersive Audio Dynamics:</strong> Integrated velocity-responsive spatial audio cues to reinforce physical presence."
        ],
        retrospective: "Working on Chrono Trace proved that player pacing is just as vital as movement speed in VR. Rethinking this today, I would implement automated character rigging tests on irregular geometry to optimize momentum transfers across all surfaces."
    },
    pirates: {
        title: "Pirates of the High Seas",
        role: "Systems & Combat Designer | Hack 'n' Slash Encounter",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/ygkn0eqHeRE?rel=0' },
            { type: 'image', src: 'assets/screenshots/pirates-1.png', alt: 'Pirates Gameplay Encounter' },
            { type: 'image', src: 'assets/screenshots/pirates-2.png', alt: 'Swordplay & Blocking System' },
            { type: 'image', src: 'assets/screenshots/pirates-3.png', alt: 'Boss Phase & Cutscene Sync' }
        ],
        features: [
            "<strong>Frame-Accurate Melee Combat:</strong> Structured attack and block loops relying on precise input registration.",
            "<strong>Dynamic Boss AI Reactivity:</strong> AI adjusts attack aggression based on player stance and defensive choices.",
            "<strong>Cinematic Cutscene Sync:</strong> Synchronized Timeline camera transitions with combat phase shifts seamlessly."
        ],
        retrospective: "If rebuilding this encounter today, I would implement an input buffering system and animation blend trees. This would allow players to cancel recovery frames into defensive blocks instantly, making swordplay feel dramatically tighter."
    },
    rpg: {
        title: "2.5D RPG",
        role: "Systems & Gameplay Designer | Turn-Based Combat Prototype",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/B3PK0brdMUI?rel=0' },
            { type: 'image', src: 'assets/screenshots/rpg-1.png', alt: '2.5D Turn-Based Encounter' },
            { type: 'image', src: 'assets/screenshots/rpg-2.png', alt: 'Party Attack Interface' }
        ],
        features: [
            "<strong>Decoupled Input Architecture:</strong> Utilized the Unity Input System to separate input logic from core gameplay code, allowing turn-based party commands to stack cleanly without execution interference.",
            "<strong>Enemy AI & State Management:</strong> Implemented a Finite State Machine (FSM) managing attack patterns, idle resets, and aggression scaling triggered by specific health thresholds.",
            "<strong>Dynamic Camera Feedback:</strong> Integrated Cinemachine camera shake and dynamic framing to reinforce impact during swordplay encounters."
        ],
        retrospective: "Being a first-year project, this was my introduction to complex state logic. If I were to refactor this today, I would move away from a basic Update() loop architecture toward a modular Command Pattern for turn-based combat inputs."
    },
    amber: {
        title: "The Amber Forge",
        role: "Game PM & Economy Designer | Midcore Mobile Tycoon Concept",
        gallery: [
            { type: 'image', src: 'assets/screenshots/amber-1.png', alt: 'Amber Forge Main Concept' },
            { type: 'image', src: 'assets/screenshots/amber-2.png', alt: 'Item Crafting Economy Spreadsheet' },
            { type: 'image', src: 'assets/screenshots/amber-3.png', alt: 'Live-Ops Seasonal Event Cadence' }
        ],
        features: [
            "<strong>Time-Based Crafting Queues:</strong> Balanced multi-tier item creation timers with raw material supply chains.",
            "<strong>Hero Expedition System:</strong> Class-based hero deployment mechanics to secure rare crafting ingredients.",
            "<strong>Simulated Player Marketplace:</strong> Macro-level supply and demand shifts driving dynamic item valuation.",
            "<strong>Live-Ops & Community Events:</strong> Server-wide collaborative crafting milestones and rotating event cadences."
        ],
        retrospective: "Designed as a scalable mobile GDD pitch, this project balances long-term player retention with satisfying daily crafting loops."
    },
    kings: {
        title: "King's Escape",
        role: "Systems & Gameplay Developer | 3D Endless Runner",
        gallery: [
            { type: 'image', src: 'assets/screenshots/kings-1.png', alt: 'King\'s Escape Gameplay' },
            { type: 'image', src: 'assets/screenshots/kings-2.png', alt: 'Game Over Logic & Scoring' },
            { type: 'image', src: 'assets/screenshots/kings-3.png', alt: 'Lane Shifting & Obstacles' }
        ],
        features: [
            "<strong>Procedural Chunk Pooling:</strong> Memory-managed object pooling recycling terrain chunks behind the player camera.",
            "<strong>Dynamic Speed Curves:</strong> Mathematical velocity scaling coupled with lane-switching tighteners.",
            "<strong>Modular Power-Up Architecture:</strong> ScriptableObject-driven architecture handling Shields, Magnets, and Multipliers."
        ],
        retrospective: "Demonstrates clean object management and zero runtime allocation spikes during high-speed endless gameplay loops."
    },
    sins: {
        title: "Sins of the Garrison",
        role: "AI & Systems Designer | Horror Slasher Prototype",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/1LPm2eSRojk?rel=0' },
            { type: 'image', src: 'assets/screenshots/sins-1.png', alt: 'Sins Encounter' },
            { type: 'image', src: 'assets/screenshots/sins-2.png', alt: 'Killer Sightlines' },
            { type: 'image', src: 'assets/screenshots/sins-3.png', alt: 'Hiding & Objective Mechanics' }
        ],
        features: [
            "<strong>Dual Vision & Sound Detection:</strong> Raycasting line-of-sight paired with player noise broadcast radiuses.",
            "<strong>4-Phase AI State Machine:</strong> Patrol, Investigate, Chase, and Search behavioral loops built on an FSM.",
            "<strong>Atmospheric Feedback:</strong> Dynamic post-processing vignette and chromatic aberration tied to killer proximity."
        ],
        retrospective: "My introduction to complex sensory AI in Unity. Refactoring this today, I would replace the rigid FSM with GOAP (Goal-Oriented Action Planning) to give the killer unpredictable tracking behaviors."
    },
    eiffel: {
        title: "Eiffel Ascent",
        role: "VR Gameplay Developer | WWII Climbing Proof-of-Concept",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/9lzC8o3u1r4?rel=0' },
            { type: 'image', src: 'assets/screenshots/eiffel-1.png', alt: 'Eiffel Ascent VR Climbing' },
            { type: 'image', src: 'assets/screenshots/eiffel-2.png', alt: 'Tower Lattice Collision' }
        ],
        features: [
            "<strong>VR XR Climbing Interactors:</strong> Direct hand tracking mapped to ironwork structural grab points.",
            "<strong>Lattice Geometry Collision:</strong> Optimized collision matrix tracking hand presence across open iron beams.",
            "<strong>Objective State Tracking:</strong> Spatial interaction sequence for arming and positioning bomb devices."
        ],
        retrospective: "Foundational prototype for Chrono Trace. If rebuilding today, I would introduce dynamic Inverse Kinematics (IK) and surface friction metrics to simulate rain on cold metal."
    }
};

let currentSlideIndex = 0;
let currentGalleryLength = 0;

function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    const modalBody = document.getElementById('modal-content-body');
    currentSlideIndex = 0;
    currentGalleryLength = data.gallery.length;

    let gallerySlidesHTML = data.gallery.map((item, index) => {
        const activeClass = index === 0 ? 'active' : '';
        if (item.type === 'iframe') {
            return `<div class="carousel-slide ${activeClass}">
                <iframe 
                    src="${item.src}" 
                    style="width: 100%; height: 100%; border: none;" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>`;
        } else if (item.type === 'video') {
            return `<div class="carousel-slide ${activeClass}">
                <video controls playsinline preload="metadata">
                    <source src="${item.src}" type="video/mp4">
                </video>
            </div>`;
        } else {
            return `<div class="carousel-slide ${activeClass}">
                <img src="${item.src}" alt="${item.alt || 'Project Image'}">
            </div>`;
        }
    }).join('');

    let carouselControlsHTML = '';
    if (currentGalleryLength > 1) {
        carouselControlsHTML = `
            <button class="carousel-btn prev" onclick="changeSlide(-1)">&#10094;</button>
            <button class="carousel-btn next" onclick="changeSlide(1)">&#10095;</button>
            <div class="carousel-counter" id="carousel-counter">1 / ${currentGalleryLength}</div>
        `;
    }

    let featuresHTML = data.features.map(f => `<li>${f}</li>`).join('');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${data.title}</h2>
            <div class="modal-role">${data.role}</div>
        </div>
        <div class="carousel-container">
            ${gallerySlidesHTML}
            ${carouselControlsHTML}
        </div>
        <div class="modal-section-title">Core Systems & Implementation</div>
        <ul class="modal-list">
            ${featuresHTML}
        </ul>
        <div class="retrospective-box">
            <strong>Retrospective & PM Scoping Takeaways:</strong>
            ${data.retrospective}
        </div>
    `;

    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    const currentVideo = slides[currentSlideIndex].querySelector('video');
    if (currentVideo) currentVideo.pause();

    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');

    const counter = document.getElementById('carousel-counter');
    if (counter) {
        counter.innerText = `${currentSlideIndex + 1} / ${slides.length}`;
    }
}

function closeProjectModal() {
    const activeVideo = document.querySelector('.carousel-slide.active video');
    if (activeVideo) activeVideo.pause();

    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeProjectModal();
    }
});

// ==========================================================================
// MINI-GAME: ICE BREAKER TERMINAL HACK LOGIC (RANDOMIZED QUOTES)
// ==========================================================================

const matrixHexCodes = ["BD", "55", "1C", "E9", "7A", "FF", "A3", "44", "0F", "2B", "9C", "D8"];

const gameQuotes = [
    {
        quote: "To say that everything is permitted is to understand that we are the architects of our actions, and that we must live with their consequences, whether glorious or tragic.",
        game: "Assassin's Creed II",
        speaker: "Ezio Auditore da Firenze"
    },
    {
        quote: "You want to know something funny? Even after everything you've done... I would have saved you.",
        game: "Batman: Arkham City",
        speaker: "Batman"
    },
    {
        quote: "The system isn't broken, it's designed this way. We're here to break it back.",
        game: "Watch Dogs 2",
        speaker: "Marcus Holloway"
    },
    {
        quote: "Do not be sorry. Be better.",
        game: "God of War (2018)",
        speaker: "Kratos"
    },
    {
        quote: "I guess no matter how hard you try, you can't escape your past... You keep surging forward, because you have to.",
        game: "The Last of Us",
        speaker: "Joel Miller"
    },
    {
        quote: "Did I ever tell you what the definition of insanity is? Insanity is doing the exact... same fucking thing... over and over again expecting... shit to change.",
        game: "Far Cry 3",
        speaker: "Vaas Montenegro"
    },
    {
        quote: "I fear no man. But that... thing... it scares me.",
        game: "Team Fortress 2",
        speaker: "Heavy"
    },
    {
        quote: "The right man in the wrong place can make all the difference in the world.",
        game: "Half-Life 2",
        speaker: "G-Man"
    },
    {
        quote: "Against all the evil that Hell can conjure, all the wickedness that mankind can produce, we will send unto them... only you. Rip and tear, until it is done.",
        game: "DOOM (2016)",
        speaker: "King Novik / Intro Narrator"
    },
    {
        quote: "A man who doesn't eat pork bun is never a whole man!",
        game: "Sleeping Dogs",
        speaker: "Pork Bun Vendor"
    },
    {
        quote: "Welcome to Pandora, kiddos! ... The moral of the story is: you're a total bitch.",
        game: "Borderlands 2",
        speaker: "Handsome Jack"
    },
    {
        quote: "The first duty of a revolutionary is to be educated.",
        game: "Disco Elysium",
        speaker: "Measurehead / Thought Cabinet"
    },
    {
        quote: "I used to be an adventurer like you, then I took an arrow in the knee...",
        game: "The Elder Scrolls V: Skyrim",
        speaker: "Guard"
    },
    {
        quote: "Magic is dangerous, just like a sword is dangerous. It's all in who holds it.",
        game: "Dragon Age: Origins",
        speaker: "Morrigan"
    },
    {
        quote: "I'm Commander Shepard, and this is my favorite store on the Citadel.",
        game: "Mass Effect 2",
        speaker: "Commander Shepard"
    },
    {
        quote: "Your adventure in the Maple World begins now! Protect Henesys!",
        game: "MapleStory",
        speaker: "Chief Stan"
    },
    {
        quote: "The cake is a lie. But science requires testing.",
        game: "Portal",
        speaker: "GLaDOS"
    },
    {
        quote: "You were a child. A vessel for the Force. Now you are a Master.",
        game: "Star Wars: The Force Unleashed",
        speaker: "Darth Vader"
    },
    {
        quote: "Cybertron is our home. We will fight for it, no matter the cost.",
        game: "Transformers: War for Cybertron",
        speaker: "Optimus Prime"
    },
    {
        quote: "Evil is evil. Lesser, greater, middling… Makes no difference. The degree is arbitrary. The definition's blurred. If I'm to choose between one evil and another… I'd rather not choose at all.",
        game: "The Witcher 3: Wild Hunt",
        speaker: "Geralt of Rivia"
    }
];

let targetSequence = [];
let playerSequence = [];
let attemptsLeft = 3;

function initHackGame() {
    attemptsLeft = 3;
    playerSequence = [];
    
    const rewardOverlay = document.getElementById('hack-reward-overlay');
    const statusText = document.getElementById('hack-status-text');
    const targetSeqDisplay = document.getElementById('target-seq-display');
    const gridContainer = document.getElementById('matrix-grid');

    if (!rewardOverlay || !statusText || !targetSeqDisplay || !gridContainer) return;

    rewardOverlay.classList.add('hidden');
    statusText.innerText = "STATUS: ICE_ACTIVE";
    statusText.style.color = "var(--cyber-cyan)";

    updateAttemptsDisplay();

    const pool = [...matrixHexCodes].sort(() => 0.5 - Math.random());
    targetSequence = pool.slice(0, 3);
    targetSeqDisplay.innerText = targetSequence.join(" ");

    const gridDisplayCodes = [...pool].sort(() => 0.5 - Math.random());

    gridContainer.innerHTML = "";

    gridDisplayCodes.forEach((code) => {
        const node = document.createElement('div');
        node.className = 'matrix-node';
        node.innerText = code;
        node.onclick = () => handleNodeClick(node, code);
        gridContainer.appendChild(node);
    });
}

function displayRandomQuote() {
    const randomItem = gameQuotes[Math.floor(Math.random() * gameQuotes.length)];
    const quoteBox = document.querySelector('.reward-quote');
    
    if (quoteBox) {
        quoteBox.innerHTML = `
            "${randomItem.quote}"
            <br><br>
            <strong style="color: var(--cyber-yellow); display: block; font-size: 0.85rem;">
                — ${randomItem.speaker} [${randomItem.game}]
            </strong>
        `;
    }
}

function handleNodeClick(node, code) {
    if (playerSequence.length >= 3 || node.classList.contains('selected')) return;

    if (code === targetSequence[playerSequence.length]) {
        node.classList.add('selected');
        playerSequence.push(code);

        if (playerSequence.length === targetSequence.length) {
            displayRandomQuote();
            setTimeout(() => {
                document.getElementById('hack-reward-overlay').classList.remove('hidden');
            }, 400);
        }
    } else {
        node.classList.add('wrong');
        attemptsLeft--;
        updateAttemptsDisplay();

        setTimeout(() => {
            node.classList.remove('wrong');
        }, 500);

        if (attemptsLeft <= 0) {
            const statusText = document.getElementById('hack-status-text');
            if (statusText) {
                statusText.innerText = "STATUS: ICE_LOCKOUT // RETRYING";
                statusText.style.color = "var(--cyber-red)";
            }
            setTimeout(initHackGame, 1200);
        }
    }
}

function updateAttemptsDisplay() {
    const dotsContainer = document.getElementById('attempts-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = i < attemptsLeft ? 'dot active' : 'dot';
        dotsContainer.appendChild(dot);
    }
}