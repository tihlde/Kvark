import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import URLS from '../../URLS';

// Service imports
import AuthService from '../../api/services/AuthService';

// Text imports
import Text from '../../text/LogInText';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

// Icons
import TIHLDE_LOGO from '../../assets/img/TIHLDE_LOGO_B.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
    root: {
        minHeight: '100vh',
        width: '100%',
    },
    top: {
        height: 160,
        backgroundColor: 'var(--tihlde-blaa)',
    },
    main: {
        maxWidth: 1000,
        margin: 'auto',
        position: 'relative',
    },
    paper: {
        width: '75%',
        maxWidth: 460,
        margin: 'auto',
        position: 'absolute',
        left: 0, right: 0,
        top: '-60px',
        padding: 28,
    },
    logo: {
        height: '32px',
        maxHeight: '32px !important',
        margin: 'auto',
        display: 'block',
        marginBottom: 10,
    },
    mt: {marginTop: 16},
    progress: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
    }
};

class LogIn extends Component {
    
    constructor() {
        super();
        this.state = {
            errorMessage: null,
            isLoading: false,
        }

        this.username = React.createRef();
        this.password = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleChange = (event) => {
        this.setState({errorMessage: null})
    }

    onLogIn = (event) => {
        event.preventDefault();

        if(this.state.isLoading) {
            return;
        }

        const username = this.username.value;
        const password = this.password.value;

        this.setState({errorMessage: null, isLoading: true});
        AuthService.logIn(username, password).then((data) => {
            if(data) {
                this.props.history.push(URLS.landing);
            } else {
                this.setState({errorMessage: Text.wrongCred, isLoading: false})
            }
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer>
                <div className={classes.root}>
                    <div className={classes.top}>
                
                    </div>
                    <div className={classes.main}>
                        <Paper className={classes.paper} square elevation={3}>
                            {this.state.isLoading && <LinearProgress className={classes.progress} />}
                            <img  className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
                            <Typography variant='title'>{Text.header}</Typography>
                            
                            <form onSubmit={this.onLogIn}>
                                <Grid container direction='column'>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.username = e}
                                        error={this.state.errorMessage !== null}
                                        label='Brukernavn'
                                        variant='outlined'
                                        margin='normal'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.password = e}
                                        helperText={this.state.errorMessage}
                                        error={this.state.errorMessage !== null}
                                        label='Password'
                                        variant='outlined'
                                        margin='normal'
                                        type='password'
                                        required/>
                                    <Button className={classes.mt}
                                        variant='contained'
                                        color='primary'
                                        disabled={this.state.isLoading}
                                        type='submit'>
                                    Logg inn
                                    </Button>
                                </Grid>
                            </form>
                        </Paper>
                    </div>
                    
                </div>
            </Navigation>
        );
    }
}

LogIn.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(LogIn);
