import { useEffect, useMemo } from "react";
import styles from "./SocialLinks.module.scss";

const reversedEmailParts = {
  // Keep these reversed in the HTML; reconstructed client-side after hydration.
  // TODO: Replace with your own email (reversed). e.g. "andrew" -> "werdna"
  a: "werdna",
  b: "yadirfy",
  c: "moc",
} as const;

function reverse(str: string) {
  return str.split("").reverse().join("");
}

export default function SocialLinks() {
  const emailHref = useMemo(() => {
    // Render a harmless placeholder in SSR HTML; hydration will update it.
    return "#";
  }, []);

  useEffect(() => {
    const a = reverse(reversedEmailParts.a);
    const b = reverse(reversedEmailParts.b);
    const c = reverse(reversedEmailParts.c);
    const href = `mailto:${a}@${b}.${c}`;

    // If Astro view transitions swap pages, a client-hydrated island can persist;
    // this keeps the link correct even if the DOM re-mounts.
    const links = document.querySelectorAll<HTMLAnchorElement>(
      "a.email-link[data-email-a][data-email-b][data-email-c]"
    );
    links.forEach((link) => {
      link.href = href;
    });
  }, []);

  return (
    <div className={styles.navSocial}>
      {/* TODO: Replace @YOUR_TWITTER_HANDLE with your actual Twitter/X handle */}
      <a href="https://twitter.com/YOUR_TWITTER_HANDLE" target="_blank" rel="noreferrer">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Twitter icon</title>
          <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
        </svg>
      </a>
      {/* TODO: Replace /in/YOUR_LINKEDIN_HANDLE/ with your actual LinkedIn URL */}
      <a
        href="https://www.linkedin.com/in/YOUR_LINKEDIN_HANDLE/"
        target="_blank"
        rel="noreferrer"
      >
        <svg x="0px" y="0px" viewBox="0 0 510 510">
          <g>
            <g id="post-linkedin">
              <path d="M459,0H51C22.95,0,0,22.95,0,51v408c0,28.05,22.95,51,51,51h408c28.05,0,51-22.95,51-51V51C510,22.95,487.05,0,459,0z M153,433.5H76.5V204H153V433.5z M114.75,160.65c-25.5,0-45.9-20.4-45.9-45.9s20.4-45.9,45.9-45.9s45.9,20.4,45.9,45.9 S140.25,160.65,114.75,160.65z M433.5,433.5H357V298.35c0-20.399-17.85-38.25-38.25-38.25s-38.25,17.851-38.25,38.25V433.5H204 V204h76.5v30.6c12.75-20.4,40.8-35.7,63.75-35.7c48.45,0,89.25,40.8,89.25,89.25V433.5z"></path>
            </g>
          </g>
        </svg>
      </a>
      {/* TODO: Replace YOUR_ITCHIO_USERNAME with your actual itch.io username */}
      <a
        href="https://YOUR_ITCHIO_USERNAME.itch.io"
        target="_blank"
        rel="noreferrer"
      >
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>itch.io icon</title>
          <path d="M0 0v4.141C3.162 6.055 6.628 7 12 7s8.838-.945 12-2.859V0zm12 3.574c-3.12 0-5.653-.635-5.653-1.42 0-.783 2.533-1.418 5.653-1.418 3.12 0 5.652.635 5.652 1.419 0 .784-2.532 1.42-5.652 1.42zM12 7c-5.37 0-8.836-.945-12-2.859V19.5C0 21.984 5.373 24 12 24s12-2.016 12-4.5V4.141C20.838 6.055 17.372 7 12 7zm0 13.5c-4.38 0-7.932-1.344-7.932-3S7.62 14.5 12 14.5s7.932 1.344 7.932 3S16.38 20.5 12 20.5z" />
        </svg>
      </a>
      <a href="/rss.xml" title="RSS Feed">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>RSS Feed icon</title>
          <path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.295 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z"></path>
        </svg>
      </a>
      <a
        href={emailHref}
        data-email-a={reversedEmailParts.a}
        data-email-b={reversedEmailParts.b}
        data-email-c={reversedEmailParts.c}
        className="email-link"
      >
        <svg x="0px" y="0px" viewBox="0 0 550.795 550.795">
          <g>
            <g>
              <path d="M501.613,491.782c12.381,0,23.109-4.088,32.229-12.16L377.793,323.567c-3.744,2.681-7.373,5.288-10.801,7.767 c-11.678,8.604-21.156,15.318-28.434,20.129c-7.277,4.822-16.959,9.737-29.045,14.755c-12.094,5.024-23.361,7.528-33.813,7.528 h-0.306h-0.306c-10.453,0-21.72-2.503-33.813-7.528c-12.093-5.018-21.775-9.933-29.045-14.755 c-7.277-4.811-16.75-11.524-28.434-20.129c-3.256-2.387-6.867-5.006-10.771-7.809L16.946,479.622 c9.119,8.072,19.854,12.16,32.234,12.16H501.613z"></path>
              <path d="M31.047,225.299C19.37,217.514,9.015,208.598,0,198.555V435.98l137.541-137.541 C110.025,279.229,74.572,254.877,31.047,225.299z"></path>
              <path d="M520.059,225.299c-41.865,28.336-77.447,52.73-106.75,73.195l137.486,137.492V198.555 C541.98,208.396,531.736,217.306,520.059,225.299z"></path>
              <path d="M501.613,59.013H49.181c-15.784,0-27.919,5.33-36.42,15.979C4.253,85.646,0.006,98.97,0.006,114.949 c0,12.907,5.636,26.892,16.903,41.959c11.267,15.061,23.256,26.891,35.961,35.496c6.965,4.921,27.969,19.523,63.012,43.801 c18.917,13.109,35.368,24.535,49.505,34.395c12.05,8.396,22.442,15.667,31.022,21.701c0.985,0.691,2.534,1.799,4.59,3.269 c2.215,1.591,5.018,3.61,8.476,6.107c6.659,4.816,12.191,8.709,16.597,11.683c4.4,2.975,9.731,6.298,15.985,9.988 c6.249,3.685,12.143,6.456,17.675,8.299c5.533,1.842,10.655,2.766,15.367,2.766h0.306h0.306c4.711,0,9.834-0.924,15.368-2.766 c5.531-1.843,11.42-4.608,17.674-8.299c6.248-3.69,11.572-7.02,15.986-9.988c4.406-2.974,9.938-6.866,16.598-11.683 c3.451-2.497,6.254-4.517,8.469-6.102c2.057-1.476,3.605-2.577,4.596-3.274c6.684-4.651,17.1-11.892,31.104-21.616 c25.482-17.705,63.01-43.764,112.742-78.281c14.957-10.447,27.453-23.054,37.496-37.803c10.025-14.749,15.051-30.22,15.051-46.408 c0-13.525-4.873-25.098-14.598-34.737C526.461,63.829,514.932,59.013,501.613,59.013z"></path>
            </g>
          </g>
        </svg>
      </a>
    </div>
  );
}
