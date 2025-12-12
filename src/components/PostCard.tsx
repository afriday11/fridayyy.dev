import styles from "./PostCard.module.scss";

type PostFrontmatter = {
  title: string;
  description?: string;
  pubDate: string | Date;
  image?: {
    url: string;
    alt?: string;
  };
};

export type PostLike = {
  url: string;
  frontmatter: PostFrontmatter;
};

type Props = {
  post: PostLike;
  horizontal?: boolean;
};

export default function PostCard({ post, horizontal = false }: Props) {
  const imageUrl = post.frontmatter.image?.url;
  const date = new Date(post.frontmatter.pubDate);

  return (
    <a
      className={`${styles.post} shadowfx ${horizontal ? styles.horizontal : ""}`}
      href={post.url}
    >
      <div
        className={styles.postThumbnail}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      <div className={styles.postContent}>
        <span className={styles.postDate}>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <h1>{post.frontmatter.title}</h1>
        {post.frontmatter.description ? <p>{post.frontmatter.description}</p> : null}
        <span className={styles.readMore}>Read More</span>
        <div style={{ height: "1.5rem" }} />
      </div>
    </a>
  );
}


