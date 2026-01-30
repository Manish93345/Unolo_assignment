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