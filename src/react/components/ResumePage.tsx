import styles from "./ResumePage.module.scss";

type ResumeProject = {
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
};

type ResumeJob = {
  company: string;
  logo: string;
  title: string;
  dates: string;
  description: string;
  highlights: string[];
  projects?: ResumeProject[];
};

export type ResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  highlights: string[];
  experience: ResumeJob[];
  projects?: ResumeProject[];
};

type Variant = "art" | "dev" | "hybrid" | "netflix";

type Props = {
  resumeData: ResumeData;
  variant?: Variant;
};

export default function ResumePage({ resumeData, variant = "art" }: Props) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.name}>{resumeData.name}</h1>
        <h4 className={styles.title}>{resumeData.title}</h4>

        <div className={styles.contactInfo}>
          <a
            href="#"
            className={styles.contactItem}
            id="email-link-resume"
            data-email-a="nad"
            data-email-b="relssef"
            data-email-c="moc"
          />
          <a href={`tel:${resumeData.phone}`} className={styles.contactItem}>
            {resumeData.phone}
          </a>
          <a
            href={"https://" + resumeData.website}
            className={styles.contactItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            {resumeData.website}
          </a>
        </div>
      </header>

      <nav className={styles.variantNav} aria-label="Resume version">
        <a
          className={`${styles.variantLink} ${
            variant === "art" ? styles.variantLinkActive : ""
          }`}
          href="/resume"
        >
          Creative
        </a>
        <a
          className={`${styles.variantLink} ${
            variant === "dev" ? styles.variantLinkActive : ""
          }`}
          href="/resume/dev"
        >
          Engineering
        </a>
      </nav>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Executive Summary</h2>
        {resumeData.summary.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
        <h4>Highlights</h4>
        <ul className={styles.highlights}>
          {resumeData.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {resumeData.experience.map((job) => (
          <div className={styles.experienceItem} key={`${job.company}-${job.title}`}>
            <div className={`${styles.companyLogoContainer} shadowfx`}>
              <img src={job.logo} alt={`${job.company} logo`} />
            </div>
            <div className={styles.companyContent}>
              <h3 className={styles.companyTitle}>{job.title}</h3>
              <span>{job.company}</span>
              <p className={styles.dates}>{job.dates}</p>
              {job.description.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}

              <h4>Highlights</h4>
              <ul className={styles.highlights}>
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              {job.projects && job.projects.length > 0 ? (
                <>
                  <h4>Projects</h4>
                  <div className={styles.projectsGrid}>
                    {job.projects.map((project) => (
                      <div className={`${styles.projectCard} shadowfx`} key={project.url}>
                        <h4 className={styles.projectTitle}>{project.name}</h4>
                        <p className={styles.projectDescription}>{project.description}</p>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          View Project →
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      {resumeData.projects && resumeData.projects.length > 0 ? (
        <section className={`${styles.section} ${styles.projectsSection}`}>
          <h2 className={styles.sectionTitle}>Miscellaneous Projects</h2>
          <div className={styles.projectsGrid}>
            {resumeData.projects.map((project) => (
              <div className={`${styles.projectCard} shadowfx`} key={project.url}>
                <h4 className={styles.projectTitle}>{project.name}</h4>
                <p className={styles.projectDescription}>{project.description}</p>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}


