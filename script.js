document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initHackGame();
    initProjectFilters();
    initProjectCards();
});

// ==========================================================================
// SHORT INTRO (plays once per visit, fades out on its own, any input skips)
// ==========================================================================

function initIntro() {
    const landing = document.getElementById('landing');
    const bootLog = document.getElementById('boot-log');
    if (!landing) return;

    let seen = false;
    try { seen = sessionStorage.getItem('introSeen') === '1'; } catch (e) {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduced) {
        landing.classList.add('gone');
        return;
    }

    const lines = [
        "> boot portfolio.sys",
        "  loading projects ........ [OK]",
        "  compiling cel shaders ... [OK]",
        "  link established"
    ];
    let line = 0;
    let done = false;

    function printLine() {
        if (done || line >= lines.length) return;
        const text = lines[line++];
        const span = document.createElement('span');
        span.textContent = text.replace('[OK]', '');
        bootLog.appendChild(span);
        if (text.includes('[OK]')) {
            const ok = document.createElement('span');
            ok.className = 'ok';
            ok.textContent = '[OK]';
            bootLog.appendChild(ok);
        }
        bootLog.appendChild(document.createTextNode('\n'));
        setTimeout(printLine, 260);
    }
    printLine();

    function dismiss() {
        if (done) return;
        done = true;
        try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
        landing.classList.add('fade-out');
        setTimeout(() => landing.classList.add('gone'), 650);
        ['keydown', 'wheel', 'touchstart'].forEach(ev => window.removeEventListener(ev, dismiss));
    }

    landing.addEventListener('click', dismiss);
    ['keydown', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, dismiss, { passive: true }));
    setTimeout(dismiss, 2000);
}

// ==========================================================================
// PROJECT CARDS: click, Enter or Space opens the project
// ==========================================================================

function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        const key = card.getAttribute('data-project');
        card.addEventListener('click', () => openProjectModal(key));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(key);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('project-modal');
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeProjectModal();
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'ArrowLeft') changeSlide(-1);
    });
}

