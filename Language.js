```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const languageButtons = document.querySelectorAll(
        "[data-set-language]"
    );

    function setLanguage(language) {
        const selectedLanguage = language === "es" ? "es" : "en";

        document.body.dataset.language = selectedLanguage;
        document.documentElement.lang = selectedLanguage;

        languageButtons.forEach((button) => {
            const isSelected =
                button.dataset.setLanguage === selectedLanguage;

            button.setAttribute(
                "aria-pressed",
                String(isSelected)
            );
        });

        localStorage.setItem(
            "interpreting-fc-language",
            selectedLanguage
        );
    }

    languageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.setLanguage);
        });
    });

    const savedLanguage = localStorage.getItem(
        "interpreting-fc-language"
    );

    const browserLanguage =
        navigator.language.toLowerCase().startsWith("es")
            ? "es"
            : "en";

    setLanguage(savedLanguage || browserLanguage);
});
```
