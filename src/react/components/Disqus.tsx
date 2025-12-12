import { useEffect } from "react";

declare global {
  interface Window {
    $disqus?: Element | null;
    DISQUS?: { reset: (opts: { reload: boolean }) => void };
    DisqusWidget?: {
      overwriteGlobalSelectors: () => void;
      init: () => void;
      addListeners: () => void;
      initDisqus: () => void;
    };
  }
}

export default function Disqus() {
  useEffect(() => {
    if (!window.DisqusWidget) {
      window.DisqusWidget = {
        overwriteGlobalSelectors: function () {
          window.$disqus = document.querySelector("#disqus_thread");
        },
        init: function () {
          this.overwriteGlobalSelectors();
          this.addListeners();
          this.initDisqus();
        },
        addListeners: function () {
          document.addEventListener("astro:after-swap", () => {
            this.overwriteGlobalSelectors();
            this.initDisqus();
          });
        },
        initDisqus: () => {
          if (window.$disqus === null) return;

          // Reset DISQUS rather than loading a new embed.js
          if (window.DISQUS) {
            window.DISQUS.reset({ reload: true });
            return;
          }

          (function () {
            const d = document;
            const s = d.createElement("script");
            s.src = "https://danfessler.disqus.com/embed.js";
            s.setAttribute("data-timestamp", String(+new Date()));
            (d.head || d.body).appendChild(s);
          })();
        },
      };

      window.DisqusWidget.init();
      return;
    }

    // Already initialized; just make sure it rebinds to the current thread container.
    window.DisqusWidget.overwriteGlobalSelectors();
    window.DisqusWidget.initDisqus();
  }, []);

  return (
    <>
      <div id="disqus_thread" className="disqus-thread" />
      <noscript>
        Please enable JavaScript to view the{" "}
        <a href="https://disqus.com/?ref_noscript">
          comments powered by Disqus.
        </a>
      </noscript>
    </>
  );
}
