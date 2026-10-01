
/* =========================================================
   THAQWA JUMMAH MASJID
   Main JavaScript
========================================================= */


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   PWA INSTALL PROMPT
========================================================= */

let deferredInstallPrompt = null;

const installButton = document.getElementById("installButton");


/*
 * Android / Chrome fires this event when the website
 * is eligible for installation.
 */
window.addEventListener("beforeinstallprompt", event => {

    /*
     * Prevent Chrome from showing its own prompt immediately.
     */
    event.preventDefault();

    /*
     * Save the event so we can trigger it ourselves.
     */
    deferredInstallPrompt = event;


    /*
     * Show our Install App button.
     */
    if (installButton) {
        installButton.hidden = false;
    }

});


/*
 * User clicks "Install App".
 */
if (installButton) {

    installButton.addEventListener("click", async () => {

        if (!deferredInstallPrompt) {
            return;
        }


        /*
         * Show Android's installation dialog.
         */
        deferredInstallPrompt.prompt();


        /*
         * Wait for user's choice.
         */
        const result = await deferredInstallPrompt.userChoice;

        console.log(
            "PWA installation:",
            result.outcome
        );


        /*
         * Installation prompt can only be used once.
         */
        deferredInstallPrompt = null;

        installButton.hidden = true;

    });

}


/* =========================================================
   APP INSTALLED
========================================================= */

window.addEventListener("appinstalled", () => {

    console.log("Thaqwa Jummah Masjid PWA installed.");

    deferredInstallPrompt = null;

    if (installButton) {
        installButton.hidden = true;
    }

});


/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(registration => {

                console.log(
                    "Service Worker registered:",
                    registration.scope
                );

            })
            .catch(error => {

                console.error(
                    "Service Worker registration failed:",
                    error
                );

            });

    });

}


