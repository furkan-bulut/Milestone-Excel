This request fetches issues for all milestones in public repos:
curl "http://localhost:3000/export-excel?owner=user-name&repo=repo-name&token=github-token"

To filter issues by a specific milestone name, include the milestoneName query parameter:
curl "http://localhost:3000/export-excel?owner=user-name&repo=repo-name&token=github-token&milestoneName=milestone-name"

To use simply change the "user-name", "repo-name", "github-token" and "milestone-name" parts for your needs.