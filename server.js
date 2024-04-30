const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const staffNames = req.body.staffNames.split(',');
  const numbersPerStaff = req.body.numbersPerStaff.split(',').map(Number);

  const workbook = xlsx.readFile(file.path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = [];
  
  // Loop through each row in the worksheet
  for (let rowNum = 2; ; rowNum++) { // Assuming data starts from the second row
    const nameCell = worksheet[`A${rowNum}`];
    const numberCell = worksheet[`B${rowNum}`];

    if (!nameCell || !numberCell) break;

    data.push({
      Name: nameCell.v,
      Number: numberCell.v
    });
  }

  staffNames.forEach((staff, index) => {
    const start = index * numbersPerStaff[index];
    const end = start + numbersPerStaff[index];
    const staffData = data.slice(start, end);

    const ws = xlsx.utils.json_to_sheet(staffData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    const desktopPath = path.join('C:', 'Users', 'Admin', 'Desktop');
    const dataFolderPath = path.join(desktopPath, 'Data');
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath);
    }

    const filePath = path.join(dataFolderPath, `${staff}_students.xlsx`);
    xlsx.writeFile(wb, filePath);

    console.log(`${staff}_students.xlsx generated`);
  });

  res.send('Files generated successfully!');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
