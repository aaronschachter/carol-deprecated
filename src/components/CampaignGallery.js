var React = require('react');
var ReactDOM = require('react-dom');

var ReportbackItem = React.createClass({
  render: function() {
    return (
      <li>
        <div className="panel panel-default">
          <div className="panel-body">
            <img className="img-responsive" src={this.props.reportbackItem.media.uri} />
          </div>
          <div className="panel-footer caption">
            {this.props.reportbackItem.caption.substring(0,60)}
          </div>
        </div>
      </li>
    );
  }
});


var Gallery = React.createClass({
  componentDidMount: function() {
    this.fetchData();
  },
  fetchData: function(campaignId) {
    var url = 'https://www.dosomething.org/api/v1/reportback-items.json?campaigns=' + this.props.campaignId  + '&load_user=true';
    fetch(url)
      .then((res) => {
        this.state.inboxLoaded = true;
        return res.json();
      })
      .then((json) => {
        if (json.data.length > 0) {
          this.state.campaign = json.data[0].campaign;
        }
        this.setState({
          gallery: json.data,
          galleryLoaded: this.state.inboxLoaded,
          campaign: this.state.campaign,
          reportbackItems: json.data,
        });
      })
  },
  getInitialState: function() {
    return {
      gallery: [],
      galleryLoaded: false,
      campaign: null,
    };
  },
  postReview: function() {
    this.setState({
      inbox : ReactAddonsUpdate(this.state.inbox, {$splice: [[0, 1]]})
    });
  },
  render: function() {
    if (!this.state.galleryLoaded) {
      return this.renderLoadingView('Loading...');
    }
    if (this.state.gallery.length == 0) {
      return this.renderLoadingView('No photos in gallery.');
    }
    var reportbackItems = this.state.gallery.map(function(reportbackItem) {
      return (
        <div className="col-md-3">
          <ReportbackItem 
            reportbackItem={reportbackItem} 
            key={reportbackItem.id} 
          />
        </div>
      );
    });
    var inboxUrl = '/campaign/' + this.props.campaignId.toString();
    return (
      <div>
        <div className="page-header">
          <ul className="nav nav-pills pull-right">
            <li role="presentation">
              <a href={inboxUrl}>Inbox</a>
            </li>
            <li role="presentation" className="active">
              <a href="#">Gallery</a>
            </li>
          </ul>
          <h2>{this.state.campaign.title}</h2>
          <p>{this.state.campaign.tagline}</p>
        </div>
        <ul className="list-inline">
          {reportbackItems}
        </ul>
      </div>
    );
  },
  renderLoadingView: function(message) {
    return (
      <div>
        <h4>{message}</h4>
      </div>
    );
  },
});

// Hack for now. pathArray[2] is our campaign ID.
var pathArray = window.location.pathname.split('/');
ReactDOM.render(
  <Gallery campaignId={pathArray[2]} />,
  document.getElementById('content')
);
