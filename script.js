```javascript
/* =========================================================
   AQSA — BIRTHDAY SURPRISE
   V2 — Interactive Experience Controller
========================================================= */

"use strict";


/* =========================================================
   01. DOM
========================================================= */

const screens = {
    intro: document.getElementById("intro"),
    name: document.getElementById("name-reveal"),
    birthday: document.getElementById("birthday"),
    letter: document.getElementById("letter"),
    duas: document.getElementById("duas"),
    final: document.getElementById("final")
};

const buttons = {
    open: document.getElementById("open-surprise"),
    nameNext: document.getElementById("continue-one"),
    birthdayNext: document.getElementById("continue-two"),
    letterNext: document.getElementById("continue-three"),
    duasNext: document.getElementById("continue-four"),
    replay: document.getElementById("replay")
};

const starsContainer =
    document.getElementById("stars");

const confettiContainer =
    document.getElementById("confetti-container");

const liveRegion =
    document.getElementById("live-region");


/* =========================================================
   02. EXPERIENCE STATE
========================================================= */

const screenOrder = [
    "intro",
    "name",
    "birthday",
    "letter",
    "duas",
    "final"
];

let currentScreen = "intro";

let isTransitioning = false;

let lastConfettiTime = 0;


/* =========================================================
   03. SAFETY CHECK
========================================================= */

function elementExists(element) {
    return element !== null &&
           element !== undefined;
}


/* =========================================================
   04. STARFIELD
========================================================= */

function createStars() {

    if (!elementExists(starsContainer)) {
        return;
    }

    /*
        Prevent duplicate stars if the
        initialization function runs again.
    */

    starsContainer.innerHTML = "";

    const isMobile =
        window.innerWidth <= 600;

    const starCount =
        isMobile ? 45 : 85;

    const fragment =
        document.createDocumentFragment();


    for (let i = 0; i < starCount; i++) {

        const star =
            document.createElement("span");

        star.className = "star";


        /*
            Random size
        */

        const size =
            Math.random() > 0.9
                ? 3
                : Math.random() > 0.5
                    ? 2
                    : 1;


        /*
            Random position
        */

        const left =
            Math.random() * 100;

        const top =
            Math.random() * 100;


        /*
            Random animation
        */

        const delay =
            Math.random() * 5;

        const duration =
            2.5 + Math.random() * 4;


        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.left =
            `${left}%`;

        star.style.top =
            `${top}%`;

        star.style.animationDelay =
            `${delay}s`;

        star.style.animationDuration =
            `${duration}s`;


        fragment.appendChild(star);
    }


    starsContainer.appendChild(fragment);
}


/* =========================================================
   05. GET SCREEN ELEMENT
========================================================= */

function getScreen(screenName) {

    return screens[screenName] || null;

}


/* =========================================================
   06. SCREEN TRANSITION
========================================================= */

function showScreen(
    screenName,
    options = {}
) {

    const {
        celebrate = true
    } = options;


    const nextScreen =
        getScreen(screenName);


    /*
        Invalid screen protection
    */

    if (!nextScreen) {
        console.warn(
            `Screen "${screenName}" does not exist.`
        );

        return;
    }


    /*
        Prevent accidental double transitions.
    */

    if (
        isTransitioning &&
        screenName !== "intro"
    ) {
        return;
    }


    /*
        Don't transition to the
        screen we're already viewing.
    */

    if (
        screenName === currentScreen &&
        screenName !== "intro"
    ) {
        return;
    }


    isTransitioning = true;


    /*
        Remove active state from every screen.
    */

    Object.values(screens).forEach(
        (screen) => {

            if (!elementExists(screen)) {
                return;
            }

            screen.classList.remove("active");

        }
    );


    /*
        Activate the new screen
        on the next animation frame.
    */

    requestAnimationFrame(() => {

        nextScreen.classList.add("active");

        currentScreen =
            screenName;

        announceScreen(
            screenName
        );


        /*
            Reset internal scroll position.
        */

        resetScreenScroll(
            nextScreen
        );


        /*
            Release transition lock.
        */

        window.setTimeout(
            () => {

                isTransitioning =
                    false;

            },
            850
        );

    });


    /*
        Birthday celebration
    */

    if (
        screenName === "birthday" &&
        celebrate
    ) {

        window.setTimeout(
            () => {

                createConfetti(55);

            },
            650
        );

    }


    /*
        Final celebration
    */

    if (
        screenName === "final" &&
        celebrate
    ) {

        window.setTimeout(
            () => {

                createConfetti(110);

                createSparkleBurst();

            },
            500
        );

    }

}


/* =========================================================
   07. RESET SCREEN SCROLL
========================================================= */

function resetScreenScroll(screen) {

    if (!elementExists(screen)) {
        return;
    }


    const scrollableElements =
        screen.querySelectorAll(
            ".letter-wrapper, .duas-content, .final-content"
        );


    scrollableElements.forEach(
        (element) => {

            element.scrollTop = 0;

        }
    );

}


/* =========================================================
   08. ACCESSIBILITY
========================================================= */

function announceScreen(screenName) {

    if (!elementExists(liveRegion)) {
        return;
    }


    const messages = {

        intro:
            "A surprise is waiting for Aqsa.",

        name:
            "The surprise is for Aqsa.",

        birthday:
            "Happy Birthday Aqsa.",

        letter:
            "A personal birthday letter from Iqra.",

        duas:
            "Birthday duas for Aqsa.",

        final:
            "The final birthday surprise for Aqsa."

    };


    liveRegion.textContent =
        messages[screenName] || "";

}


/* =========================================================
   09. CONFETTI
========================================================= */

function createConfetti(
    amount = 80
) {

    if (
        !elementExists(confettiContainer)
    ) {
        return;
    }


    /*
        Prevent repeated explosions
        if user clicks extremely quickly.
    */

    const now =
        Date.now();

    if (
        now - lastConfettiTime < 1000
    ) {
        return;
    }

    lastConfettiTime = now;


    /*
        Keep DOM lightweight.
    */

    if (
        confettiContainer.children.length > 180
    ) {

        confettiContainer.innerHTML = "";

    }


    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const piece =
            document.createElement("span");


        piece.className =
            "confetti";


        /*
            Position
        */

        piece.style.left =
            `${Math.random() * 100}%`;


        /*
            Animation timing
        */

        piece.style.animationDuration =
            `${3 + Math.random() * 4}s`;

        piece.style.animationDelay =
            `${Math.random() * 0.8}s`;


        /*
            Horizontal movement
        */

        piece.style.setProperty(
            "--drift",
            `${(Math.random() - 0.5) * 260}px`
        );


        /*
            Random size
        */

        piece.style.width =
            `${4 + Math.random() * 5}px`;

        piece.style.height =
            `${7 + Math.random() * 9}px`;


        /*
            Random shape
        */

        const shape =
            Math.random();


        if (shape < 0.33) {

            piece.style.borderRadius =
                "50%";

        }
        else if (shape < 0.66) {

            piece.style.borderRadius =
                "2px";

        }
        else {

            piece.style.borderRadius =
                "0";

        }


        /*
            Random rotation.
            This is handled separately from
            the falling animation.
        */

        piece.style.setProperty(
            "--rotation",
            `${Math.random() * 360}deg`
        );


        fragment.appendChild(piece);

    }


    confettiContainer.appendChild(
        fragment
    );


    /*
        Remove old pieces later.
    */

    window.setTimeout(
        () => {

            const pieces =
                confettiContainer.querySelectorAll(
                    ".confetti"
                );


            pieces.forEach(
                (piece) => {

                    piece.remove();

                }
            );

        },
        8500
    );

}


/* =========================================================
   10. SPARKLE BURST
========================================================= */

function createSparkleBurst() {

    const finalScreen =
        screens.final;


    if (!elementExists(finalScreen)) {
        return;
    }


    const sparkleCount = 22;


    for (
        let i = 0;
        i < sparkleCount;
        i++
    ) {

        const sparkle =
            document.createElement("span");


        sparkle.textContent =
            Math.random() > 0.5
                ? "✦"
                : "✧";


        sparkle.style.position =
            "absolute";


        sparkle.style.left =
            "50%";

        sparkle.style.top =
            "45%";


        sparkle.style.color =
            "rgba(216, 184, 120, 0.85)";


        sparkle.style.fontSize =
            `${10 + Math.random() * 14}px`;


        sparkle.style.pointerEvents =
            "none";


        sparkle.style.zIndex =
            "20";


        sparkle.style.opacity =
            "0";


        sparkle.style.transform =
            "translate(-50%, -50%) scale(0.3)";


        sparkle.style.transition =
            "opacity 1.6s ease-out, transform 1.8s ease-out";


        finalScreen.appendChild(
            sparkle
        );


        requestAnimationFrame(
            () => {

                const angle =
                    Math.random() *
                    Math.PI *
                    2;


                const distance =
                    70 +
                    Math.random() *
                    180;


                const x =
                    Math.cos(angle) *
                    distance;


                const y =
                    Math.sin(angle) *
                    distance;


                sparkle.style.opacity =
                    "1";


                sparkle.style.transform =
                    `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.3)`;

            }
        );


        window.setTimeout(
            () => {

                sparkle.style.opacity =
                    "0";

            },
            900
        );


        window.setTimeout(
            () => {

                sparkle.remove();

            },
            2100
        );

    }

}


/* =========================================================
   11. BUTTON LISTENERS
========================================================= */


/*
    Intro
*/

if (elementExists(buttons.open)) {

    buttons.open.addEventListener(
        "click",
        () => {

            showScreen("name");

        }
    );

}


/*
    Name
*/

if (elementExists(buttons.nameNext)) {

    buttons.nameNext.addEventListener(
        "click",
        () => {

            showScreen("birthday");

        }
    );

}


/*
    Birthday
*/

if (elementExists(buttons.birthdayNext)) {

    buttons.birthdayNext.addEventListener(
        "click",
        () => {

            showScreen("letter");

        }
    );

}


/*
    Letter
*/

if (elementExists(buttons.letterNext)) {

    buttons.letterNext.addEventListener(
        "click",
        () => {

            showScreen("duas");

        }
    );

}


/*
    Duas
*/

if (elementExists(buttons.duasNext)) {

    buttons.duasNext.addEventListener(
        "click",
        () => {

            showScreen("final");

        }
    );

}


/*
    Replay
*/

if (elementExists(buttons.replay)) {

    buttons.replay.addEventListener(
        "click",
        () => {

            /*
                Clear celebrations.
            */

            confettiContainer.innerHTML = "";


            /*
                Remove sparkle elements.
            */

            const sparkleElements =
                screens.final.querySelectorAll(
                    "span:not(.eyebrow)"
                );


            sparkleElements.forEach(
                (element) => {

                    if (
                        element.textContent === "✦" ||
                        element.textContent === "✧"
                    ) {

                        element.remove();

                    }

                }
            );


            /*
                Return to beginning.
            */

            showScreen(
                "intro",
                {
                    celebrate: false
                }
            );

        }
    );

}


/* =========================================================
   12. KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            Ignore keyboard navigation while
            typing in an input/textarea.
        */

        const target =
            event.target;


        if (
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA"
            )
        ) {

            return;

        }


        /*
            Escape → beginning
        */

        if (
            event.key === "Escape"
        ) {

            showScreen(
                "intro",
                {
                    celebrate: false
                }
            );

            return;

        }


        /*
            Right arrow → next
        */

        if (
            event.key === "ArrowRight"
        ) {

            goToNextScreen();

            return;

        }


        /*
            Left arrow → previous
        */

        if (
            event.key === "ArrowLeft"
        ) {

            goToPreviousScreen();

        }

    }
);


/* =========================================================
   13. NEXT SCREEN
========================================================= */

function goToNextScreen() {

    const index =
        screenOrder.indexOf(
            currentScreen
        );


    if (
        index === -1 ||
        index >= screenOrder.length - 1
    ) {

        return;

    }


    showScreen(
        screenOrder[index + 1]
    );

}


/* =========================================================
   14. PREVIOUS SCREEN
========================================================= */

function goToPreviousScreen() {

    const index =
        screenOrder.indexOf(
            currentScreen
        );


    if (
        index <= 0
    ) {

        return;

    }


    showScreen(
        screenOrder[index - 1],
        {
            celebrate: false
        }
    );

}


/* =========================================================
   15. TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;


document.addEventListener(
    "touchstart",
    (event) => {

        const touch =
            event.changedTouches[0];


        if (!touch) {
            return;
        }


        touchStartX =
            touch.screenX;

        touchStartY =
            touch.screenY;

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchend",
    (event) => {

        const touch =
            event.changedTouches[0];


        if (!touch) {
            return;
        }


        const touchEndX =
            touch.screenX;

        const touchEndY =
            touch.screenY;


        const differenceX =
            touchEndX -
            touchStartX;


        const differenceY =
            touchEndY -
            touchStartY;


        /*
            If vertical movement is greater,
            this was scrolling — not a swipe.
        */

        if (
            Math.abs(differenceY) >
            Math.abs(differenceX)
        ) {

            return;

        }


        /*
            Ignore tiny movements.
        */

        if (
            Math.abs(differenceX) < 75
        ) {

            return;

        }


        /*
            Left → next
        */

        if (
            differenceX < 0
        ) {

            goToNextScreen();

        }


        /*
            Right → previous
        */

        if (
            differenceX > 0
        ) {

            goToPreviousScreen();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   16. BUTTON FOCUS
========================================================= */

document
    .querySelectorAll("button")
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    button.blur();

                }
            );

        }
    );


/* =========================================================
   17. WINDOW RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        window.clearTimeout(
            resizeTimer
        );


        resizeTimer =
            window.setTimeout(
                () => {

                    createStars();

                },
                250
            );

    }
);


/* =========================================================
   18. INITIALIZATION
========================================================= */

function initialize() {

    /*
        Generate stars.
    */

    createStars();


    /*
        Make absolutely sure
        only intro is active.
    */

    Object.values(screens).forEach(
        (screen) => {

            if (!elementExists(screen)) {
                return;
            }

            screen.classList.remove(
                "active"
            );

        }
    );


    screens.intro.classList.add(
        "active"
    );


    currentScreen =
        "intro";


    isTransitioning =
        false;


    announceScreen(
        "intro"
    );

}


/* =========================================================
   19. START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize,
        {
            once: true
        }
    );

}
else {

    initialize();

}
```
