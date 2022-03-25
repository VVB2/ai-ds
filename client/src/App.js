import React, { setGlobal, useGlobal } from 'reactn';
import { Container, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import InputText from './components/InputText';

setGlobal({
  inputData: '',
  summaryType: 'paragraph',
  summaryLength: 30
});

const App = () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container style={{marginTop:'30px'}}>
        <Paper variant='outlined' style={{marginBottom: '30px'}}>
          <Grid container >
            <Header />
            <InputText />
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
