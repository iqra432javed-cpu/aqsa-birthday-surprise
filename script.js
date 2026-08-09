```javascript
/* =========================================================
   AQSA — BIRTHDAY SURPRISE
   Interactive Experience Controller
========================================================= */


/* =========================================================
   01. ELEMENTS
========================================================= */

const screens = {
    intro: document.getElementById("intro"),
    name: document.getElementById("name-reveal"),
    birthday: document.getElementById("birthday"),
    letter: document.getElementById("letter"),
    duas: document.getElementById("duas"),
    final: document.getElementById("final")
};

const openSurprise = document.getElementById("open-surprise");
const continueOne = document.getElementById("continue-one");
const continueTwo = document.getElementById("continue-two");
const continueThree = document.getElementById("continue-three");
const continueFour = document.getElementById("continue-four");
const replayButton = document.getElementById("replay");

const starsContainer = document.getElementById("stars");
const confettiContainer = document.getElementById("confetti-container");
const liveRegion = document.getElementById("live-region");


/* =========================================================
   02. STATE
========================================================= */

let currentScreen = "intro";
let confettiStarted = false;


/* =========================================================
   03. CREATE STARFIELD
========================================================= */

function createStars() {

    if (!starsContainer) return;

    const starCount =
        window.innerWidth < 600
            ? 45
            : 85;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {

        const star = document.createElement("span");

        star.className = "star";

        const size =
            Math.random() > 0.9
                ? 3
                : Math.random() > 0.5
                    ? 2
                    : 1;

        const left = Math.random() * 100;
        const top = Math.random() * 100;

        const delay = Math.random() * 5;
        const duration = 2.2 + Math.random() * 4;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${left}%`;
        star.style.top = `${top}%`;

        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;

        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}


/* =========================================================
   04. SCREEN TRANSITION
========================================================= */

function showScreen(screenName) {

    const nextScreen = screens[screenName];

    if (!nextScreen) return;

    Object.values(screens).forEach((screen) => {

        if (!screen) return;

        screen.classList.remove("active");

    });


    /*
        Small delay gives the browser time to
        process the previous screen state before
        activating the next one.
    */

    requestAnimationFrame(() => {

        nextScreen.classList.add("active");

        currentScreen = screenName;

        announceScreen(screenName);

    });


    /*
        Every time a new screen appears,
        move its scroll position back to the top.
    */

    const scrollableElement =
        nextScreen.querySelector(
            ".letter-wrapper, .duas-content, .final-content"
        );

    if (scrollableElement) {
        scrollableElement.scrollTop = 0;
    }


    /*
        Birthday reveal gets a special effect.
    */

    if (screenName === "birthday") {

        setTimeout(() => {
            createConfetti(55);
        }, 700);

    }


    /*
        Final screen gets the biggest celebration.
    */

    if (screenName === "final") {

        setTimeout(() => {

            createConfetti(120);

            createSparkleBurst();

        }, 500);

    }
}


/* =========================================================
   05. ACCESSIBILITY ANNOUNCEMENTS
========================================================= */

function announceScreen(screenName) {

    if (!liveRegion) return;

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
            "Final birthday surprise for Aqsa."

    };

    liveRegion.textContent =
        messages[screenName] || "";

}


/* =========================================================
   06. CONFETTI
========================================================= */

