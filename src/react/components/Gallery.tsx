import { useEffect, useMemo, useRef } from "react";
import type { GalleryPostLike } from "../types/posts";
import styles from "./Gallery.module.scss";

type Props = {
  category?: string;
  posts: GalleryPostLike[];
  baseUrl: string;
  persistText?: boolean;
  categories?: string[];
};

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

const ExternalLinkIcon = () => (
  <svg
    className={styles.cardIcon}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z" />
  </svg>
);

export default function Gallery({
  category,
  posts,
  baseUrl,
  persistText = false,
  categories,
}: Props) {
  const subnavRef = useRef<HTMLDivElement | null>(null);

  const derivedCategories = useMemo(() => {
    const fromPosts = unique(posts.flatMap((p) => p.frontmatter.categories ?? []));
    return categories && categories.length ? categories : fromPosts;
  }, [posts, categories]);

  const filteredPosts = useMemo(() => {
    return category
      ? posts.filter((p) => p.frontmatter.categories?.includes(category))
      : posts;
  }, [posts, category]);

  const sortedPosts = useMemo(() => {
    // match original: sort by priority descending
    return [...filteredPosts].sort(
      (a, b) => (b.frontmatter.priority || 0) - (a.frontmatter.priority || 0)
    );
  }, [filteredPosts]);

  useEffect(() => {
    const subnav = subnavRef.current;
    if (!subnav) return;
    const activeItem = subnav.querySelector<HTMLElement>("[data-active='true']");
    if (!activeItem) return;

    const subnavRect = subnav.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();
    const scrollLeft =
      activeRect.left -
      subnavRect.left -
      subnavRect.width / 2 +
      activeRect.width / 2;

    subnav.scrollTo({ left: scrollLeft });
  }, [category]);

  function handlePointerEnter(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "touch") return;
    const sheen = e.currentTarget.querySelector<HTMLDivElement>("[data-sheen]");
    const card = e.currentTarget.querySelector<HTMLDivElement>("[data-card]");
    if (!sheen || !card) return;

    card.style.transition = "all 0.1s linear";
    sheen.style.transition = "all 0.1s linear";
    sheen.style.opacity = "1";
    window.setTimeout(() => {
      card.style.transition = "none";
      sheen.style.transition = "none";
    }, 100);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "touch") return;
    const sheen = e.currentTarget.querySelector<HTMLDivElement>("[data-sheen]");
    const card = e.currentTarget.querySelector<HTMLDivElement>("[data-card]");
    if (!sheen || !card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 10;
    const rotateX = (y / rect.height - 0.5) * -10;
    const sheenX = (1 - x / rect.width) * 100;
    const sheenY = (1 - y / rect.height) * 100;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    sheen.style.backgroundPosition = `${100 - sheenX}% ${100 - sheenY}%`;
  }

  function handlePointerLeave(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === "touch") return;
    const sheen = e.currentTarget.querySelector<HTMLDivElement>("[data-sheen]");
    const card = e.currentTarget.querySelector<HTMLDivElement>("[data-card]");
    if (!sheen || !card) return;

    card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    sheen.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    sheen.style.opacity = "0";
    window.setTimeout(() => {
      card.style.transition = "none";
      sheen.style.transition = "none";
    }, 500);
  }

  return (
    <>
      <div className={styles.subnav} ref={subnavRef}>
        <div className={styles.subnavItems}>
          <a
            className={`${styles.subnavItem} ${
              category === undefined ? `${styles.subnavItemActive} shadowfx` : ""
            }`}
            href={baseUrl}
            data-active={category === undefined ? "true" : "false"}
          >
            All
          </a>
          {derivedCategories.map((thisCategory) => (
            <a
              key={thisCategory}
              className={`${styles.subnavItem} ${
                thisCategory === category ? `${styles.subnavItemActive} shadowfx` : ""
              }`}
              href={`${baseUrl}/${thisCategory}`}
              data-active={thisCategory === category ? "true" : "false"}
            >
              {thisCategory}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.gallery}>
        {sortedPosts.map((post) => {
          const href = post.frontmatter.url || post.url;
          return (
            <a
              key={href}
              className="card-container"
              href={href}
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div className={`${styles.card} shadowfx`} data-card>
                <div
                  className={styles.cardBg}
                  style={{ backgroundImage: `url(${post.frontmatter.thumbnail})` }}
                />
                <div className={styles.sheen} data-sheen />
                <div
                  className={`${styles.cardInfo} ${
                    persistText ? styles.cardInfoPersist : ""
                  }`}
                >
                  <div className={styles.title}>{post.frontmatter.title}</div>
                  {post.frontmatter.description ? (
                    <div className={styles.description}>
                      {post.frontmatter.description}
                    </div>
                  ) : null}
                  <div className={styles.category}>
                    {post.frontmatter.categories.join(", ")}
                  </div>
                </div>
                {post.frontmatter.url ? <ExternalLinkIcon /> : null}
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}


