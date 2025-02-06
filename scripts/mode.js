const page_mode = localStorage.getItem("color") || "light";
const root = document.querySelector(":root");
if (page_mode === "dark") {
    root.style.setProperty("--mode", "0,0,0");
    root.style.setProperty("--text", "255,255,255");
} else {
    root.style.setProperty("--mode", "255,255,255");
    root.style.setProperty("--text", "0,0,0");
}