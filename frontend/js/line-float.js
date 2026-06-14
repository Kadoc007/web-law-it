(function () {
  function startLineFloatAnimation() {
    const lineButton = document.querySelector(".line-float");
    if (!lineButton || lineButton.dataset.wiggleReady === "true") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    lineButton.dataset.wiggleReady = "true";
    let removeWiggleId = null;

    const animate = () => {
      if (document.hidden || reduceMotion.matches) return;

      lineButton.classList.add("wiggle");

      removeWiggleId = window.setTimeout(() => {
        lineButton.classList.remove("wiggle");
      }, 900);
    };

    const intervalId = window.setInterval(animate, 5000);

    reduceMotion.addEventListener("change", () => {
      if (!reduceMotion.matches) return;
      window.clearInterval(intervalId);
      if (removeWiggleId) window.clearTimeout(removeWiggleId);
      lineButton.classList.remove("wiggle");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLineFloatAnimation, { once: true });
  } else {
    startLineFloatAnimation();
  }
})();
