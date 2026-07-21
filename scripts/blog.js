// blog.js - loaded only on posts that contain code snippets
document.addEventListener("DOMContentLoaded", () => {
    if (window.hljs) {
        document.querySelectorAll(".code-snippet pre code").forEach((el) => {
            hljs.highlightElement(el);
        });
    }

    document.querySelectorAll(".code-snippet").forEach((snippet) => {
        const button = snippet.querySelector(".copy-button");
        const code = snippet.querySelector("code");
        if (!button || !code) return;

        const copy = () => {
            navigator.clipboard
                .writeText(code.innerText)
                .then(() => {
                    button.textContent = "Copied";
                    setTimeout(() => {
                        button.textContent = "Copy";
                    }, 3000);
                })
                .catch((err) => {
                    console.error("Clipboard copy failed:", err);
                });
        };

        button.addEventListener("click", copy);
        button.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                copy();
            }
        });
    });
});
