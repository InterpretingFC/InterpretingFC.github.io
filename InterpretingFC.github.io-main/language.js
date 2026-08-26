"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-set-language]");

    function setLanguage(language) {
        const selectedLanguage = language === "es" ? "es" : "en";

        document.documentElement.lang = selectedLanguage;

        buttons.forEach(function (button) {
            button.setAttribute(
                "aria-pressed",
                button.getAttribute("data-set-language") === selectedLanguage
                    ? "true"
                    : "false"
            );
        });

        try {
            localStorage.setItem(
                "interpreting-fc-language",
                selectedLanguage
            );
        } catch (error) {
            // Language switching still works if browser storage is unavailable.
        }
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            setLanguage(button.getAttribute("data-set-language"));
        });
    });

    let savedLanguage = "en";

    try {
        savedLanguage =
            localStorage.getItem("interpreting-fc-language") || "en";
    } catch (error) {
        savedLanguage = "en";
    }

    setLanguage(savedLanguage);
});
