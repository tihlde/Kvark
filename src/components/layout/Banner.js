import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import { Grid, Typography } from '@material-ui/core';

// Icons

const styles = {
    root: {},
    imageContainer: {
        maxHeight: 250,
        position: 'relative',

        '@media only screen and (max-width: 600px)': {
            maxHeight: 100,
        },
    },
    image: {
        width: '100%',
        height: 'auto',
        minHeight: 250,
        maxHeight: 250,
        objectFit: 'cover',
        
        '@media only screen and (max-width: 600px)': {
            minHeight: 100,
            maxHeight: 100,
        },
    },
    filter: {
        filter: 'opacity(0.27) sepia(1)',
    },
    content: {
        backgroundColor: 'white',
        padding: 20,
    },
    info: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    title: {
        color: 'rgba(0,0,0,1)',

        fontSize: 54,
        '@media only screen and (max-width: 600px)': {
            fontSize: '2.1em',
        },
    },
    line: {
        height: 4,
        backgroundColor: 'var(--tihlde-blaa)',
        width: 50,
    },
};

const Banner = (props) => {
    const {classes} = props;
    return (
        <Paper className={classNames(classes.root, props.className)} elevation={1} square>
            <Grid container direction='column' wrap='nowrap'>
                <div className={classes.imageContainer}>
                    <img className={classNames(classes.image, !props.disableFilter ? classes.filter : '')} src={props.image} alt={props.alt} />
                    {props.title && <div className={classes.info}>
                        <Typography className={classes.title} variant='display3'><strong>{props.title}</strong></Typography>
                        <div className={classes.line}/>
                    </div>}
                </div>
                {(props.header || props.text) &&
                    <div className={classes.content}>
                        <Typography variant='title' gutterBottom><strong>{props.header}</strong></Typography>
                        <Typography variant='subheading'>{props.text}</Typography>
                    </div>
                }   
            </Grid>
        </Paper>
    );
};

Banner.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    header: PropTypes.string,
    classes: PropTypes.object,
    image: PropTypes.string,
    alt: PropTypes.string,
    text: PropTypes.string,
    disableFilter: PropTypes.bool,
};

export default withStyles(styles)(Banner);