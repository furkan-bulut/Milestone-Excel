// DESCRIPTION

This app shows a repo's milestone informations such as issues, labels, pull request title and state and exports these informations to an excel file.


// PREREQUISITES

- Node js


// HOW TO INSTALL

1- Run "npm install" in your terminal to install dependencies.

2- From your terminal insert "node server.js" while inside of the base directory.

3- Open your browser and head to "localhost:3000" and you're good to go.


// RUNNING WITH DOCKER 

1- From base directory build the app with "docker build -t your-desired-container-tag ."

2- Run the container in detached mode and fixed port "3000:3000" with "docker run -d -p 3000:3000 your-container-tag"

3- Open your browser and head to "localhost:3000" and you're good to go.


// HOW TO USE

Once you run the project you'll see a form that requests "Repository Owner", "Repository Name", "Milestone Name" and "GitHub Token" informations. After filling the form with the needed information simply click the button with the name of the action you want to take.


// ENDPOINTS

If you don't want to work with the ui you can directly export as excel or fetch the data as an array by entering the endpoint urls below to your browsers URL bar. Just make sure to modify the "owner", "repo", "token", "milestoneName" query parameters for your needs.

Alternatively you can use Postman to fetch the data as an array too but it won't download the excel file if you try to export.

endpoint url to export directly : "http://localhost:3000/export-excel?owner=github-username&repo=repo-name&token=github-personal-access-token&milestoneName=milestone-name"

endpoint url to fetch data as an array : "http://localhost:3000/fetch-data?owner=github-username&repo=repo-name&token=github-personal-access-token&milestoneName=milestone-name"
