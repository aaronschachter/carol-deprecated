var React = require('react');
var ReactDOM = require('react-dom');

var ReviewerForm = React.createClass({
  render: function() {
    var user = this.props.reportbackItem.user;
    var reportbackInfo = this.props.reportbackItem.campaign.reportback_info;
    var quantityLabel = reportbackInfo.noun + ' ' + reportbackInfo.verb;
    var url = 'https://www.dosomething.org/reportback/' + this.props.reportbackItem.reportback.id + '?fid=' + this.props.reportbackItem.id;

    if (!user.photo) {
      user.photo = 'https://raw.githubusercontent.com/DoSomething/LetsDoThis-iOS/develop/Lets%20Do%20This/Images.xcassets/Avatar.imageset/Avatar.png';
    }
    if (!user.first_name) {
      user.first_name = 'Doer';
    }

    return (
      <div className="row">
        <div className="col-md-1 text-center">
          <figure>
            <a href={url}><img className="avatar img-circle" src={user.photo}/></a>
            <figcaption>
              <small>{user.first_name.toUpperCase()}</small>
            </figcaption>
          </figure>
        </div>
        <div className="col-md-5">
          <div className="panel panel-default">
            <div className="panel-body">
              <a href={url}>
                <img className="img-responsive" src={this.props.reportbackItem.media.uri} />
              </a>
            </div>
            <div className="panel-footer">
              {this.props.reportbackItem.caption}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="quantity text-center">
            <h3>
            {this.props.reportbackItem.reportback.quantity}
            </h3>
            <small>{quantityLabel}</small>
          </div>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary btn-lg btn-block" type="submit">Approve</button>
          <button className="btn btn-default btn-lg btn-block" type="submit">Promote</button>
          <button className="btn btn-default btn-lg btn-block" type="submit">Exclude</button>
          <button className="btn btn-default btn-lg btn-block" type="submit">Flag</button>
        </div>
      </div>
    );
  }
});

var Inbox = React.createClass({
  fetchData: function(campaignId) {
    fetch('https://www.dosomething.org/api/v1/reportback-items?load_user=true&campaigns=' + campaignId)
      .then((res) => {
        this.state.inboxLoaded = true;
        return res.json();
      })
      .then((json) => {
        if (json.data.length > 0) {
          this.state.campaign = json.data[0].campaign;
          this.state.reportbackItem = json.data[0];
        }
        this.setState({
          inbox: json.data,
          inboxLoaded: this.state.inboxLoaded,
          campaign: this.state.campaign,
          reportbackItem: this.state.reportbackItem,
        });
        console.log(this.state);
      })
  },
  getInitialState: function() {
    return {
      inbox: [],
      inboxLoaded: false,
      campaign: {
        title: null,
        tagline: null,
      },
      reportbackItem: null,
    };
  },
  componentDidMount: function() {
    this.fetchData(this.props.campaignId);
  },
  render: function() {
    if (!this.state.inboxLoaded) {
      return this.renderLoadingView('Loading...');
    }
    if (this.state.inbox.length == 0) {
      return this.renderLoadingView('Inbox zero.');
    }
    var reportbackItem = this.state.inbox[0];
    return (
      <div>
        <div className="page-header">
          <h1>{this.state.campaign.title}</h1>
          <p>{this.state.campaign.tagline}</p>
        </div>
        <ReviewerForm 
          reportbackItem={reportbackItem}
          key={reportbackItem.id}
        />
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
  <Inbox campaignId={pathArray[2]} />,
  document.getElementById('content')
);
