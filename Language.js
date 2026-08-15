"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const englishButton = document.querySelector(
        '[data-set-language="en"]'
    );

    const spanishButton = document.querySelector(
        '[data-set-language="es"]'
    );


    function setLanguage(language) {

        const selectedLanguage =
            language === "es" ? "es" : "en";


        document.documentElement.lang =
            selectedLanguage;


        if (englishButton) {

            englishButton.setAttribute(
                "aria-pressed",
                selectedLanguage === "en"
                    ? "true"
                    : "false"
            );

        }


        if (spanishButton) {

            spanishButton.setAttribute(
                "aria-pressed",
                selectedLanguage === "es"
                    ? "true"
                    : "false"
            );

        }


        localStorage.setItem(
            "interpreting-fc-language",
            selectedLanguage
        );

    }


    if (englishButton) {

        englishButton.addEventListener(
            "click",
            function () {
                setLanguage("en");
            }
        );

    }


    if (spanishButton) {

        spanishButton.addEventListener(
            "click",
            function () {
                setLanguage("es");
            }
        );

    }


    const savedLanguage =
        localStorage.getItem(
            "interpreting-fc-language"
        );


    setLanguage(
        savedLanguage === "es"
            ? "es"
            : "en"
    );

});
