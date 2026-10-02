import gsap from "gsap";

window.addEventListener("DOMContentLoaded", () => {
  let loading = document.querySelector("#loading");

  const tl = gsap.timeline();

  tl.to(loading, { display: "flex", opacity: 1 }).to(
    loading,
    { display: "none", opacity: 0, duration: 3 },
    5,
  );
});
