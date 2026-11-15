CREATE TABLE users (
    user_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE links (
    link_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    link text NOT NULL,
    short_code varchar(255) NOT NULL UNIQUE,
    user_id bigint NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE clicks (
    click_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    link_id bigint NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_links FOREIGN KEY (link_id) REFERENCES links(link_id) ON DELETE CASCADE
);