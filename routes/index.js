var express = require('express');
var router = express.Router();

let submissions = []
let available = false
let passphrase = ''

router.post('/submission', function(req, res) {
  console.log('Received data:', req.body);

  submissions.push({ ...req.body, timestamp: new Date() });
  
  res.status(200).json({ message: 'Data received successfully!' });
});

router.get('/submissions', function(req, res) {
  const createTableRows = (data) => {
        return data
            .map(item => {
                return `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.errors}</td>
                  <td>${item.comparisons}</td>
                  <td>${item.swaps}</td>
                  <td>${item.time}</td>
                  <td>${item.mode}</td>
                  <td>${item.numberofcards}</td>
                  <td>${item.valuetype}</td>
                  <td>${item.valuedistribution}</td>
                </tr>`;
            })
            .join("\n");
    };

    const createTable = (data) => {
        const headers = `
        <tr>
          <th>Name</th>
          <th>Errors</th>
          <th>Comparisons</th>
          <th>Swaps</th>
          <th>Time</th>
          <th>Mode</th>
          <th>Number of Cards</th>
          <th>Value Type</th>
          <th>Value Distribution</th>
        </tr>`;
        const rows = createTableRows(data);
        return `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead style="background-color: #f2f2f2;">${headers}</thead>
          <tbody>${rows}</tbody>
        </table>`;
    };

    res.send(`
    <html>
    <head>
      <title>Submissions</title>
    </head>
    <body>
      <h1>Submissions</h1>
      ${createTable(submissions)}
    </body>
    </html>
    `);
});

router.get('/available', (req, res) => {
  if (!passphrase) {
    return res.json({ available: false, message: 'No passphrase set' });
  }
  res.json({ available: available });
});

router.get('/start', (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({
      message: 'No key provided',
      available: available,
    });
  }

  if (key === 'true' || key === 'false') {
    return res.status(400).json({
      message: 'Invalid key provided',
      available: available,
    });
  }

  passphrase = key;
  available = true;
  res.json({
    message: 'Key set successfully',
    passphrase: passphrase,
    available: available,
  });
});

router.get('/getKey', (req, res) => {
  if (available) {
    return res.json({ passphrase: passphrase });
  }
  res.status(404).json({ message: 'No passphrase available' });
});

router.get('/reset', (req, res) => {
  submissions = [];
  res.json({ message: 'Submissions reset successfully' });
});

router.get('/stop', (req, res) => {
  available = false;
  passphrase = '';
  res.json({ message: 'Server stopped, passphrase cleared', available: available });
});

module.exports = router;
