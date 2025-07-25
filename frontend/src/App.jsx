import React, { useState } from 'react';
import { CircularProgress, Container, InputLabel, Typography } from '@mui/material';
import { Box, TextField } from '@mui/material';
import { FormControl, Select, MenuItem } from '@mui/material';
import { Button } from '@mui/material';
import axios from 'axios';


function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const requestBody = {
        emailContent: emailContent,
        tone: tone,
      };
      const response = await axios.post("http://localhost:8080/api/email/generate",
        requestBody
      );
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error){
      setError("Failed to generate email reply. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb:2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>

          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick = {handleSubmit}
          disabled={!emailContent || loading}
          fullWidth> 
        
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>
      {error && (
        <Typography color='error' sx={{ mb:2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
            inputProps={{
              readOnly: true,
              style: { whiteSpace: 'pre-wrap' }
            }}
          />
          <Button
            variant='outlined'
            sx={{ mt: 2}}
            onClick={() => {
              navigator.clipboard.writeText(generatedReply);
            }}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App;
