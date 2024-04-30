  import React, { useState } from 'react';
  import axios from 'axios';

  const App = () => {
    const [file, setFile] = useState(null);
    const [staffNames, setStaffNames] = useState('');
    const [numbersPerStaff, setNumbersPerStaff] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('staffNames', staffNames);
      formData.append('numbersPerStaff', numbersPerStaff);

      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div>
        <h1>Upload Excel File</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <br /><br />
          <label htmlFor="staffNames">Staff Names (comma separated):</label>
          <input type="text" id="staffNames" value={staffNames} onChange={(e) => setStaffNames(e.target.value)} />
          <br /><br />
          <label htmlFor="numbersPerStaff">Numbers per Staff (comma separated):</label>
          <input type="text" id="numbersPerStaff" value={numbersPerStaff} onChange={(e) => setNumbersPerStaff(e.target.value)} />
          <br /><br />
          <input type="submit" value="Upload" />
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };

  export default App;
