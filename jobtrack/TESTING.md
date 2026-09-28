# Testing checklist

Start both servers first (`npm run dev` in `server/` and `client/`).

## Manual test checklist

### Auth
- [ ] Register a new account -> lands on dashboard
- [ ] Register again with the same email -> error "already exists"
- [ ] Register with a weak password / bad email -> field errors
- [ ] Log in with correct details -> dashboard
- [ ] Log in with a wrong password -> "Invalid email or password"
- [ ] Refresh the dashboard -> still logged in
- [ ] Log out -> back on landing page; opening /dashboard redirects to /login
- [ ] Current user: the top bar shows your name; /profile shows your email

### Applications
- [ ] Create an application with only company + position
- [ ] Create with all fields; try an invalid URL and a negative salary -> errors
- [ ] View list and open the details page
- [ ] Edit an application (change status) -> list and dashboard update
- [ ] Delete -> confirm dialog -> record disappears
- [ ] Search by company and by position
- [ ] Filter by status and by employment type; sort by newest / oldest / company
- [ ] Empty state: new account with no data; search with no results
- [ ] Invalid ID: open /applications/123 -> friendly error
- [ ] Unauthorized access: log in as user B and open user A's application URL -> "not found"

### Database (Atlas -> Browse Collections)
- [ ] `users` has your user and the password is a bcrypt hash (starts with `$2`)
- [ ] `jobapplications` documents have a `user` field matching your user `_id`

### Frontend
- [ ] Spinner/skeleton shows while data loads
- [ ] Error message + "Try again" shows when the API is stopped
- [ ] Layout works at ~375px width (menu button opens the sidebar; cards instead of table)
- [ ] Keyboard: Tab through the forms and dialogs, focus is visible

## API requests (curl)

Use `-c cookies.txt` to save the cookie and `-b cookies.txt` to send it.

```bash
API=http://localhost:5000/api

# Health
curl $API/health

# Register
curl -c cookies.txt -X POST $API/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Passw0rd123"}'

# Login
curl -c cookies.txt -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Passw0rd123"}'

# Current user
curl -b cookies.txt $API/auth/me

# Create
curl -b cookies.txt -X POST $API/applications -H "Content-Type: application/json" \
  -d '{"company":"Google","position":"Frontend Engineer","status":"Interview"}'

# List with search + filter
curl -b cookies.txt "$API/applications?status=Interview&search=Google"

# Stats
curl -b cookies.txt $API/applications/stats

# Update (replace ID)
curl -b cookies.txt -X PUT $API/applications/APPLICATION_ID -H "Content-Type: application/json" \
  -d '{"company":"Google","position":"Senior Frontend Engineer","status":"Offer"}'

# Delete (replace ID)
curl -b cookies.txt -X DELETE $API/applications/APPLICATION_ID

# Without a cookie -> 401
curl $API/applications

# Logout
curl -b cookies.txt -X POST $API/auth/logout
```

In Thunder Client / Postman, enable cookie handling (it is on by default) and send the same requests.
