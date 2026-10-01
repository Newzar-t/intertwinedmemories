import gsap from "gsap";

window.addEventListener("DOMContentLoaded", () => {
  let loading = document.querySelector("#loading");

  setTimeout(() => {
    gsap.to(loading, {
      display: "none",
      opacity: 0,
    });
  }, 3000);
});
