import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@material-ui/core';

const Title = styled('h1')(
    {
        marginLeft: '10px',
        color: 'rgba(86, 141, 229, 1)'
    }
)
const DESC = styled('div')(
    {
        marginLeft: '10px'
    }
)

const RBookDetails = ({props}) => {
    return (
        <Paper elevation={0} style={{ marginTop: '10px', width: '1015px' }} >
            <Title>{props.title}</Title>
            <DESC>
                {props.summary_content}
            </DESC>
        </Paper>
    )
}

export default RBookDetails;