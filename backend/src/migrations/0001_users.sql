


CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,

    clerk_user_id TEXT UNIQUE NOT NULL,

    display_name TEXT,

    handle TEXT UNIQUE,

    avatar_url TEXT,

    bio TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
)