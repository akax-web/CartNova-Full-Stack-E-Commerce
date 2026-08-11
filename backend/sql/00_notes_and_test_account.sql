-- CartNova — Database Notes
-- ===========================================================================
-- No schema changes are required. Every column name referenced by the new
-- backend matches what your CartDAO / OrderDAO queries already used
-- successfully (PRODUCTS_ID, PRODUCTS_NAME, etc. — confirmed by you as the
-- real column names). ProductDAO's bugs were fixed in application code only,
-- not in the schema.
--
-- The two things below are DATA changes, not schema changes, and are also
-- handled automatically for you at application startup by
-- com.shopping.migration.PasswordMigrationRunner — you do NOT need to run
-- this file by hand. It's included so you can see exactly what that class
-- does, and so you can run it manually if you ever want to.
-- ===========================================================================

-- 1. Ensure the demo/testing account exists (idempotent — does nothing if
--    it's already there). Runs with a plaintext password initially; the
--    migration runner then hashes it on next startup.
INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE)
SELECT 'Akash', 'test@gmail.com', '77777', 'Customer'
WHERE NOT EXISTS (SELECT 1 FROM USERS WHERE EMAIL = 'test@gmail.com');

-- 2. Password hashing itself CANNOT be done in plain SQL — BCrypt hashing
--    has to happen in application code (MySQL has no built-in BCrypt
--    function). This is exactly what PasswordMigrationRunner does at
--    startup: it finds every USERS row whose PASSWORD doesn't already look
--    like a BCrypt hash ($2a$/$2b$/$2y$ prefix) and hashes it in place.
--    Safe to run on every startup — already-hashed rows are skipped.
