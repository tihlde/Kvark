import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Text Imports
import Text from '../../text/ContactText';

// Material UI Components
import Grid from '@material-ui/core/Grid';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';
import LinkButton from '../../components/navigation/LinkButton';

const styles = {
    root: {
        minHeight: '100vh',
    },
    grid: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '15px',
        marginBottom: 40,

        '@media only screen and (max-width: 700px)': {
            gridTemplateColumns: '1fr',
        },
    },
    topGrid: {
        gridTemplateColumns: '1fr',
    },
    socialgrid: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        paddingTop: 2,
        paddingBottom: 2,
        gridGap: '15px',
        '@media only screen and (max-width: 700px)': {
            gridTemplateColumns: '1fr',
        },
    },
    padding: {
        padding: 30,

        '@media only screen and (max-width: 700px)': {
            padding: 15,
        },
    },
    section: {
        padding: '15px 0px 0px',
        maxWidth: 1200,
        margin: 'auto',
        width: '100%',
        '@media only screen and (max-width: 1200px)': {
            padding: '5px 0',
        },
    },
    topSection: {
        padding: '20px 0 48px 0',
        margin: 0,
        '@media only screen and (max-width: 1200px)': {
            padding: '12px 0px 48px 0px',
        },
    },
    contactSection: {
        paddingTop: '0',
    },
    verticalMargin: {
        marginTop: 30,
        marginBottom: 30,
    },
    bottomSpacing: {
        marginBottom: 10,
    },
    miniPadding: {
        padding: 10,
    },
    miniMargin: {
        margin: 4,
    },
    bottomItem: {
        gridColumn: 'span 2',

        '@media only screen and (max-width: 700px)': {
            gridColumn: 'span 1',
        },
    },
    w100: {
        width: '100%',
    },
    smoke: {
        backgroundColor: '#Fefefe',
    },
    socialGridItem: {
        backgroundColor: 'rgba(0,0,0,0.12)',
        paddingTop: 1,
        paddingBottom: 1,
    },
    linkContainer: {
      marginBottom: 0,
      width: '100%',
      gridGap: 0,
    },
};

class ContactInfo extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer whitesmoke>
                <Grid className={classes.root} container direction='column' wrap='nowrap' alignItems='center'>
                    <div className={classNames(classes.section, classes.topSection)}>
                        <Banner
                            image='https://images.pexels.com/photos/220351/pexels-photo-220351.jpeg?auto=compress&cs=tinysrgb&h=350'
                            text={Text.subheader}
                            title={Text.header}>
                        </Banner>
                    </div>

                    <div className={classes.w100}>
                        <div className={classNames(classes.section, classes.contactSection)}>
                            <div>
                                <div className={classes.socialgrid}>
                                    <div className={classes.socialGridItem}>
                                        <LinkButton to="mailto:hs@tihlde.org">E-post</LinkButton>
                                    </div>
                                    <div className={classes.socialGridItem}>
                                        <LinkButton target="_blank" to="https://www.facebook.com/messages/t/tihlde">Messenger</LinkButton>
                                    </div>
                                    <div className={classes.socialGridItem}>
                                        <LinkButton target="_blank" to="https://tihlde.slack.com/">Slack</LinkButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={classes.w100}>
                        <div className={classes.section}>
                            <div className={classes.grid}>
                                <InfoCard header='Besøksadresse' text={Text.visit} />
                                <InfoCard header='Faktureringsadresse' text={Text.invoice} />
                            </div>
                        </div>
                    </div>

                </Grid>
            </Navigation>
        );
    }

};

ContactInfo.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ContactInfo);
