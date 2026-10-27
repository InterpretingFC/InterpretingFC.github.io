/* Interpreting FC visitor counter. Created 2026-10-27. No account or SDK. */
(function (root, factory) {
    "use strict";
    if (typeof module === "object" && module.exports) {
        module.exports = factory;
    } else {
        root.IFCVisitorCounter = factory(root);
        if (!root.document.querySelector("[data-counter-dashboard]")) {
            root.IFCVisitorCounter.track().then(function (result) {
                root.IFCVisitorCounter.renderFooter(result);
            }).catch(function () { /* Counting must never interrupt the site. */ });
        }
    }
}(typeof window !== "undefined" ? window : this, function (env, options) {
    "use strict";
    const config = Object.assign({
        base: "https://countapi.mileshilliard.com/api/v1/",
        key: "interpretingfc-com-browsers-20261027-f814c2e9",
        threshold: 100,
        timeoutMs: 6000,
        retryDelayMs: 600000
    }, options || {});
    const prefix = "ifc-counter:" + config.key + ":";
    let inFlight = null;
    const now = function () { return env.now ? env.now() : Date.now(); };
    let storage;
    try { storage = env.localStorage; } catch (error) { storage = null; }

    function get(name) {
        try { return storage && storage.getItem(prefix + name); }
        catch (error) { return null; }
    }
    function set(name, value) {
        try { storage.setItem(prefix + name, value); return true; }
        catch (error) { return false; }
    }
    function storageWorks() {
        if (!storage) { return false; }
        try {
            const probe = prefix + "probe";
            storage.setItem(probe, "1");
            const ok = storage.getItem(probe) === "1";
            storage.removeItem(probe);
            return ok;
        } catch (error) { return false; }
    }
    function cached() {
        try {
            const value = JSON.parse(get("cache"));
            return value && Number.isSafeInteger(value.count) && value.count >= 0 &&
                Number.isFinite(value.checkedAt) ? value : null;
        } catch (error) { return null; }
    }
    function excluded() { return get("exclude") === "1"; }
    function setExcluded(value) { return set("exclude", value ? "1" : "0"); }
    function liveHost() {
        return ["interpretingfc.com", "www.interpretingfc.com"].includes(env.location.hostname);
    }
    function automated() {
        return /bot|crawler|spider|headless|lighthouse|pagespeed|preview/i.test(
            env.navigator && env.navigator.userAgent || ""
        );
    }
    function request(operation) {
        const controller = new env.AbortController();
        let timer;
        const timeout = new Promise(function (_, reject) {
            timer = env.setTimeout(function () {
                controller.abort();
                reject(new Error("Counter request timed out."));
            }, config.timeoutMs);
        });
        const work = env.fetch(config.base + operation + "/" + encodeURIComponent(config.key), {
            method: "GET", mode: "cors", cache: "no-store",
            credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal
        }).then(async function (response) {
            const data = await response.json();
            if (operation === "get" && response.status === 404 &&
                    data && data.error === "Key not found") {
                return 0;
            }
            if (!response.ok || !data ||
                    !/^[0-9]+$/.test(String(data.value))) {
                throw new Error("Counter service returned an invalid response.");
            }
            const count = Number(data.value);
            if (!Number.isSafeInteger(count) || count < (operation === "hit" ? 1 : 0)) {
                throw new Error("Counter service returned an invalid count.");
            }
            return count;
        });
        return Promise.race([work, timeout]).finally(function () { env.clearTimeout(timer); });
    }
    async function read() {
        try {
            const count = await request("get");
            const result = { count: count, checkedAt: now(), live: true };
            set("cache", JSON.stringify(result));
            return result;
        } catch (error) {
            const previous = cached();
            return { count: previous ? previous.count : null,
                checkedAt: previous ? previous.checkedAt : null, live: false,
                error: "Live count is temporarily unavailable." };
        }
    }
    async function trackOnce() {
        const dashboard = env.document && env.document.querySelector("[data-counter-dashboard]");
        if (!liveHost() || dashboard || automated() || excluded() ||
                !storageWorks() || get("counted") === "1" ||
                Number(get("retryAfter")) > now()) {
            return liveHost() ? read() : { count: null, live: false, skipped: true };
        }
        // Reserve before dispatch. Never replay an uncertain write immediately.
        set("retryAfter", String(now() + config.retryDelayMs));
        try {
            const count = await request("hit");
            set("counted", "1");
            const result = { count: count, checkedAt: now(), live: true };
            set("cache", JSON.stringify(result));
            return result;
        } catch (error) {
            const previous = cached();
            return { count: previous ? previous.count : null,
                checkedAt: previous ? previous.checkedAt : null, live: false };
        }
    }
    function track() {
        if (inFlight) { return inFlight; }
        const locks = env.navigator && env.navigator.locks;
        const task = locks && typeof locks.request === "function"
            ? locks.request(prefix + "lock", trackOnce) : trackOnce();
        inFlight = Promise.resolve(task).finally(function () { inFlight = null; });
        return inFlight;
    }
    function renderFooter(result) {
        // A cached or failed read must never masquerade as a live public count.
        if (!result || !result.live || !Number.isSafeInteger(result.count) ||
                result.count < config.threshold || !env.document) { return; }
        const footer = env.document.querySelector("footer");
        if (!footer || env.document.getElementById("visitor-count")) { return; }
        const line = env.document.createElement("p");
        line.id = "visitor-count";
        line.className = "footer-visitor-count";
        line.setAttribute("aria-label", result.count + " estimated visitors");
        [ ["en", "Visitors: "], ["es", "Visitantes: "] ].forEach(function (language) {
            const span = env.document.createElement("span");
            span.className = "lang-" + language[0];
            span.appendChild(env.document.createTextNode(language[1]));
            const number = env.document.createElement("strong");
            number.textContent = result.count.toLocaleString(language[0] + "-US");
            span.appendChild(number);
            line.appendChild(span);
        });
        footer.appendChild(line);
    }
    return { track: track, read: read, renderFooter: renderFooter,
        excluded: excluded, setExcluded: setExcluded, storageWorks: storageWorks,
        key: config.key, threshold: config.threshold };
}));
