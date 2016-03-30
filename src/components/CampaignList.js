var React = require('react');
var ReactDOM = require('react-dom');


var CampaignView = React.createClass({
  render: function() {
    return (
      <div className="campaignView">
        <h2 className="campaignTitle">
          <a href={this.props.url}>{this.props.title}</a>
        </h2>
        <ul>
          <li>{this.props.tagline}</li>
        </ul>
      </div>
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
      <div>
        <CampaignList data={this.state.data} />
      </div>
    );
  }
});

var CampaignList = React.createClass({
  render: function() {
    var campaigns = this.props.data.map(function(campaign) {
      var campaign_url = '/campaign/' + campaign.id;
      return (
        <CampaignView 
          title={campaign.title}
          tagline={campaign.tagline}
          url = {campaign_url}
          key={campaign.id}
        />
      );
    });
    return (
      <div>
        {campaigns}
      </div>
    );
  }
});

ReactDOM.render(
  <CampaignListView />,
  document.getElementById('content')
);
