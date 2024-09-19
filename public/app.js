document.getElementById('export-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const owner = document.getElementById('owner').value;
    const repo = document.getElementById('repo').value;
    const milestoneName = document.getElementById('milestoneName').value;
    const token = document.getElementById('token').value;

    try {
        // Fetch the data from the backend
        const response = await fetch(`/export-excel?owner=${owner}&repo=${repo}&token=${token}&milestoneName=${milestoneName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch milestone data');
        }

        async function fetchAndParseExcel(url) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        }

        // Replace with your actual endpoint URL
        fetchAndParseExcel(`/export-excel?owner=${owner}&repo=${repo}&token=${token}&milestoneName=${milestoneName}`);

        // Assuming the response is an Excel file, prompt for download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${owner}_${repo}_${milestoneName || 'all'}_milestones.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('show-button').addEventListener('click', async function(event) {
    event.preventDefault();

    const owner = document.getElementById('owner').value;
    const repo = document.getElementById('repo').value;
    const milestoneName = document.getElementById('milestoneName').value;
    const token = document.getElementById('token').value;

    try {
        const response = await fetch(`/fetch-data?owner=${owner}&repo=${repo}&token=${token}&milestoneName=${milestoneName}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch milestone data');
        }

        const data = await response.json();

        const tbody = document.getElementById('table-body');
        tbody.innerHTML = ''; // Clear previous table rows if any

        // Assuming data is an array of milestone objects with issues
        data.forEach(milestone => {
            milestone.issues.forEach(issue => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${milestone.milestoneTitle}</td>
                    <td>${issue.title}</td>
                    <td>${issue.labels.join(', ')}</td>
                    <td>${issue.pull_request}</td>
                    <td>${issue.state}</td>
                `;
                tbody.appendChild(row);
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
});