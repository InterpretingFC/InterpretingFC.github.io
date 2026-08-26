"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const languageButtons = document.querySelectorAll("[data-set-language]");
    const inquiryForm = document.getElementById("inquiry-form");
    const inquiryStatus = document.getElementById("inquiry-status");
    const phoneNumber = "+18182684483";
    const emailAddress = "Frank@interpretingfc.com";

    function setLanguage(language) {
        const selectedLanguage = language === "es" ? "es" : "en";
        document.documentElement.lang = selectedLanguage;

        languageButtons.forEach(function (button) {
            button.setAttribute(
                "aria-pressed",
                button.getAttribute("data-set-language") === selectedLanguage
                    ? "true"
                    : "false"
            );
        });

        try {
            localStorage.setItem("interpreting-fc-language", selectedLanguage);
        } catch (error) {
            // Language switching still works if browser storage is unavailable.
        }
    }

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setLanguage(button.getAttribute("data-set-language"));
        });
    });

    let savedLanguage = "en";

    try {
        savedLanguage = localStorage.getItem("interpreting-fc-language") || "en";
    } catch (error) {
        savedLanguage = "en";
    }

    setLanguage(savedLanguage);

    function formatDateTime(value, language) {
        if (!value) {
            return language === "es" ? "No especificada" : "Not specified";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(language === "es" ? "es-US" : "en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    }

    if (inquiryForm) {
        inquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!inquiryForm.reportValidity()) {
                return;
            }

            const language = document.documentElement.lang === "es" ? "es" : "en";
            const name = document.getElementById("inquiry-name").value.trim();
            const dateTime = document.getElementById("inquiry-datetime").value;
            const type = document.getElementById("inquiry-type").value;
            const format = document.getElementById("inquiry-format").value;
            const location = document.getElementById("inquiry-location").value.trim();
            const duration = document.getElementById("inquiry-duration").value.trim();
            const details = document.getElementById("inquiry-details").value.trim();

            let lines;

            if (language === "es") {
                lines = [
                    "Hola Frank, quisiera solicitar un intérprete.",
                    "",
                    "Nombre: " + name,
                    "Fecha/hora: " + formatDateTime(dateTime, language),
                    "Tipo: " + type,
                    "Modalidad: " + format,
                    "Ubicación: " + (location || "No especificada"),
                    "Duración aprox.: " + (duration || "No especificada")
                ];

                if (details) {
                    lines.push("Detalles: " + details);
                }
            } else {
                lines = [
                    "Hello Frank, I'd like to request an interpreter.",
                    "",
                    "Name: " + name,
                    "Date/time: " + formatDateTime(dateTime, language),
                    "Type: " + type,
                    "Format: " + format,
                    "Location: " + (location || "Not specified"),
                    "Approx. duration: " + (duration || "Not specified")
                ];

                if (details) {
                    lines.push("Details: " + details);
                }
            }

            const action = event.submitter && event.submitter.getAttribute("data-inquiry-action") === "text"
                ? "text"
                : "email";
            const body = encodeURIComponent(lines.join("\n"));

            if (action === "text") {
                if (inquiryStatus) {
                    inquiryStatus.textContent = language === "es"
                        ? "Abriendo su aplicación de mensajes…"
                        : "Opening your messaging app…";
                }

                window.location.href = "sms:" + phoneNumber + "?body=" + body;
                return;
            }

            const subject = encodeURIComponent(
                language === "es"
                    ? "Solicitud de intérprete - " + name
                    : "Interpreter Request - " + name
            );

            if (inquiryStatus) {
                inquiryStatus.textContent = language === "es"
                    ? "Abriendo su aplicación de email…"
                    : "Opening your email app…";
            }

            window.location.href = "mailto:" + emailAddress + "?subject=" + subject + "&body=" + body;
        });
    }
});
