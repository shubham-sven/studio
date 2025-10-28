# TODO: Implement Password Validation for Login

## Steps to Complete

- [x] Update src/lib/data.ts: Add 'password' and 'role' fields to users (e.g., password: 'password123', role: 'buyer' or 'artist')
- [x] Update src/context/auth-context.tsx: Modify login function to take email and password, validate against users data, set user if valid, else handle error
- [x] Update src/app/login/page.tsx: Use form submission to capture email/password, call login, display error if invalid
- [x] Test login with valid/invalid credentials and ensure error messages display properly

# TODO: Implement Forgot Password Functionality (Flipkart-style OTP)

## Steps to Complete

- [x] Create src/app/forgot-password/page.tsx: Two-step process - email input then OTP verification
- [x] Create src/app/reset-password/page.tsx: Page to set new password after OTP verification
- [x] Add mock OTP generation and verification logic
- [x] Update src/app/login/page.tsx: Ensure forgot password link works (already present)
- [x] Test complete forgot password flow: email → OTP → reset password

# TODO: Implement User Registration/Signup

## Steps to Complete

- [x] Update src/app/signup/page.tsx: Add proper form handling with validation
- [x] Add user creation logic: Check for existing emails, create new user, update credentials
- [x] Auto-login after successful signup
- [x] Add password confirmation field and validation
- [x] Test signup flow with new user creation
