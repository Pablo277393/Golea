-- Antigravity Database Schema (PostgreSQL)

-- Roles: coach, player, parent, admin
CREATE TYPE user_role AS ENUM ('coach', 'player', 'parent', 'admin');
CREATE TYPE event_type AS ENUM ('match', 'training');
CREATE TYPE notification_type AS ENUM ('informative', 'match', 'training');
CREATE TYPE callup_status AS ENUM ('called', 'injured', 'unavailable', 'standby');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    avatar_url TEXT
);

-- Family relations (Parent-Child)
CREATE TABLE family_relations (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    child_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_relation UNIQUE(parent_id, child_id)
);

-- Teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    coach_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Rosters (Players in teams)
CREATE TABLE team_players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    jersey_number INTEGER,
    position VARCHAR(20),
    CONSTRAINT unique_player_team UNIQUE(team_id, player_id)
);

-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    opponent VARCHAR(100) NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    departure_time TIME,
    location VARCHAR(255),
    home_score INTEGER,
    away_score INTEGER,
    is_home BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainings table
CREATE TABLE trainings (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    training_date DATE NOT NULL,
    training_time TIME NOT NULL,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Call-ups table (for matches and trainings)
CREATE TABLE callups (
    id SERIAL PRIMARY KEY,
    event_type event_type NOT NULL,
    event_id INTEGER NOT NULL, -- References matches(id) or trainings(id)
    player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status callup_status DEFAULT 'called',
    technical_note TEXT,
    UNIQUE(event_type, event_id, player_id)
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Null if team/global
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE, -- Null if individual/global
    scope VARCHAR(20) DEFAULT 'individual', -- individual, team, global
    type notification_type DEFAULT 'informative',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    predicted_home_score INTEGER NOT NULL,
    predicted_away_score INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    UNIQUE(match_id, user_id)
);

-- MVP Weekly
CREATE TABLE weekly_mvps (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    votes_count INTEGER DEFAULT 0,
    UNIQUE(team_id, week_number, year)
);
