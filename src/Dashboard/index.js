import React, {Component} from 'react';

class Dashboard extends Component {
  render () {
    return (
      <div>

      <h1>Prison staff hub</h1>
      <p>You will find access to all services and help from this page</p>


      <h3>Applications</h3>
      <ul>
        <li><a href="https://notm-dev.hmpps.dsd.io">New Nomis</a></li>
        <li><a href="">Old P-Nomis</a></li>
        <li><a href="https://licences-stage.hmpps.dsd.io">Licence Management</a></li>
        <li><a href="https://omic-dev.hmpps.dsd.io">Key worker Managementgdfgdfgdfgfdg</a></li>
        <li><a href="/whereabouts">Whereabouts</a></li>

      </ul>


      </div>
    );
  }
}

Dashboard.propTypes = {
};

export default Dashboard;