// ==========================================================================
// CATEGORY FILTER LOGIC
// ==========================================================================

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

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
    musou: {
        title: "Fantasy Musou (working title)",
        role: "Solo Developer & Technical Artist | Musou Action, Unity 6 URP, PC (in development)",
        gallery: [
            { type: 'image', src: 'assets/screenshots/warriors-1.webp', alt: 'Main menu with the posed hero' },
            { type: 'image', src: 'assets/screenshots/warriors-2.webp', alt: 'Battle HUD in a crowd fight' },
            { type: 'image', src: 'assets/screenshots/warriors-3.webp', alt: 'Heavy chain through a crowd of knights' },
            { type: 'image', src: 'assets/screenshots/warriors-4.webp', alt: 'Full Burst summon cut-in' },
            { type: 'image', src: 'assets/screenshots/warriors-5.webp', alt: 'Boss entrance cut-in' },
            { type: 'image', src: 'assets/screenshots/warriors-6.webp', alt: 'Slash arcs and knockdown rings through a combo' },
            { type: 'image', src: 'assets/screenshots/warriors-7.webp', alt: 'Final cel look on the hero' },
            { type: 'image', src: 'assets/screenshots/warriors-8.webp', alt: 'Sakuragawa Village Main Street' },
            { type: 'image', src: 'assets/screenshots/warriors-9.webp', alt: 'Procedural toon water' }
        ],
        features: [
            "<strong>Combat Feel:</strong> Data-driven combo tree (light string, heavy branches, air string, supers) with input buffering, dodge cancels, hit-stop and screen shake. Melee clips are time-warped onto the attack timings, so the play-tested feel never changes.",
            "<strong>Custom Toon Rendering:</strong> Hand-written URP HLSL cel shaders with ink outlines and a per-scene slider that blends the environment toward PBR while characters stay cel. Procedural toon water.",
            "<strong>Anime Impact Frames & Cut-ins:</strong> A full-screen Render Graph pass (rim-line, ink silhouette, neon cards with speed lines) and comic-panel cut-ins rendered from studio doubles.",
            "<strong>Crowds at Scale:</strong> Pooled soldiers with no colliders, flow-field pathing in Burst jobs, and animation update-rate LOD. A build holds 117 fps with 314 soldiers packed around the hero.",
            "<strong>Battlefield Systems:</strong> Capturable bases with morale, gatekeeper officers, an AI Mentor ally with an affinity-driven Awaken mode and joint finisher, a boss, and squads marching out of barracks.",
            "<strong>Level Tools:</strong> A 600 x 750 m village built by editor tools from the design doc, then dressed with a converted environment pack."
        ],
        retrospective: "A solo vertical slice built to show game feel and technical art together. Locking the combat timings first and fitting animation, VFX and cut-ins to them kept every art pass from breaking the feel. Character models, melee animations and the village art are store packs; the shaders, VFX, tools, systems and level layout are my own."
    },
    chrono: {
        title: "Chrono Trace",
        role: "Lead Designer & Product Manager | VR Parkour Prototype",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/oV1I2GuBmMg?rel=0' },
            { type: 'image', src: 'assets/screenshots/chrono-1.webp', alt: 'Chrono Trace VR Parkour' },
            { type: 'image', src: 'assets/screenshots/chrono-2.webp', alt: 'Locomotion Mechanics' }
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
            { type: 'image', src: 'assets/screenshots/pirates-1.webp', alt: 'Pirates Gameplay Encounter' },
            { type: 'image', src: 'assets/screenshots/pirates-2.webp', alt: 'Swordplay & Blocking System' },
            { type: 'image', src: 'assets/screenshots/pirates-3.webp', alt: 'Boss Phase & Cutscene Sync' }
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
            { type: 'image', src: 'assets/screenshots/rpg-1.webp', alt: '2.5D Turn-Based Encounter' },
            { type: 'image', src: 'assets/screenshots/rpg-2.webp', alt: 'Party Attack Interface' }
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
            { type: 'image', src: 'assets/screenshots/amber-1.webp', alt: 'Amber Forge Main Concept' },
            { type: 'image', src: 'assets/screenshots/amber-2.webp', alt: 'Item Crafting Economy Spreadsheet' },
            { type: 'image', src: 'assets/screenshots/amber-3.webp', alt: 'Live-Ops Seasonal Event Cadence' }
        ],
        features: [
            "<strong>Time-Based Crafting Queues:</strong> Balanced multi-tier item creation timers with raw material supply chains.",
            "<strong>Hero Expedition System:</strong> Class-based hero deployment mechanics to secure rare crafting ingredients.",
            "<strong>Player Marketplace:</strong> Item prices move with supply and demand across the player base.",
            "<strong>Live-Ops & Community Events:</strong> Server-wide collaborative crafting milestones and rotating event cadences."
        ],
        retrospective: "Designed as a scalable mobile GDD pitch, this project balances long-term player retention with satisfying daily crafting loops."
    },
    kings: {
        title: "King's Escape",
        role: "Systems & Gameplay Developer | 3D Endless Runner",
        gallery: [
            { type: 'image', src: 'assets/screenshots/kings-1.webp', alt: 'King\'s Escape Gameplay' },
            { type: 'image', src: 'assets/screenshots/kings-2.webp', alt: 'Game Over Logic & Scoring' },
            { type: 'image', src: 'assets/screenshots/kings-3.webp', alt: 'Lane Shifting & Obstacles' }
        ],
        features: [
            "<strong>Reused Track Pieces:</strong> Track chunks that leave the screen behind the player are recycled to the front instead of being created and destroyed.",
            "<strong>Difficulty Over Time:</strong> Run speed follows a curve that ramps up over the run, with lane switching kept tight at high speed.",
            "<strong>Modular Power-Up Architecture:</strong> ScriptableObject-driven architecture handling Shields, Magnets, and Multipliers."
        ],
        retrospective: "Taught me to plan for performance early: reusing objects instead of spawning new ones kept the run smooth even at top speed."
    },
    sins: {
        title: "Sins of the Garrison",
        role: "AI & Systems Designer | Horror Slasher Prototype",
        gallery: [
            { type: 'iframe', src: 'https://www.youtube.com/embed/1LPm2eSRojk?rel=0' },
            { type: 'image', src: 'assets/screenshots/sins-1.webp', alt: 'Sins Encounter' },
            { type: 'image', src: 'assets/screenshots/sins-2.webp', alt: 'Killer Sightlines' },
            { type: 'image', src: 'assets/screenshots/sins-3.webp', alt: 'Hiding & Objective Mechanics' }
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
            { type: 'image', src: 'assets/screenshots/eiffel-1.webp', alt: 'Eiffel Ascent VR Climbing' },
            { type: 'image', src: 'assets/screenshots/eiffel-2.webp', alt: 'Tower Lattice Collision' }
        ],
        features: [
            "<strong>Hand-Over-Hand Climbing:</strong> XR hand controllers grab the tower's ironwork directly.",
            "<strong>Grabbable Ironwork:</strong> Colliders set up across the open iron beams so hands catch where players expect them to.",
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
                <img src="${item.src}" alt="${item.alt || 'Project Image'}" loading="lazy" decoding="async">
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

    lastFocusedCard = document.activeElement;
    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelector('#project-modal .modal-close').focus();
}

let lastFocusedCard = null;

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

    // Stop a playing YouTube video by reloading its frame
    document.querySelectorAll('#modal-content-body iframe').forEach(f => { f.src = f.src; });

    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedCard && lastFocusedCard.focus) lastFocusedCard.focus();
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
        quote: "Did I ever tell you what the definition of insanity is? Insanity is doing the exact same thing over and over again, expecting things to change.",
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
        quote: "Wanna hear a joke? Bandits.",
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
