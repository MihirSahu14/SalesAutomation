import './App.css';
import React, { useState } from 'react';
import { TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Link } from '@mui/material';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const services = [
  'Microsoft 365 Copilot',
  'AI Consulting',
  'RPA',
  'Data Management',
  'Cloud Enablement',
  'Cyber Security',
  'SAP Services',
  'Enterprise IT'
];

function App() {
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientDesc, setClientDesc] = useState('');
  const [serviceName, setServiceName] = React.useState([]);
  const [problemStatement, setProblemStatement] = useState('');
  const [pptLink, setPptLink] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [req, setReq] = useState('');

  const handleServiceChange = (event) => {
    const {
      target: { value },
    } = event;
    setServiceName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSubmit = async () => {
    if (clientName === '' || clientDesc === '') {
      setReq("Please fill in the required information");
      return;
    }
    setReq('');
    setLoading(true);
    try {
      const responsePpt = await axios.post('http://localhost:4000/ppt', {
        clientName: clientName,
        serviceName: serviceName,
        clientDesc: clientDesc
        },
        {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // console.log(responsePpt);
      setPptLink(responsePpt.data.Response.access_link);

      const responseVideo = await axios.post('http://localhost:4000/video', {
        clientName: clientName,
        serviceName: serviceName,
        clientDesc: clientDesc
        },
        {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // console.log(responseVideo);
      setVideoLink(responseVideo.data.Response.video_url);
      setLoading(false);
    } catch (error) {
      setPptLink('');
      setVideoLink('');
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="heading-div">
        <Typography
          variant="h3"
          id="heading-text"
        >
          Sales Automation
        </Typography>
      </div>
      <hr />
      <div>
        <sTextField
          required
          id="outlined-basic"
          label="Company Name"
          variant="outlined"
          value={clientName}
          onChange={(event) => {
            setClientName(event.target.value);
          }}
          style = {{width: 500, marginTop: 10}}/>
      </div>
      <div>
        <TextField
          required
          id="outlined-basic"
          label="Company Description"
          variant="outlined"
          multiline
          value={clientDesc}
          onChange={(event) =>  {
            setClientDesc(event.target.value);
          }}
          style = {{width: 500, marginTop: 10}}
        />
      </div>
      <div>
      <FormControl style={{ width: 500, marginTop: 10}}>
        <InputLabel required id="demo-multiple-checkbox-label">Services</InputLabel>
        <Select
          multiple
          value={serviceName}
          onChange={handleServiceChange}
          input={<OutlinedInput label="Services" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {services.map((service) => (
            <MenuItem key={service} value={service}>
              <Checkbox checked={serviceName.indexOf(service) > -1} />
              <ListItemText primary={service} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      <div>
      <TextField
          id="outlined-basic"
          label="Problem Statement (Optional)"
          variant="outlined"
          multiline
          value={ Statement}
          onChange={(event) => {
            setProblemStatement(event.target.value);
          }}
          style = {{width: 500, marginTop: 10}}
        />
      </div>

      <div className="generate-btn-div">
        <Button
          variant="contained"
          id="generate-btn"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </div>
      <div>
        {req !== '' && 
          <Typography variant="h6" sx={{ marginTop: "10px" }}>
            {req}
          </Typography>
        }
      </div>
      <div>
      {pptLink !== '' ? 
      <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Download the PowerPoint from <Link href={pptLink} target="_blank" rel="noopener noreferrer" sx={{ color: 'blue' }}>this</Link> link!
      </Typography> : null}
      </div>
      <div>
      {videoLink !== '' ? 
      <Typography variant="h6" sx={{ marginTop: "10px", marginBottom: "20px" }}>
          Download the AI-generated video from <Link href={videoLink} target="_blank" rel="noopener noreferrer" sx={{ color: 'blue' }}>this</Link> link!
      </Typography> : null}
      </div>
    </div>
  );
}

export default App;