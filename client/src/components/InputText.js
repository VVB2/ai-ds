/* eslint-disable no-undef */
import React, { useGlobal, useState, useEffect } from 'reactn';
import { Grid, TextField, Skeleton, Typography, Chip, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

const InputText = () => {
    const [inputData, setInputData] = useGlobal('inputData');
    const { 0: summaryType } = useGlobal('summaryType');
    const { 0: summaryLength } = useGlobal('summaryLength');
    const [outputData, setOutputData] = useState({data: '', type: ''});
    var key_sentences = outputData.data ? outputData.data : [];
    console.log(key_sentences);
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    function calWords(inputData) {
        return `${inputData.match(/(\w+)/g).length > 1 ? `${inputData.match(/(\w+)/g).length} words` : `${inputData.match(/(\w+)/g).length} word`}`
    }
    function summarizeInput() {
        setLoading(true);
        if(inputData) {
            if(summaryType == 'paragraph') {
                let text = inputData + " ";
                const count = text.split(" ").length - 1;
                const max_length = Math.floor(summaryLength * count / 100);
                const data = {article: inputData, max_length}
                axios.post(`${process.env.REACT_APP_SERVER_URL}/paragraph`, data)
                    .then(response => setOutputData({data:response.data, type:'paragraph'}));
                setLoading(false);
            } 
            else {
                let text = inputData + " ";
                const count = text.split(". ").length - 1;
                const min_sentences = Math.floor(summaryLength * count / 100);
                const data = {article: inputData, min_sentences};
                axios.post(`${process.env.REACT_APP_SERVER_URL}/key_sentences`, data)
                    .then(response => setOutputData({data:response.data.split("."), type:'key_sentences'}));
                setLoading(false);
            }
        } 
    }
    const fetchKeyWords = () => {
      axios.post(`${process.env.REACT_APP_SERVER_URL}/key_words`, {article: inputData, min_words: 5})
          .then(response => setKeywords(response.data.split(",")));
    }
    useEffect(() => {
      fetchKeyWords();
    }, [inputData])

    useEffect(() => {
        setOutputData({data: '', type: ''});
      }, [summaryLength, summaryType])

    return (
        <>
            <Grid item xs={6} style={{padding:'0 0 20px 20px'}}>
                <TextField fullWidth id="fullWidth" margin='none' minRows={25} multiline 
                    placeholder='Enter your text to summarize' style={{outline:'none', border:'none'}} 
                    variant="standard" 
                    InputProps={{ disableUnderline: true, }}
                    onChange={(e) => {
                        setInputData(e.target.value) ;
                        setOutputData({data: '', type: ''})
                    }} />
                
                { keywords.length > 1 && <Divider style={{marginBottom: '10px'}}>
                    <Chip label="Key Words" color="primary" />
                </Divider> }
                { keywords.length > 1 && keywords.map((item, i) => <Chip label={item} key={i} style={{margin: '0 10px 10px 0'}} color="primary" variant="outlined"/>) }
                <br/>
                { inputData && <Chip label={calWords(inputData)} color="success" variant="outlined" size="medium"/> }
                <LoadingButton variant="contained" color='success' size='medium' style={{float:'right'}} onClick={summarizeInput} loading={loading}>Summarize</LoadingButton>
            </Grid>
            <Divider orientation="vertical" flexItem>
                <Chip label="Output" />
            </Divider>
            <Grid item xs={5} style={{marginLeft: '-20px'}}>
                {!outputData.data && <>
                    <Skeleton animation={false} width='80%' height='20px'/>
                    <Skeleton animation={false} width='60%' height='20px'/>
                    <Skeleton animation={false} width='40%' height='20px'/>
                </> }
                {outputData.type=='paragraph' && <div style={{height: '76%'}}>{outputData.data}</div>}
                {outputData.type=='key_sentences' && <ul style={{marginTop: 0}}>{ key_sentences.map((item, i) => (item !== ' ' && <li key={i}>{item}</li>))}</ul>}
                {outputData.data && <>
                    <Divider style={{marginBottom: '10px'}}>
                        <Chip label="Output Info" color="primary" />
                    </Divider>
                    { outputData.type === 'paragraph' ? <Chip label={`${calWords(outputData.data)} and ${outputData.data.split(".").length - 1} sentences`} color="primary" variant="outlined" size="medium"/> : <Chip label={`${key_sentences.filter(element => {return element !== " "}).length} sentences`} color="primary" variant="outlined" size="medium"/>}
                </>}
            </Grid>
        </>
    )
}

export default InputText