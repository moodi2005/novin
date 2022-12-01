// Import Opine
import { opine } from 'https://deno.land/x/opine@2.3.3/mod.ts';

// Import Middleware
import multipartFormParser from "https://raw.githubusercontent.com/tylerlaceby/multipart/main/opine/mod.ts";

// Define Opine App
const app = opine();

// Define main route with a simple form containg upload input and submit button with action that submit to '/upload' route
app.use('/', (req, res) => {
  res.send(`
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" value="Upload" /> 
      </form>`);
});

// Define upload route to handle upload submit.
app.use('/upload',  multipartFormParser({files: true}),  (req, res) => {
  console.log(req.body)
  res.json(req.parsedBody);
});

// Start server
app.listen(8000);