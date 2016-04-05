var React = require('react');
var ReactDOM = require('react-dom');
var ReactAddonsUpdate = require('react-addons-update');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var Reportback = React.createClass({
  render: function() {
    var user = this.props.reportback.user;
    var reportbackItems = this.props.reportback.reportback_items.data.map(function(reportbackItem) {
      return (
        <ReportbackItem 
          reportbackItem={reportbackItem} 
          key={reportbackItem.id} 
        />
      );
    });
    var reportbackInfo = this.props.reportback.campaign.reportback_info;
    var quantityLabel = reportbackInfo.noun + ' ' + reportbackInfo.verb;
    var date = new Date(this.props.reportback.updated_at).toLocaleString('en-US', { hour12: true });

    if (!user.photo) {
      user.photo = 'https://raw.githubusercontent.com/DoSomething/LetsDoThis-iOS/develop/Lets%20Do%20This/Images.xcassets/Avatar.imageset/Avatar.png';
    }
    if (!user.first_name) {
      user.first_name = 'Doer';
    }

    return (
      <div className="row">
        <div className="col-md-2">
          <figure className="text-center">
            <img className="avatar img-circle" src={user.photo}/>
            <figcaption>
              <small><strong>{user.first_name.toUpperCase()}</strong></small>
            </figcaption>
          </figure>
        </div>
        <div className="col-md-7">
          {reportbackItems}
        </div>
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item text-center">
              <h3>
                {this.props.reportback.quantity}
              </h3>
              <h4>
                {quantityLabel}
              </h4>
            </li>
            <li className="list-group-item text-center">
              <small>
                1 / {reportbackItems.length} photos
              </small>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

var ReportbackItem = React.createClass({
  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <img className="img-responsive" src={this.props.reportbackItem.media.uri} />
        </div>
        <div className="panel-footer">
          {this.props.reportbackItem.caption}
        </div>
      </div>
    );
  }
});

var Controls = React.createClass({
  onClickHandler: function() {
    this.props.postReview();
  },
  render: function() {
    return (
      <div>
        <button onClick={this.onClickHandler} className="btn btn-primary btn-lg btn-block" type="submit">Approve</button>
        <button onClick={this.onClickHandler} className="btn btn-default btn-lg btn-block" type="submit">Promote</button>
        <button onClick={this.onClickHandler} className="btn btn-default btn-lg btn-block" type="submit">Exclude</button>
        <button onClick={this.onClickHandler} className="btn btn-default btn-lg btn-block" type="submit">Flag</button>
      </div>
    );
  },
});

var Inbox = React.createClass({
  componentDidMount: function() {
    this.fetchData();
  },
  fetchData: function(campaignId) {
    var url = 'https://www.dosomething.org/api/v1/reportbacks.json?campaigns=' + this.props.campaignId  + '&load_user=true'
    fetch(url)
      .then((res) => {
        this.state.inboxLoaded = true;
        return res.json();
      })
      .then((json) => {
        if (json.data.length > 0) {
          this.state.campaign = json.data[0].campaign;
          this.state.reportback = json.data[0];
        }
        this.setState({
          inbox: json.data,
          inboxLoaded: this.state.inboxLoaded,
          campaign: this.state.campaign,
          reportback: this.state.reportback,
        });
      })
  },
  getInitialState: function() {
    return {
      inbox: [],
      inboxLoaded: false,
      campaign: null,
      reportbackItem: null,
    };
  },
  postReview: function() {
    this.setState({
      inbox : ReactAddonsUpdate(this.state.inbox, {$splice: [[0, 1]]})
    });
  },
  render: function() {
    if (!this.state.inboxLoaded) {
      return this.renderLoadingView('Loading...');
    }
    if (this.state.inbox.length == 0) {
      return this.renderLoadingView('Empty inbox.');
    }
    var reportback = this.state.inbox[0];
    var count = this.state.inbox.length;
    var galleryUrl = '/gallery/' + this.props.campaignId.toString();
    return (
      <div>
        <div className="page-header">
          <h2>{this.state.campaign.title}</h2>
          <h5>{this.state.campaign.tagline}</h5>
          <ul className="nav nav-tabs">
            <li role="presentation" className="active">
              <a>Inbox</a>
            </li>
            <li role="presentation">
              <a href={galleryUrl}>Gallery</a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-9">
            <CSSTransitionGroup
              transitionName="entry"
              component="div"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
              >
              <Reportback
                key={reportback.id}
                reportback={reportback}
              />
            </CSSTransitionGroup>
          </div>
          <div className="col-md-3">
            <Controls 
              postReview={this.postReview}
            />
          </div>
        </div>
      </div>
    );
  },
  renderLoadingView: function(message) {
    return (
      <div className="well">
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
