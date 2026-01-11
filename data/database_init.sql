-- user
create table user_profile (
    id uuid references auth.users(id) on delete cascade,
    username text not null,
    avatar_url text,
    primary key (id)
);

-- house
create table house (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    address text not null,
    user_id uuid references user_profile(id) on delete cascade,
    created_at timestamp with time zone default now()
);

-- join table for many-to-many
create table user_house(
    user_id uuid references user_profile(id) on delete cascade,
    house_id uuid references house(id) on delete cascade,
    role text default 'member',
    stared boolean default false,
    primary key (user_id, house_id)
);

-- tasks table
create table tasks (
    id uuid primary key default gen_random_uuid(),
    house_id uuid references house(id) on delete cascade,
    title varchar not null,
    description text,
    assigned_to uuid references user_profile(id),
    due_date date,
    is_done boolean default false,
    created_at timestamp with time zone default now()
);

-- Budget part
create table expenses (
    id uuid primary key default gen_random_uuid(),
    house_id uuid references house(id) on delete cascade,
    title varchar not null,
    total_amount numeric(10,2) not null,
    created_by uuid references user_profile(id) not null,
    created_at timestamp with time zone default now(),
    split_type varchar not null -- Split type (e.g., 'equal', 'percentage', 'custom')
);

create table expense_splits (
    id uuid primary key default gen_random_uuid(),
    expense_id uuid references expenses(id) on delete cascade,
    user_id uuid references user_profile(id) on delete cascade, -- User assigned to pay
    amount numeric(10,2) not null -- User assigned amount
);

create table debts (
    id uuid primary key default gen_random_uuid(),
    house_id uuid references house(id) on delete cascade, -- FK to house
    debtor_id uuid references user_profile(id) not null, -- Usuario que debe dinero
    creditor_id uuid references user_profile(id) not null, -- Usuario al que se le debe dinero
    amount numeric(10,2) not null, -- Debt amount
    description text, -- Description debt (opcional)
    created_at timestamp with time zone default now(), -- Date creation
    is_paid boolean default false -- Debt state
);

-- polls part
create table polls (
    id uuid primary key default gen_random_uuid(),
    house_id uuid references house(id) on delete cascade,
    question text not null,
    created_by uuid references user_profile(id),
    created_at timestamp with time zone default now(),
    expires_at timestamp with time zone
);

create table poll_options (
    id uuid primary key default gen_random_uuid(),
    poll_id uuid references polls(id) on delete cascade,
    option_text text not null
);

create table poll_votes (
    id uuid primary key default gen_random_uuid(),
    poll_option_id uuid references poll_options(id) on delete cascade,
    voter_id uuid references user_profile(id),
    created_at timestamp with time zone default now(),
    unique(voter_id, poll_option_id)
);

create table poll_comments (
    id uuid primary key default gen_random_uuid(),
    poll_id uuid references polls(id) on delete cascade,
    created_by uuid references user_profile(id) not null,
    created_at timestamp with time zone default now(),
    last_updated_at timestamp with time zone default now(),
    comment_text text not null
);

-- notification part
create table notification (
    id uuid primary key default gen_random_uuid(),
    house_id uuid references house(id),
    user_id uuid references user_profile(id),
    message text not null,
    notification_type varchar not null, -- (e.g., 'task', 'poll', 'expense')
    related_id uuid, -- (e.g., task id, poll id, expense id)
    is_read boolean default false,
    created_at timestamp with time zone default now()
);