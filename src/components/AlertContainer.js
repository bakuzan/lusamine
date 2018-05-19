import PropTypes from 'prop-types';
import React from 'react';

import { Alert } from 'meiko';

class AlertContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: []
    };
    this.timer = null;

    this.handleTriggeredAlert = this.handleTriggeredAlert.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleTriggeredAlert(alert) {
    this.setState({ alerts: [alert] }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.state.alerts.length) {
          this.setState({ alerts: [] });
        }
      }, 5000);
    });
  }

  handleDismiss(alertId) {
    this.setState(prev => ({
      alerts: prev.alerts.filter(x => x.id !== alertId)
    }));
  }

  render() {
    const actions = {
      dismissAlertMessage: this.handleDismiss
    };
    return (
      <React.Fragment>
        <Alert alerts={this.state.alerts} actions={actions} />
        {this.props.children(this.handleTriggeredAlert)}
      </React.Fragment>
    );
  }
}

AlertContainer.propTypes = {
  children: PropTypes.func.isRequired
};

export default AlertContainer;
