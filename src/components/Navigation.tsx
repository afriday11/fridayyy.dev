import { useEffect, useMemo, useState } from "react";

import avatarUrl from "../assets/avatar.jpg";

import galleryIcon from "../assets/icons/art.svg?raw";
import blogIcon from "../assets/icons/blog.svg?raw";
import resumeIcon from "../assets/icons/resume.svg?raw";
import aboutIcon from "../assets/icons/about.svg?raw";
import WorkIcon from "../assets/icons/work.svg?raw";
import LocationIcon from "../assets/icons/location.svg?raw";
import BurgerIcon from "../assets/icons/burger.svg?raw";

import SocialLinks from "./SocialLinks";
import styles from "./Navigation.module.scss";

type NavProps = {
  currentPath?: string;
};

function Icon({ svg }: { svg: string }) {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}

function isActive(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/";
  if (href === "/portfolio") return currentPath.includes("/portfolio");
  if (href === "/blog") return currentPath.includes("/blog");
  if (href === "/resume") return currentPath.startsWith("/resume");
  return false;
}

export default function Navigation({ currentPath }: NavProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [path, setPath] = useState(() => {
    if (typeof currentPath === "string") return currentPath;
    if (typeof window !== "undefined") return window.location.pathname;
    return "/";
  });
  const avatarSrc =
    typeof avatarUrl === "string"
      ? avatarUrl
      : // Astro can type asset imports as ImageMetadata, which is `{ src, width, height, ... }`
        (avatarUrl as unknown as { src?: string }).src ?? "";

  // Match the existing behavior (lock scroll when mobile nav is open).
  useEffect(() => {
    document.documentElement.style.overflowY = isMobileNavOpen
      ? "hidden"
      : "auto";
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, [isMobileNavOpen]);

  // Close the mobile menu on Astro view transitions.
  useEffect(() => {
    const onRouteChange = () => {
      setIsMobileNavOpen(false);
      setPath(window.location.pathname);
    };

    document.addEventListener("astro:after-swap", onRouteChange);
    window.addEventListener("popstate", onRouteChange);

    return () => {
      document.removeEventListener("astro:after-swap", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
    };
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sticky}>
          <div className={`${styles.content} shadowfx`}>
            <div className={styles.profile}>
              <div
                className={styles.avatar}
                style={{ backgroundImage: `url(${avatarSrc})` }}
              />
              <span className={styles.name}>ANDREW FRIDAY</span>
              <span className={styles.subtitle}>
                YOUR TITLE HERE
              </span>
              <br />
              <div className={styles.workLocation}>
                <div>
                  <Icon svg={WorkIcon} />
                  YOUR COMPANY
                </div>
                <div>
                  <Icon svg={LocationIcon} />
                  YOUR LOCATION
                </div>
              </div>
            </div>

            <ul className={styles.nav}>
              <a href="/" className={isActive(path, "/") ? styles.active : ""}>
                <li>
                  <Icon svg={aboutIcon} />
                  About
                </li>
              </a>
              <a
                href="/portfolio"
                className={isActive(path, "/portfolio") ? styles.active : ""}
              >
                <li>
                  <Icon svg={galleryIcon} />
                  Portfolio
                </li>
              </a>
              <a
                href="/resume"
                className={isActive(path, "/resume") ? styles.active : ""}
              >
                <li>
                  <Icon svg={resumeIcon} />
                  Resume
                </li>
              </a>
              <a
                href="/blog"
                className={isActive(path, "/blog") ? styles.active : ""}
              >
                <li>
                  <Icon svg={blogIcon} />
                  Blog
                </li>
              </a>
            </ul>

            <div style={{ flexGrow: 1 }} />
            <SocialLinks />
            <div className={styles.navFooter}>© {year} Andrew Friday</div>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileNav} shadowfx`}>
        <div className={styles.mobileNavHeader}>
          <button
            type="button"
            aria-label="Toggle menu"
            className={styles.menuButton}
            onClick={() => setIsMobileNavOpen((v) => !v)}
            style={{ background: "transparent", border: "none", padding: 0 }}
          >
            <Icon svg={BurgerIcon} />
          </button>
          <a
            className={styles.navPageTitle}
            href="/"
            style={{ fontSize: "1.5rem", lineHeight: 1 }}
          >
            ANDREW FRIDAY
          </a>
          <div style={{ width: "2rem" }} />
        </div>

        <div
          className={styles.mobileNavContent}
          style={{
            bottom: isMobileNavOpen ? "calc(-100vh + 64px)" : "0",
          }}
        >
          <div className={styles.profile}>
            <div
              className={styles.avatar}
              style={{ backgroundImage: `url(${avatarSrc})` }}
            />
            <span className={styles.name}>ANDREW FRIDAY</span>
            <span className={styles.subtitle}>
              YOUR TITLE HERE
            </span>
            <br />
            <div className={styles.workLocation}>
              <div>
                <Icon svg={WorkIcon} />
                YOUR COMPANY
              </div>
              <div>
                <Icon svg={LocationIcon} />
                YOUR LOCATION
              </div>
            </div>
          </div>

          <div style={{ flexGrow: 1 }} />

          <ul className={styles.nav}>
            <a href="/" className={isActive(path, "/") ? styles.active : ""}>
              <li>
                <Icon svg={aboutIcon} />
                About
              </li>
            </a>
            <a
              href="/portfolio"
              className={isActive(path, "/portfolio") ? styles.active : ""}
            >
              <li>
                <Icon svg={galleryIcon} />
                Portfolio
              </li>
            </a>
            <a
              href="/resume"
              className={isActive(path, "/resume") ? styles.active : ""}
            >
              <li>
                <Icon svg={resumeIcon} />
                Resume
              </li>
            </a>
            <a
              href="/blog"
              className={isActive(path, "/blog") ? styles.active : ""}
            >
              <li>
                <Icon svg={blogIcon} />
                Blog
              </li>
            </a>
          </ul>

          <div style={{ flexGrow: 1 }} />
          <SocialLinks />
          <div className={styles.navFooter}>© {year} Andrew Friday</div>
        </div>
      </div>
    </>
  );
}
