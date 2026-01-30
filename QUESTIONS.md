1. **If this app had 10,000 employees checking in simultaneously, what would break first? How would you fix it?**
-> If 10,000 employees check in simultaneously, the first major bottleneck would likely be the backend server and database performance, especially because the current architecture uses a single Node.js instance and SQLite database.
-> **Database will break first**
-> SQLite is a file-based database and supports limited concurrent writes. With thousands of simultaneous checkins, **database locking may occur**, **Insert queries may slow down**, **Requests may fail or timeout**.
-> **Fixing**
-> We can move to some scalable databases like PostgreSQL, MySQL, Cloud DB like AWS. 

2. **The current JWT implementation has a security issue. What is it and how would you improve it?**
-> The current JWT implementation has a potential security issue related to secret management and token payload handling.
-> It has some Default Secret Fallback Risk. If you look at this code **process.env.JWT_SECRET || 'default-secret-key'** you will find that If environment variable is missing it will lead to predictable secret and the tokens may be forged. 
-> One of the issue is **Long Token Expiry** which is 24hrs. 
-> **Fixing**
-> Remove Default Secret, Reduce Token Expiry

3. **How would you implement offline check-in support? (Employee has no internet, checks in, syncs later)**
-> To implement offline check-in support, I would use a combination of local storage and background sync.
-> We can use browser API to detect for offline mode. 
-> We will store offline checkins locally.
-> Detect using **window.addEventListener("online")** and Send stored check-ins to backend. 


4. **Explain the difference between SQL and NoSQL databases. For this Field Force Tracker application, which would you recommend and why? Consider factors like data structure, scaling, and query patterns.**
-> SQL and NoSQL databases differ mainly in data structure, scalability, and query patterns.
-> SQL Databases (like MySQL) have Structured tables, Strong relationships, ACID transactions properties. 
-> ACID transactions (like MongoDB) have Flexible schema, Document or key-value storage ans they are Document or key-value storage.
-> For Field Force Tracker Application which inlude Users, Clients, Check-ins which requires Strong relationships and Transaction safety, I think **SQL Database** will be the best choice. Because Employee, Client, Checkin requires relational structure. Reporting queries need joins and aggregation.



5. **What is the difference between authentication and authorization? Identify where each is implemented in this codebase.**
-> Authentication and Authorization are two core security concepts but serve different purposes.
-> **Authentication** : It tells who are you? It verifies the identity of a user. 
-> In this project Authentication is Implemented using JWT tokens. User logs in with email and password and Server verifies credentials.
-> **Authorization** : Authorization checks what actions user can perform after login.
-> here Employee: Can check-in, Can view history, Manager: Can view team reports, Can view analytics is Authorization. 



6. **Explain what a race condition is. Can you identify any potential race conditions in this codebase? How would you prevent them?**
-> A race condition occurs when multiple operations try to access or modify shared data simultaneously, causing unpredictable or incorrect results.
-> Possible Race Conditions 1: Check-in Active Status Check -> If two requests come simultaneously then Both may pass check which lead to race condition.
-> Possible Race Conditions 2: Checkout + Check-in Same Time -> If Checkout request running AND Check-in request running May create inconsistent status.
-> How To Prevent Race Conditions: By adding Database Constraints, using wrap operations in Database Transactions.