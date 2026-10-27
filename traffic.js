/* Read-only traffic page. Created 2026-10-27. */
(function () {
    "use strict";
    const counter = window.IFCVisitorCounter;
    const number = document.getElementById("traffic-count");
    const status = document.getElementById("traffic-status");
    const checked = document.getElementById("traffic-checked");
    const refresh = document.getElementById("traffic-refresh");
    const toggle = document.getElementById("traffic-toggle");
    const exclusion = document.getElementById("traffic-exclusion");
    let latest = null;

    function showExclusion() {
        const enabled = counter.excluded();
        toggle.textContent = enabled ? "Include this browser again" : "Exclude this browser";
        toggle.setAttribute("aria-pressed", String(enabled));
        exclusion.textContent = enabled ? "This browser is excluded from future counting."
            : "This browser can be counted when it visits the main website.";
        if (!counter.storageWorks()) {
            toggle.disabled = true;
            exclusion.textContent = "Browser storage is blocked, so this browser will not add visits.";
        }
    }
    async function update() {
        refresh.disabled = true;
        status.textContent = "Checking the counter…";
        try {
            latest = await counter.read();
            number.textContent = latest.count === null ? "—" : latest.count.toLocaleString("en-US");
            status.dataset.state = latest.live ? "live" : "offline";
            status.textContent = latest.live ? "Live count · no sign-in needed"
                : latest.count === null ? "The service is unavailable. The count is unknown, not zero. Try again later."
                    : "Service temporarily unavailable · showing your last saved count.";
            checked.textContent = latest.checkedAt ? "Last successful check: " +
                new Date(latest.checkedAt).toLocaleString() : "";
        } catch (error) {
            status.dataset.state = "offline";
            status.textContent = "Unable to check the count. Try again later.";
        } finally { refresh.disabled = false; }
    }
    toggle.addEventListener("click", function () {
        if (!counter.setExcluded(!counter.excluded())) {
            exclusion.textContent = "This browser could not save the setting.";
            return;
        }
        showExclusion();
    });
    refresh.addEventListener("click", update);
    showExclusion();
    update();
}());
