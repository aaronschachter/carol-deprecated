var React = require('react');
var ReactDOM = require('react-dom');


var InboxListItem = React.createClass({
  render: function() {
    var reportbackInfo = this.props.reportbackItem.campaign.reportback_info;
    var quantityLabel = reportbackInfo.noun + ' ' + reportbackInfo.verb;
    var url = 'https://www.dosomething.org/reportback/' + this.props.reportbackItem.reportback.id + '?fid=' + this.props.reportbackItem.id;
    return (
      <div className="inbox-list-item">
        <a href={url}><img src={this.props.reportbackItem.media.uri}/></a>
        <p className="caption">
          {this.props.reportbackItem.caption}
        </p>
        <p className="quantity">
          {this.props.reportbackItem.reportback.quantity} {quantityLabel}
        </p>
        <hr />
      </div>
    );
  }
});

var InboxListView = React.createClass({
  fetchData: function(campaignId) {
    fetch('https://www.dosomething.org/api/v1/reportback-items?campaigns=' + campaignId)
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
    // Hack for now. pathArray[2] is our campaign ID.
    var pathArray = window.location.pathname.split('/');
    console.log('id = ' + pathArray[2]);
    this.fetchData(pathArray[2]);
  },
  render: function() {
    return (
      <div>
        <InboxList data={this.state.data} />
      </div>
    );
  }
});

var InboxList = React.createClass({
  render: function() {
    var reportbackItems = this.props.data.map(function(reportbackItem) {
      return (
        <InboxListItem 
          reportbackItem={reportbackItem}
          key={reportbackItem.id}
        />
      );
    });
    return (
      <div>
        {reportbackItems}
      </div>
    );
  }
});

ReactDOM.render(
  <InboxListView />,
  document.getElementById('content')
);