function createConfetti(amount = 80) {

    if (!confettiContainer) return;

    const fragment = document.createDocumentFragment();

    /*
        Keep the DOM clean.
    */

    if (confettiContainer.children.length > 250) {

        confettiContainer.innerHTML = "";

    }


    for (let i = 0; i < amount; i++) {

        const piece =
            document.createElement("span");

        piece.className = "confetti";


        /*
            Random horizontal position
        */

        piece.style.left =
            `${Math.random() * 100}%`;


        /*
            Random fall duration
        */

        const duration =
            3 + Math.random() * 4;

        piece.style.animationDuration =
            `${duration}s`;


        /*
            Random starting delay
        */

        piece.style.animationDelay =
            `${Math.random() * 1.2}s`;


        /*
            Random horizontal drift
        */

        const drift =
            (Math.random() - 0.5) * 260;

        piece.style.setProperty(
            "--drift",
            `${drift}px`
        );


        /*
            Random shape
        */

        const shape =
            Math.random();

        if (shape < 0.33) {

            piece.style.borderRadius = "50%";

        } else if (shape < 0.66) {

            piece.style.borderRadius = "2px";

        } else {

            piece.style.borderRadius = "0";

            piece.style.transform =
                "rotate(45deg)";

        }


        /*
            Random size
        */

        const width =
            4 + Math.random() * 5;

        const height =
            7 + Math.random() * 9;

        piece.style.width =
            `${width}px`;

        piece.style.height =
            `${height}px`;


        /*
            CSS custom property for varied
            opacity.
        */

        piece.style.opacity =
            `${0.55 + Math.random() * 0.45}`;


        fragment.appendChild(piece);

    }


    confettiContainer.appendChild(fragment);


    /*
        Automatically remove finished confetti.
    */

    setTimeout(() => {

        const pieces =
            confettiContainer.querySelectorAll(
                ".confetti"
            );

        pieces.forEach((piece) => {

            if (
                piece.getBoundingClientRect().top >
                window.innerHeight
            ) {

                piece.remove();

            }

        });

    }, 8000);

}


/* =========================================================
   07. FINAL SPARKLE BURST
========================================================= */

function createSparkleBurst() {

    const finalScreen =
        screens.final;

    if (!finalScreen) return;


    const sparkleCount = 20;

    for (let i = 0; i < sparkleCount; i++) {

        const sparkle =
            document.createElement("span");

        sparkle.textContent =
            Math.random() > 0.5
                ? "✦"
                : "✧";

        sparkle.style.position =
            "absolute";

        sparkle.style.left =
            `${40 + Math.random() * 20}%`;

        sparkle.style.top =
            `${35 + Math.random() * 30}%`;

        sparkle.style.color =
            "rgba(216, 184, 120, 0.8)";

        sparkle.style.fontSize =
            `${10 + Math.random() * 14}px`;

        sparkle.style.pointerEvents =
            "none";

        sparkle.style.zIndex =
            "10";

        sparkle.style.opacity =
            "0";

        sparkle.style.transition =
            "all 1.8s ease-out";


        finalScreen.appendChild(sparkle);


        /*
            Trigger animation after insertion.
        */

        requestAnimationFrame(() => {

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                70 + Math.random() * 170;

            const x =
                Math.cos(angle) * distance;

            const y =
                Math.sin(angle) * distance;

            sparkle.style.opacity = "1";

            sparkle.style.transform =
                `translate(${x}px, ${y}px) scale(1.4)`;

        });


        /*
            Clean up.
        */

        setTimeout(() => {

            sparkle.style.opacity = "0";

        }, 1000);


        setTimeout(() => {

            sparkle.remove();

        }, 2200);

    }

}


/* =========================================================
   08. BUTTON EVENTS
========================================================= */


/*
    Intro → Name
*/

if (openSurprise) {

    openSurprise.addEventListener(
        "click",
        () => {

            showScreen("name");

        }
    );

}


/*
    Name → Birthday
*/

if (continueOne) {

    continueOne.addEventListener(
        "click",
        () => {

            showScreen("birthday");

        }
    );

}


/*
    Birthday → Letter
*/

if (continueTwo) {

    continueTwo.addEventListener(
        "click",
        () => {

            showScreen("letter");

        }
    );

}


/*
    Letter → Duas
*/

if (continueThree) {

    continueThree.addEventListener(
        "click",
        () => {

            showScreen("duas");

        }
    );

}


/*
    Duas → Final
*/

