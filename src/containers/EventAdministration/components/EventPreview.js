import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Modal from '@material-ui/core/Modal';

// Project Components
import EventRenderer from '../../EventDetails/components/EventRenderer';

const styles = {
  root: {
    maxWidth: 1200,
    margin: 'auto',
    paddingTop: 80,
    paddingBottom: 100,
    backgroundColor: '#f8f8fa',
  },
  overflow: {
    overflowY: 'auto',
  },
};

class EventPreview extends Component {
  render() {
    const {classes} = this.props;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} disableAutoFocus classes={{root: classes.overflow}}>
        <div className={classes.root}>
          <EventRenderer eventData={this.props.data} preview={true}/>
        </div>
      </Modal>
    );
  }
}

EventPreview.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
};

export default withStyles(styles)(EventPreview);
