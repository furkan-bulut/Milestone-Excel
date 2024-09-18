//DESCRIPTION

This app exports a repo's milestone informations such as issues, labels, pull request title and state to an excel file.

While server.js accepts parameters directly from code, cURL.js accepts parameters from query and can be used either entering modified cURL commands directly to the browser or with postman.

There is an example postman collection with an example owner and repo for you to import and test parameters. Just replace the github personal access token and you're good to go.


//HOW TO INSTALL SERVER.JS USAGE

step 1 - Go to your terminal and insert "npm install"

step 2 - From your terminal insert "node server.js" to start server.js

step 3 - Open server.js with an IDE and change the owner, repo, token and milestoneName for your needs.(default is empty so it won't work if left untouched.)

step 3 - From your browser go to "localhost:3000/export-excel" and that's it


//HOW TO INSTALL cURL.JS USAGE FROM POSTMAN

step 1 - Go to your terminal and insert "npm install"

step 2 - From your terminal insert "node cURL.js" to start cURL.js

step 3 - Open Postman app and after selecting your workspace head to collections

step 4 - click "import" and select Milestone-Export.postman_collection.json from base directory

step 5 - Modify the given example parameters and click "Send"

step 6 - if the response turns 200 OK you can access cURL code snippet by clicking to the "code" button on the right sidebar.

step 7 - Copy the cURL command and paste it to the browser's URL bar


//HOW TO INSTALL cURL.JS USAGE FROM BROWSER

step 1 - Go to your terminal and insert "npm install"

step 2 - From your terminal insert "node cURL.js" to start cURL.js

step 3 - Open your browser and paste the cURL command you like from below after changing the parameters for your needs to URL bar



//cURL COMMANDS

This request fetches issues for all milestones in public repos:
curl: "http://localhost:3000/export-excel?owner=user-name&repo=repo-name&token=github-token"

To filter issues by a specific milestone name, include the milestoneName query parameter:
curl: "http://localhost:3000/export-excel?owner=user-name&repo=repo-name&token=github-token&milestoneName=milestone-name"

To use simply change the "user-name", "repo-name", "github-token" and "milestone-name" parts for your needs.