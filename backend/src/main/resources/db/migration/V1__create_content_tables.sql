-- Content tables for the portfolio API (SRS section 7), plus the contact-form log.
-- Long text uses VARCHAR rather than TEXT so the same script runs on MySQL and on the H2 test database.

CREATE TABLE profile (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    name         VARCHAR(100)  NOT NULL,
    title        VARCHAR(150)  NOT NULL,
    tagline      VARCHAR(300)  NOT NULL,
    bio          VARCHAR(2000) NOT NULL,
    interests    VARCHAR(1000),
    objective    VARCHAR(1000),
    location     VARCHAR(100),
    email        VARCHAR(254),
    resume_url   VARCHAR(500),
    github_url   VARCHAR(500),
    linkedin_url VARCHAR(500),
    PRIMARY KEY (id)
);

CREATE TABLE skill (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    category VARCHAR(50)  NOT NULL,
    name     VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_skill_category_name UNIQUE (category, name)
);

CREATE TABLE project (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    problem     VARCHAR(1000) NOT NULL,
    -- Comma-separated, e.g. 'Java, Spring Boot, MySQL'
    tech_stack  VARCHAR(500)  NOT NULL,
    image_url   VARCHAR(500),
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    featured    BOOLEAN       NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE education (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    institution VARCHAR(200)  NOT NULL,
    degree      VARCHAR(100)  NOT NULL,
    field       VARCHAR(150),
    start_year  INT           NOT NULL,
    end_year    INT,
    notes       VARCHAR(1000),
    PRIMARY KEY (id)
);

CREATE TABLE certification (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(200) NOT NULL,
    issuer     VARCHAR(150) NOT NULL,
    issue_date DATE         NOT NULL,
    verify_url VARCHAR(500),
    PRIMARY KEY (id)
);

CREATE TABLE contact_message (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(254)  NOT NULL,
    message      VARCHAR(5000) NOT NULL,
    submitted_at DATETIME(6)   NOT NULL,
    PRIMARY KEY (id)
);
