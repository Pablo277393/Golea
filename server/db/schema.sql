-- Activar claves foráneas
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('coach','player','parent','admin','superadmin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Family relations
CREATE TABLE family_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    child_id INTEGER,
    UNIQUE(parent_id, child_id),
    FOREIGN KEY(parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(child_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teams table
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    coach_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(coach_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Team players
CREATE TABLE team_players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    player_id INTEGER,
    jersey_number INTEGER,
    position TEXT,
    UNIQUE(team_id, player_id),
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Matches
CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    opponent TEXT NOT NULL,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    departure_time TIME,
    location TEXT,
    home_score INTEGER,
    away_score INTEGER,
    is_home INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Trainings
CREATE TABLE trainings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    training_date DATE NOT NULL,
    training_time TIME NOT NULL,
    location TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Callups
CREATE TABLE callups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL CHECK(event_type IN ('match','training')),
    event_id INTEGER NOT NULL,
    player_id INTEGER,
    status TEXT DEFAULT 'called' CHECK(status IN ('called','injured','unavailable','standby')),
    technical_note TEXT,
    UNIQUE(event_type, event_id, player_id),
    FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    recipient_id INTEGER,
    team_id INTEGER,
    scope TEXT DEFAULT 'individual',
    type TEXT DEFAULT 'informative' CHECK(type IN ('informative','match','training')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Predictions
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER,
    user_id INTEGER,
    predicted_home_score INTEGER NOT NULL,
    predicted_away_score INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    UNIQUE(match_id, user_id),
    FOREIGN KEY(match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weekly MVPs
CREATE TABLE weekly_mvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    player_id INTEGER,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    votes_count INTEGER DEFAULT 0,
    UNIQUE(team_id, week_number, year),
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY(player_id) REFERENCES users(id) ON DELETE CASCADE
);
