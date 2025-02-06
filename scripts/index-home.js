document.addEventListener("DOMContentLoaded", async () => {
    const color = localStorage.getItem("color") || "light";
    if (color === "dark") {
        await mode_initialize(0);
    } else {
        await mode_initialize(1);
    }
});

async function mode_initialize(int) {
    const root = document.querySelector(":root");
    root.style.setProperty("--mode", int == 0 ? "0,0,0" : "255,255,255");
    root.style.setProperty("--text", int == 0 ? "255,255,255" : "0,0,0");
}

console.log(window.dark)