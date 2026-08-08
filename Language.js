
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const englishButton = document.querySelector(
        '[data-set-language="en"]'
    );

    const spanishButton = document.querySelector(
        '[data-set-language="es"]'
    );

    function setLanguage(language) {

        if (language === "es") {
            document.documentElement.lang = "es";

            englishButton.setAttribute("aria-pressed", "false");
            spanishButton.setAttribute("aria-pressed", "true");

            localStorage.setItem(
                "interpreting-fc-language",
                "es"
            );

        } else {
            document.documentElement.lang = "en";

            englishButton.setAttribute("aria-pressed", "true");
            spanishButton.setAttribute("aria-pressed", "false");

            localStorage.setItem(
                "interpreting-fc-language",
                "en"
            );
        }
    }

    englishButton.addEventListener("click", function () {
        setLanguage("en");
    });

    spanishButton.addEventListener("click", function () {
        setLanguage("es");
    });

    const savedLanguage = localStorage.getItem(
        "interpreting-fc-language"
    );

    if (savedLanguage === "es") {
        setLanguage("es");
    } else {
        setLanguage("en");
    }

});
