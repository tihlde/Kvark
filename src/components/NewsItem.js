import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = {
    card: {
        height: '100%',
        maxHeight: 300,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
    },
    none: {
        minHeight: 200,
    },
    image: {
        minHeight: '80%',
        width: '100%',
        marginBottom: 50,
        objectFit: 'fill',
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 60,
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4 10',
    },
    text: {
        fontSize: '20px',
    }
}

class NewsItem extends Component {

    render() {
        const {classes, data} = this.props;

        let imageOrFallback = null;
        if (data.image) {
            imageOrFallback = <img className={classes.image} src={data.image} alt={data.imageAlt}/>;
        } else {
           imageOrFallback = <Typography className={classes.none} variant='title' align='center'>Missing Image</Typography>;
        }

        return (
            <Paper className={classes.card} square={true}>
                <Link to={'/nyheter/' + this.props.id}>
                {imageOrFallback}
                <div className={classes.textContainer}>
                    <p className={classes.text} variant='subheading' align='center' color='inherit'>{data.title}</p>
                </div>
                </Link>
            </Paper>
        );
    }
}

export default withStyles(styles)(NewsItem);
