import React, { useGlobal } from 'reactn';
import { Grid,Typography, ToggleButton, ToggleButtonGroup, Slider } from '@mui/material';

const Header = () => {
    const [summaryType, setSummaryType] = useGlobal('summaryType');
    const [summaryLength, setSummaryLength] = useGlobal('summaryLength');
    const marks = [
      {
        value: 30,
        label: 'short'
      },
      {
        value: 90,
        label: 'long'
      }
    ];
    return (
      <Grid container style={{position: 'sticky', top: 0, backgroundColor: '#555D50', zIndex: 1000, padding: '20px 15px 0 15px', borderRadius: '2px 2px 0 0', marginBottom: '10px'}}>
        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom component="div">
            Summarizer
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ToggleButtonGroup
            size='small'
            value={summaryType}
            color='success'
            exclusive
            onChange={(e) => setSummaryType(e.target.value)}           
            aria-label="summary length"
          >
            <ToggleButton value="key_sentences" aria-label="key sentences">
              Key Sentences
            </ToggleButton>
            <ToggleButton value="paragraph" aria-label="paragraph">
              Paragraph
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={4}>
          <Slider
            key={`slider-${summaryLength}`}
            size='small'
            aria-label="Restricted values"
            defaultValue={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
            min={marks[0].value}
            max={marks[1].value}
            step={null}
            valueLabelDisplay="off"
            marks={marks}
          />
        </Grid>
      </Grid>
    )
}

export default Header