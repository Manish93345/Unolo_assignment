# Bug 1 – Login Password Validation Failure 
Location:
    backend/routes/auth.js

Issue:
    bcrypt.compare is async function and it returns a promise which require "await" to be used, but in the code, it was not there that's why password validation was not working properly. 

Fix:
    Added await before bcrypt.compare()

Code changes:
    - const isValidPassword = bcrypt.compare(password, user.password);
    + const isValidPassword = await bcrypt.compare(password, user.password);

# Bug 2 – Sensitive Data Exposure in JWT
Location:
    backend/routes/auth.js

Issue: 
    In JWT payload, password hash is getting included. 

Fix:
    Removed password from JWT payload

Code changes: 
    - { id: user.id, email: user.email, role: user.role, name: user.name, password: user.password }
    + { id: user.id, email: user.email, role: user.role, name: user.name }


# Bug 3 — Dashboard API 500 Error Due To Database Query
Location:
    backend/routes/dashboard.js

Issue: 
    Here we are using SQLite database but the Query is written in MySQL format (DATE_SUB() and NOW()). 

Fix: 
    Replaced MySQL date functions with SQLite datetime() function.

Code changes:
    - DATE_SUB(NOW(), INTERVAL 7 DAY)
    + datetime('now', '-7 days')


# Bug 4 — History Page Crash Due To Null State (Hisory page not loading)
Location:
    frontend/src/pages/History.jsx
    Line number -> 5

Issue:
    checkins state is initializing with null so getting crashed on calling reduce()

Fix:
    Initialize state with empty array.

Code changes:
    - const [checkins, setCheckins] = useState(null);
    + const [checkins, setCheckins] = useState([]);


# Bug 5— Database mismatch variable name
Location:
    backend/routes/checkin.js
    Line number -> 57

Issue:
    Longitude and Latitude were written as Lat, long

Code change:
    - INSERT INTO checkins (employee_id, client_id, lat, lng, notes, status)
    + INSERT INTO checkins (employee_id, client_id, latitude, longitude, notes, status)

# Bug 6 — SQLite String Quoting Causing Insert Failure (Fixing checkin problem)
Location: 
    backend/routes/checkin.js
    Line -> 45

Issue:
    CheckIn API call database error due to the difference between MySQL and SQLite SQL syntax

Fix:
    - status = "checked_in"
    + status = 'checked_in'