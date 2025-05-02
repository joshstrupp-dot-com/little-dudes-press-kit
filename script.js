// Register ScrollTrigger plugin (only needed if we use ScrollTrigger later)
gsap.registerPlugin(ScrollTrigger);

// Optional: Add a little fade-in for the body once content is loaded
gsap.from("body", { opacity: 0, duration: 0.5, delay: 0.2 });

// Cursor flair effect
// ---------------------------

// Animation function for individual flair items
function playAnimation(shape) {
  // The timeline for each flair element
  let tl = gsap.timeline();
  tl.from(shape, {
    opacity: 0,
    scale: 0.2,
    duration: 1.5, // Increased from default 1
    ease: "elastic.out(1,0.3)",
  })
    .to(
      shape,
      {
        rotation: "random([0, 250])", // Reduced rotation range
        duration: 2, // Slowed down rotation
      },
      "<"
    )
    .to(
      shape,
      {
        y: "120vh",
        ease: "back.in(.4)",
        duration: 1.5, // Increased from 1
      },
      0
    );
}

// Setup cursor tracking and flair animation
let flair = gsap.utils.toArray(".flair");
let gap = 100; // Distance between each animation trigger
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({ duration: 1 });

let mousePos = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let cachedMousePos = { x: 0, y: 0 };

// Track mouse position
window.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.x,
    y: e.y,
  };
});

// Animation loop
function imageTrail() {
  // Calculate distance moved
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  // Smooth mouse position for animation
  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  // When mouse has moved enough, animate a new flair
  if (travelDistance > gap) {
    animateImage();
    lastMousePos = { ...mousePos };
  }
}

// Animate a single flair image
function animateImage() {
  let wrappedIndex = wrapper(index);
  let img = flair[wrappedIndex];

  // Kill any ongoing animations for this element
  gsap.killTweensOf(img);

  // Reset properties
  gsap.set(img, {
    clearProps: "all",
  });

  // Position at mouse location
  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  // Start the animation
  playAnimation(img);

  // Move to next flair
  index++;
}

// Add the animation to GSAP's ticker
gsap.ticker.add(imageTrail);
