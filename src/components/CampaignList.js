var React = require('react');
var ReactDOM = require('react-dom');


var CampaignView = React.createClass({
  handleClick: function(campaign) {
    window.location = '/campaign/' + campaign.id;
  },
  render: function() {
    return (
      <tr onClick={this.handleClick.bind(this, this.props.campaign)} >
        <td>
          <strong>{this.props.campaign.title}</strong>
        </td>
        <td>
          {this.props.campaign.tagline}
        </td>
      </tr>
    );
  }
});

var CampaignListView = React.createClass({
  fetchData: function() {
    fetch('https://www.dosomething.org/api/v1/campaigns?count=50')
      .then((res) => {
          return res.json();
      }).then((json) => {
        this.setState({
          data: json.data,
        });
      })
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.fetchData();
  },
  render: function() {
    return (
      <CampaignList data={this.state.data} />
    );
  }
});

var CampaignList = React.createClass({
  render: function() {
    var campaigns = this.props.data.map(function(campaign) {
      var campaign_url = '/campaign/' + campaign.id;
      return (
        <CampaignView 
          campaign={campaign}
          key={campaign.id}
        />
      );
    });
    return (
      <table className="table table-hover">
        <tbody>
        <tr>
          <th>Title</th>
          <th>Call to action</th>
        </tr>
        {campaigns}
        </tbody>
      </table>
    );
  }
});

ReactDOM.render(
  <CampaignListView />,
  document.getElementById('content')
);
