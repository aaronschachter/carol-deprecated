var React = require('react');
var ReactDOM = require('react-dom');
var ReactAddonsUpdate = require('react-addons-update');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var Modal = require('react-modal');
var appElement = document.getElementById('content');
const customStyles = {
  content : {
    top                   : '30%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: '300px',
    padding: 0,
  }
};

var Reportback = React.createClass({
  render: function() {
    var user = this.props.reportback.user;
    var reportbackItems = this.props.reportback.reportback_items.data;
    var reportbackInfo = this.props.reportback.campaign.reportback_info;
    var quantityLabel = reportbackInfo.noun + ' ' + reportbackInfo.verb;
    var date = new Date(this.props.reportback.updated_at).toLocaleString('en-US', { hour12: true });
    var url = '/reportback/' + this.props.reportback.id.toString();
    var profileUrl = '/user/' + user.id;
    if (!user.photo) {
      user.photo = 'https://raw.githubusercontent.com/DoSomething/LetsDoThis-iOS/develop/Lets%20Do%20This/Images.xcassets/Avatar.imageset/Avatar.png';
    }
    if (!user.first_name) {
      user.first_name = 'Doer';
    }

    return (
      <div className="row">
        <div className="col-md-2">
          <a href={profileUrl}>
            <figure className="text-center">
              <img className="avatar img-circle" src={user.photo}/>
              <figcaption>
                <small><strong>{user.first_name.toUpperCase()}</strong></small>
              </figcaption>
            </figure>
          </a>
        </div>
        <div className="col-md-7">
          <ReportbackItem 
            reportbackItem={reportbackItems[0]} 
            key={reportbackItems[0].id} 
          />
        </div>
        <div className="col-md-3">
          <ul className="list-group inbox-impact">
            <li className="list-group-item text-center">
              <h3>
                {this.props.reportback.quantity}
              </h3>
              <h4>
                {quantityLabel}
              </h4>
            </li>
            <li className="list-group-item text-center">
              <a href={url}>
              <small>
                1 / {reportbackItems.length} photos
              </small>
              </a>
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
  showModal: function() {
    this.props.openModal();
  },
  render: function() {
    return (
      <div>
        <button onClick={this.onClickHandler} className="btn btn-primary btn-lg btn-block" type="submit">Approve</button>
        <button onClick={this.showModal} className="btn btn-default btn-lg btn-block" type="submit">Promote</button>
        <button onClick={this.onClickHandler} className="btn btn-default btn-lg btn-block" type="submit">Exclude</button>
        <button onClick={this.showModal} className="btn btn-default btn-lg btn-block" type="submit">Flag</button>
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
      modalIsOpen: false,
    };
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },
  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  postReview: function() {
    this.setState({
      modalIsOpen: this.state.modalIsOpen,
      inbox : ReactAddonsUpdate(this.state.inbox, {$splice: [[0, 1]]})
    });
  },
  postReason: function() {
    this.state.modalIsOpen = false;
    this.postReview();
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
              openModal={this.openModal}
              closeModal={this.closeModal}
            />
          </div>
        </div>
        <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles} >
            <div className="panel panel-default reasons-form">
              <div className="panel-heading">
                <a href="#" className="pull-right" onClick={this.closeModal}><small>Cancel</small></a>
                <h3 className="panel-title">Promote</h3>
              </div>
              <div className="panel-body">
                <form>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" /> Good photo
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" /> Good quote
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" /> Good for sponsor
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" /> High impact
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-default btn-block"
                    onClick={this.postReason}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </Modal>
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
