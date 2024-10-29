CREATE TABLE edb_details (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    hashed_Password VARCHAR(150) NOT NULL
);

CREATE TABLE edb_task (
    task_id SERIAL PRIMARY KEY,
    task_title VARCHAR(300),
    task_description TEXT, -- Using TEXT for potentially longer descriptions
    task_status VARCHAR(60) DEFAULT 'Pending', -- Single quotes for string literals
    due_date DATE,
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Using TIMESTAMP for timestamps
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Using TIMESTAMP for timestamps
    edb_id INTEGER REFERENCES edb_details(id) -- REFERENCES instead of REFERENCE
);

CREATE TABLE productivity (
    productivity_id SERIAL PRIMARY KEY,
    productivity_percent TEXT,
    productivity_date DATE,
    employee_id INTEGER REFERENCES edb_details(id)
);

CREATE TABLE edb_leave (
    id SERIAL PRIMARY KEY,
    allocated_leave INTEGER NOT NULL CHECK (allocated_leave >= 0),
    leave_start_date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    leave_left INTEGER NOT NULL CHECK (leave_left >= 0),
	leave_status VARCHAR(60) DEFAULT 'Not Approved',
    employee_id INTEGER REFERENCES edb_details(id)
);

CREATE TABLE edb_report (
    report_id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    report_content TEXT,
   employee_ref INTEGER REFERENCES edb_details(id)
);



CREATE TABLE admin_edb (
    admin_id SERIAL PRIMARY KEY,
    admin_username VARCHAR(10) NOT NULL, -- Adjusted length
    admin_password VARCHAR(150) NOT NULL,
    admin_fullName VARCHAR(100) NOT NULL, -- Adjusted length
    admin_email VARCHAR(255) UNIQUE NOT NULL, -- Adjusted length
    admin_status VARCHAR(20) DEFAULT 'Active', -- Adjusted length
    admin_role VARCHAR(20) DEFAULT 'Editor', -- Adjusted length
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_date DATE DEFAULT CURRENT_DATE,
    updated_date DATE DEFAULT CURRENT_DATE
);

-- Calculating the total Amount of time spent
SELECT 
    edb_id, 
    EXTRACT(MONTH FROM completion_date) AS month, 
    SUM(EXTRACT(EPOCH FROM (completion_date - created_at)::interval) / 3600) AS total_hours_worked
  FROM 
    edb_task
  GROUP BY 
    edb_id, 
    EXTRACT(MONTH FROM completion_date);

-- OR

SELECT 
    edb_id, 
    EXTRACT(MONTH FROM completion_date) AS month, 
    SUM(EXTRACT(EPOCH FROM (completion_date - created_at)::interval) / 3600) AS total_hours_worked
  FROM 
    edb_task
  GROUP BY 
    edb_id, 
    EXTRACT(MONTH FROM completion_date);

-- THIS WAS USED
      SELECT 
        edb_id,
        EXTRACT(MONTH FROM completion_date) AS month,
        COUNT(*) AS total_tasks,
        SUM(EXTRACT(EPOCH FROM (completion_date - created_at)) / 3600) AS total_hours_worked
      FROM 
        edb_task
      GROUP BY 
        edb_id,
        EXTRACT(MONTH FROM completion_date
-- Getting the number of tasks  
SELECT 
edb_id,
    COUNT(*) AS total_tasks 
  FROM 
    edb_task
  GROUP BY 
    edb_id




