This request fetches issues for all milestones in public repos:
curl "http://localhost:3000/export-excel"

To filter issues by a specific milestone name, include the milestoneName query parameter:
curl "http://localhost:3000/export-excel?milestoneName=your-milestone-name"

With authorization header:
curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" "http://localhost:3000/export-excel?milestoneName=your-milestone-name"

