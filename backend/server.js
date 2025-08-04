const express = require('express');
const cors = require('cors');
const axios = require('axios');
const port = 4000;

// main
const app = express();

// middlewares
app.use(express.json());
app.use(cors({ "origin": "*" }));
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});

// routes
app.use("/ppt", async (req, res) => {
  const { clientName, serviceName, clientDesc, problemStatement } = req.body;
  // console.log(clientName);
  // console.log(serviceName);
  var prompt = '';
  if (serviceName.length === 0) {
    prompt = `Create a presentation for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc} Based on the client's description, choose the best service from the following options: Microsoft 365 Copilot, AI Consulting, RPA, Data Management, Cloud Enablement, Cyber Security, SAP Services, and Enterprise IT. The pitch should present the chosen service provided by our firm, Airo Digital Labs, and explain how this service can benefit the client and why they should invest in it. ${problemStatement}`;
    description = `This presentation is targeted at showcasing our services to ${clientName}. 
                It explains the benefits and reasons to purchase our innovative solutions.`;
  }
  if (serviceName.length === 1) {
    prompt = `Create a presentation for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc}
        The pitch presents the service, ${serviceName[0]}, provided by our firm Airo Digital Labs and explains how this service,
        ${serviceName[0]}, can benefit them and why they should invest in it. ${problemStatement}`;
  } else {
    services = '';
    if (serviceName.length === 2) {
      services += serviceName[0] + ' and ' + serviceName[1];
    } else {
      services = serviceName.slice(0, -1).join(", ") + ", and " + serviceName[serviceName.length - 1];
    }
    prompt = `Create a presentation for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc} 
        Present the following services provided by our firm, Airo Digital Labs: ${services}. 
        Explain how each of our services, including ${services}, can benefit them and why they should invest in these services. ${problemStatement}`;
  }
  try {
    const response = await axios.post('https://gpt.slides.aidocmaker.com/create_pptx_indirectly_with_gpt', {
      language: 'en',
      openaiFileIdRefs: [],
      pageCount: 10,
      prompt: prompt
    }, { headers: { 'Content-Type': 'application/json' } });
    res.send({ "Response": response.data })
    // res.send({"PPT:" : prompt});
    //   res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error);
    res.status(500).json({ error: error });
  }
});

app.use("/video", async (req, res) => {
  const { clientName, serviceName, clientDesc, problemStatement } = req.body;
  // console.log(clientName);
  // console.log(serviceName); 
  var prompt = '';
  var description = '';
  if (serviceName.length === 0) {
    prompt = `Create a video for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc} Based on the client's description, choose the best service from the following options: Microsoft 365 Copilot, AI Consulting, RPA, Data Management, Cloud Enablement, Cyber Security, SAP Services, and Enterprise IT. The pitch should present the chosen service provided by our firm, Airo Digital Labs, and explain how this service can benefit the client and why they should invest in it. ${problemStatement}`;
    description = `This presentation is targeted at showcasing our services to ${clientName}. 
                It explains the benefits and reasons to purchase our innovative solutions.`;
  }
  if (serviceName.length === 1) {
    prompt = `Create a video for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc}
        The pitch presents the service, ${serviceName[0]}, provided by our firm Airo Digital Labs and explains how this service,
        ${serviceName[0]}, can benefit them and why they should invest in it. ${problemStatement}`;
    description = `This presentation is targeted at showcasing our service, ${serviceName[0]}, to ${clientName}. 
        It explains the benefits and reasons to purchase our innovative solutions.`;
  } else {
    services = '';
    if (serviceName.length === 2) {
      services += serviceName[0] + ' and ' + serviceName[1];
    } else {
      services = serviceName.slice(0, -1).join(", ") + ", and " + serviceName[serviceName.length - 1];
    }
    prompt = `Create a video for a sales pitch targeted towards ${clientName}. Here is the information about the client: ${clientDesc}
        Present the following services provided by our firm, Airo Digital Labs: ${services}.
        Explain how each of our services, including ${services}, can benefit them and why they should invest in these services. ${problemStatement}`;
    description = `This presentation is targeted at showcasing our services, including ${services}, to ${clientName}. 
        It explains the benefits and reasons to purchase our innovative solutions.`;
  }
  try {
    const response = await axios.post('https://video-ai.invideo.io/api/copilot/request/chatgpt-new-from-brief', {
      brief: prompt,
      settings: "Formal serious tone that is required for a sales pitch",
      title: `Sales Pitch targeted towards ${clientName}`,
      description: description,
      platforms: ["youtube", "presentations"],
      audiences: ["clients", "employers/employees"],
      length_in_minutes: 2,
      openaiFileIdRefs: []
    }, { headers: { 'Content-Type': 'application/json' } });
    res.send({ "Response": response.data })
    //   res.send({"Video:" : prompt});
    //   res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error);
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});