if (continueFour) {

    continueFour.addEventListener(
        "click",
        () => {

            showScreen("final");

        }
    );

}


/*
    Final → Beginning
*/

if (replayButton) {

    replayButton.addEventListener(
        "click",
        () => {

            confettiContainer.innerHTML = "";

            showScreen("intro");

        }
    );

}


/* =========================================================
   09. KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            Escape does not close the experience,
            but it safely returns to the beginning.
        */

        if (event.key === "Escape") {

            showScreen("intro");

        }


        /*
            ArrowRight can move forward.
        */

        if (event.key === "ArrowRight") {

            const order = [
                "intro",
                "name",
                "birthday",
                "letter",
                "duas",
                "final"
            ];

            const currentIndex =
                order.indexOf(currentScreen);

            if (
                currentIndex >= 0 &&
                currentIndex < order.length - 1
            ) {

                showScreen(
                    order[currentIndex + 1]
                );

            }

        }


        /*
            ArrowLeft moves backward.
        */

        if (event.key === "ArrowLeft") {

            const order = [
                "intro",
                "name",
                "birthday",
                "letter",
                "duas",
                "final"
            ];

            const currentIndex =
                order.indexOf(currentScreen);

            if (currentIndex > 0) {

                showScreen(
                    order[currentIndex - 1]
                );

            }

        }

    }
);


/* =========================================================
   10. TOUCH SWIPE NAVIGATION
========================================================= */

let touchStartX = 0;
let touchStartY = 0;


document.addEventListener(
    "touchstart",
    (event) => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.screenX;

        touchStartY =
            touch.screenY;

    },
    { passive: true }
);


document.addEventListener(
    "touchend",
    (event) => {

        const touch =
            event.changedTouches[0];

        const touchEndX =
            touch.screenX;

        const touchEndY =
            touch.screenY;


        const differenceX =
            touchEndX - touchStartX;

        const differenceY =
            touchEndY - touchStartY;


        /*
            Ignore vertical scrolling.
        */

        if (
            Math.abs(differenceY) >
            Math.abs(differenceX)
        ) {
            return;
        }


        /*
            Require a meaningful horizontal swipe.
        */

        if (Math.abs(differenceX) < 70) {
            return;
        }


        const order = [
            "intro",
            "name",
            "birthday",
            "letter",
            "duas",
            "final"
        ];

        const currentIndex =
            order.indexOf(currentScreen);


        /*
            Swipe left → next
        */

        if (
            differenceX < 0 &&
            currentIndex < order.length - 1
        ) {

            showScreen(
                order[currentIndex + 1]
            );

        }


        /*
            Swipe right → previous
        */

        if (
            differenceX > 0 &&
            currentIndex > 0
        ) {

            showScreen(
                order[currentIndex - 1]
            );

        }

    },
    { passive: true }
);


/* =========================================================
   11. PREVENT ACCIDENTAL BUTTON DOUBLE CLICKS
========================================================= */

const allButtons =
    document.querySelectorAll("button");


allButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            button.blur();

        }
    );

});


/* =========================================================
   12. PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
            When the user leaves the tab,
            nothing destructive happens.

            When they return, the current scene
            remains exactly where they left it.
        */

        if (
            document.visibilityState === "visible"
        ) {

            document.body.classList.add(
                "page-visible"
            );

        }

    }
);


/* =========================================================
   13. INITIALIZE
========================================================= */

function initializeBirthdayExperience() {

    /*
        Generate background stars.
    */

    createStars();


    /*
        Make sure intro is the first screen.
    */

    Object.values(screens).forEach(
        (screen) => {

            if (!screen) return;

            screen.classList.remove("active");

        }
    );


    screens.intro.classList.add("active");


    currentScreen = "intro";


    /*
        Accessibility announcement.
    */

    announceScreen("intro");

}


/* =========================================================
   14. START EXPERIENCE
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeBirthdayExperience
    );

} else {

    initializeBirthdayExperience();

}
```
