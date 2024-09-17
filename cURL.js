const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const port = 3000;

// Fetch milestones from GitHub
async function fetchMilestones(owner, repo, token) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/milestones`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response.json();
}

// Fetch issues for a specific milestone
async function fetchIssuesForMilestone(owner, repo, token, milestoneNumber) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?milestone=${milestoneNumber}&state=all`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response.json();
}

// Fetch pull request details for a given issue (if the issue has an associated PR)
async function fetchPullRequestForIssue(owner, repo, token, issueUrl) {
  if (!issueUrl) {
    console.error("No issue URL provided");
    return { title: 'No PR' }; // Return a default value if the URL is undefined
  }

  try {
    const response = await fetch(issueUrl, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch pull request: ${response.statusText}`);
      return { title: 'No PR' }; // Return a default value on error
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pull request:", error);
    return { title: 'No PR' }; // Return a default value on error
  }
}

// Function to auto-fit column widths
function autoFitColumns(worksheet, data) {
  const columnWidths = data[0].map((_, colIndex) =>
    Math.max(
      ...data.map(row => row[colIndex] ? row[colIndex].toString().length : 0)
    )
  );

  worksheet['!cols'] = columnWidths.map(width => ({ wch: width + 5 })); // Adjust width with extra space
}

// Function to write data to Excel file with formatting
async function createExcelFile(milestonesWithIssues, filePath) {
  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [['Milestone', 'Issue', 'Labels', 'PR Title', 'State']]; // Headers

  // Populate worksheet data
  for (const milestone of milestonesWithIssues) {
    for (const issue of milestone.issues) {
      worksheetData.push([
        milestone.milestoneTitle,
        issue.title,
        issue.labels.join(', '),
        issue.pull_request || 'No PR',  // Pull request title
        issue.state  // Add the state of the issue
      ]);
    }
  }

  // Add the data to the worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Style header row (bold, background color)
  const headerStyle = {
    font: { bold: true },
    fill: {
      fgColor: { rgb: 'FFFFCC00' }  // Yellow background color
    },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Apply header styles to the first row
  ['A1', 'B1', 'C1', 'D1', 'E1'].forEach(cell => {
    worksheet[cell].s = headerStyle;
  });

  // Apply auto-fit to the columns
  autoFitColumns(worksheet, worksheetData);

  // Add borders and some styling to the rest of the cells
  const borderStyle = {
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  for (let row = 2; row <= worksheetData.length; row++) {
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
      const cell = worksheet[`${col}${row}`];
      if (cell) {
        cell.s = borderStyle;
      }
    });
  }

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Milestones & Issues');

  // Write to Excel file
  XLSX.writeFile(workbook, filePath);
  return filePath;
}

// Endpoint to export milestones, issues, labels, PR titles, and issue states to an Excel file
app.get('/export-excel', async (req, res) => {
  try {
    // Retrieve query parameters
    const owner = req.query.owner;         // Get the repository owner from query parameters
    const repo = req.query.repo;           // Get the repository name from query parameters
    const token = req.query.token;         // Get the GitHub token from query parameters
    const milestoneName = req.query.milestoneName; // Get the milestone name from query parameters

    // Log parameters for debugging
    console.log('Received query parameters:', { owner, repo, token, milestoneName });

    // Validate required parameters
    if (!owner || !repo || !token) {
      return res.status(400).json({ error: 'Missing required query parameters: owner, repo, token' });
    }

    // Fetch all milestones
    const milestones = await fetchMilestones(owner, repo, token);

    // Filter milestones by name (if provided)
    const filteredMilestones = milestoneName
      ? milestones.filter(milestone => milestone.title.toLowerCase().includes(milestoneName.toLowerCase()))
      : milestones; // If no name is provided, include all milestones

    if (filteredMilestones.length === 0) {
      return res.status(404).json({ error: `No milestones found with name: ${milestoneName}` });
    }

    // Array to store the data we will write to Excel
    const milestonesWithIssues = [];

    // Loop through each filtered milestone to fetch its issues and labels
    for (const milestone of filteredMilestones) {
      const issues = await fetchIssuesForMilestone(owner, repo, token, milestone.number);

      const issuesWithLabelsAndPR = await Promise.all(issues.map(async issue => {
        let prTitle = 'No PR';

        // Check if the issue has a pull request URL
        if (issue.pull_request && issue.pull_request.url) {
          console.log(`Fetching PR for issue: ${issue.title}, PR URL: ${issue.pull_request.url}`);
          const pullRequest = await fetchPullRequestForIssue(owner, repo, token, issue.pull_request.url);
          prTitle = pullRequest.title || 'No PR';
        } else {
          console.log(`No pull request for issue: ${issue.title}`);
        }

        return {
          title: issue.title,
          labels: issue.labels.map(label => label.name),
          pull_request: prTitle,
          state: issue.state // Capture the issue state
        };
      }));

      milestonesWithIssues.push({
        milestoneTitle: milestone.title,
        issues: issuesWithLabelsAndPR
      });
    }

    // Create the Excel file and get the file path
    const filePath = './milestones_issues_pr_state.xlsx';
    await createExcelFile(milestonesWithIssues, filePath);

    // Send the file to the client for download
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      } else {
        // Optional: Delete the file after sending it
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Error fetching data or exporting to Excel:', error);
    res.status(500).json({ error: 'Failed to export to Excel' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
