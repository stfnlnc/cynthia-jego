const clickable = document.getElementById("clickable");
const reveal = document.getElementById("clickable-reveal");
const remove = document.getElementById("clickable-remove");

clickable.addEventListener("mousedown", () => {
    reveal.classList.remove("blur-xl", "opacity-15");
    reveal.classList.add("scale-48", "blur-none", "opacity-100");
    remove.classList.add("opacity-0");
});

clickable.addEventListener("mouseup", () => {
    reveal.classList.add("blur-xl", "opacity-15");
    reveal.classList.remove("scale-48", "blur-none", "opacity-100");
    remove.classList.remove("opacity-0");
});
