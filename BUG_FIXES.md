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