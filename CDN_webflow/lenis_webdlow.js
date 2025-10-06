<script src="https://uploads-ssl.webflow.com/63fa6f365080594bdfd4772e/6410acdac3104be96977ab26_lenis-offbrand-v1.txt"></script>
<script>
class Scroll extends Lenis {
  constructor() {
    super({
      duration: 1.5,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
      orientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5
    });

    this.time = 0;
    this.isActive = true;
    this.init();
  }

  init() {
    this.config();
    this.render();
    this.handleEditorView();
  }

  config() {
    const setAttributeOnElements = (selector, attr, value) => {
      document.querySelectorAll(selector).forEach(item => item.setAttribute(attr, value));
    };

    const setClickHandlerOnElements = (selector, handler) => {
      document.querySelectorAll(selector).forEach(item => item.onclick = handler);
    };

    // Allow scrolling on overflow elements
    setAttributeOnElements('[data-scroll="overscroll"]', "onwheel", "event.stopPropagation()");

    // Stop and start scroll buttons
    setClickHandlerOnElements('[data-scroll="stop"]', () => { this.stop(); this.isActive = false; });
    setClickHandlerOnElements('[data-scroll="start"]', () => { this.start(); this.isActive = true; });

    // Toggle page scrolling
    setClickHandlerOnElements('[data-scroll="toggle"]', () => {
      this.isActive ? this.stop() : this.start();
      this.isActive = !this.isActive;
    });

    // Anchor links
    document.querySelectorAll("[data-scrolllink]").forEach(item => {
      const id = item.dataset.scrolllink;
      const target = document.querySelector(`[data-scrolltarget="${id}"]`);
      if (target) {
        item.onclick = () => this.scrollTo(target);
      }
    });
  }

  render() {
    this.raf((this.time += 10));
    requestAnimationFrame(this.render.bind(this));
  }

  handleEditorView() {
    const html = document.documentElement;
    const observer = new MutationObserver(mutationList => {
      mutationList.forEach(mutation => {
        if (mutation.type === "attributes") {
          const btn = document.querySelector(".w-editor-bem-EditSiteButton");
          const bar = document.querySelector(".w-editor-bem-EditorMainMenu");
          const addDestroyListener = target => target.addEventListener("click", () => this.destroy());

          if (btn) addDestroyListener(btn);
          if (bar) addDestroyListener(bar);
        }
      });
    });

    observer.observe(html, { attributes: true });
  }
}

window.SmoothScroll = new Scroll();
</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('video');
  const videoSection = document.getElementById('animation-video');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: 0.5 });

  observer.observe(videoSection);
});