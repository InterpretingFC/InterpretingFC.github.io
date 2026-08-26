"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-set-language]");
    const storageKey = "interpreting-fc-language";

    function setLanguage(language) {
        const selectedLanguage = language === "es" ? "es" : "en";
        document.documentElement.lang = selectedLanguage;

        buttons.forEach(function (button) {
            button.setAttribute(
                "aria-pressed",
                button.dataset.setLanguage === selectedLanguage ? "true" : "false"
            );
        });

        localStorage.setItem(storageKey, selectedLanguage);
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            setLanguage(button.dataset.setLanguage);
        });
    });

    let savedLanguage = null;
    try {
        savedLanguage = localStorage.getItem(storageKey);
    } catch (error) {
        savedLanguage = null;
    }

    setLanguage(savedLanguage === "es" ? "es" : "en");
});
