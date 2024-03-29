var React = require('react');
var ReactDOM = require('react-dom');

var ReportbackItem = React.createClass({
  render: function() {
    var itemClassName = 'item';
    if (this.props.itemIndex == 0) {
      itemClassName = itemClassName + ' active';
    }
    return (
      <div className={itemClassName}>
        <img 
          src={this.props.reportbackItem.media.uri}
          className="center-block"
        />
        <div className="carousel-caption">
          {this.props.reportbackItem.caption}
        </div>
      </div>
    );
  }
});

var ReportbackItemSummary = React.createClass({
  timeConverter: function(timestamp){
    var a = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
    var time = month + ' ' + day + ', ' + year + ' ' + hour + ':' + min;
    return time;
  },
  render: function() {
    var currentIndex = this.props.reportbackItemIndex + 1;
    var createdAt = this.timeConverter(this.props.reportbackItem.created_at);
    var url = 'https://www.dosomething.org/reportback/' + this.props.reportback.id + '?fid=' + this.props.reportbackItem.id;
    return (
      <ul className="list-group">
        <li className="list-group-item">
          <a href={url} target="_blank">{this.props.reportbackItem.id}</a>
        </li>
        <li className="list-group-item">
           Submitted {createdAt}
           <span className="pull-right"><small>{currentIndex} / {this.props.reportback.reportback_items.data.length} photos</small></span>
        </li>
        <li className="list-group-item">
          <strong>
            {this.props.reportbackItem.status.toUpperCase()}
          </strong>
          <a href="#" className="pull-right"><small>Edit</small></a>
        </li>
      </ul>
    );
  }
});

var Reportback = React.createClass({
  fetchData: function() {
    var url = 'https://www.dosomething.org/api/v1/reportbacks/' + this.props.reportbackId;
    fetch(url)
      .then((res) => {
          return res.json();
      }).then((json) => {
        this.setState({
          reportback: json.data,
          loaded: true,
        });
      })
  },
  getInitialState: function() {
    // @todo Check for item id to set selectedItemIndex.
    return {
      reportback: [],
      selectedItemIndex: 0,
      loaded: false,
    };
  },
  bumpIndex: function(increment) {
    var newIndex = this.state.selectedItemIndex + increment;
    var totalItems = this.state.reportback.reportback_items.data.length;
    if (newIndex == totalItems) {
      newIndex = 0;
    }
    else if (newIndex < 0) {
      newIndex = totalItems - 1;
    }
    this.setState({
      selectedItemIndex: newIndex,
    });
  },
  componentDidMount: function() {
    this.fetchData();
  },
  render: function() {
    if (!this.state.loaded) {
      return (<div>Loading</div>);
    }
    var suffix = this.state.reportback.campaign.reportback_info.noun + ' ' + this.state.reportback.campaign.reportback_info.verb;
    var reportbackItem = this.state.reportback.reportback_items.data[this.state.selectedItemIndex];
    var campaignTitle = this.state.reportback.campaign.title;
    var campaignLink = '/gallery/' + this.state.reportback.campaign.id.toString();
    var countryName = null, 
      userName = 'Doer',
      user = this.state.reportback.user,
      userAvatar = 'https://raw.githubusercontent.com/DoSomething/LetsDoThis-iOS/develop/Lets%20Do%20This/Images.xcassets/Avatar.imageset/Avatar.png';
    var profileUrl = '/user/' + user.id;

    if (user.first_name) {
      userName = user.first_name;
    }
    if (user.country) {
      countryName = user.country.toUpperCase();
    }
    if (!user.photo) {
      user.photo = userAvatar;
    }
    localStorage['user_'+user.id] = JSON.stringify(user);
    return (
      <div>
        <div className="page-header profile clearfix">
          <img className="avatar img-circle pull-left" src={userAvatar} />      
          <h1 className="pull-right">{this.state.reportback.quantity} <small>{suffix}</small></h1>
          <h2><a href={profileUrl}>{userName.toUpperCase()}</a> <small><a href={campaignLink}>{campaignTitle}</a></small></h2>
          <h5>{countryName}</h5>
        </div>
        <div className="row">
          <div className="col-md-8">
            <Carousel
              key={this.state.reportback.id}
              data={this.state.reportback.reportback_items.data}
              reportbackItem={reportbackItem}
              bumpIndex={this.bumpIndex}
            />
          </div>
          <div className="col-md-4">
            <ReportbackItemSummary
              reportback={this.state.reportback}
              reportbackItem={reportbackItem}
              reportbackItemIndex={this.state.selectedItemIndex}
            />
          </div>
        </div>
      </div>
    );
  }
});

var Carousel = React.createClass({
  handleClick: function(increment) {
    this.props.bumpIndex(increment);
  },
  render: function() {
    var items = this.props.data.map(function(reportbackItem, itemIndex) {
      return (
        <ReportbackItem 
          reportbackItem={reportbackItem}
          itemIndex={itemIndex}
          key={reportbackItem.id}
        />
      );
    });
    return (
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel" data-interval="false">
        <div className="carousel-inner" role="listbox">
          {items}
        </div>
        <a onClick={this.handleClick.bind(this, -1)} className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a onClick={this.handleClick.bind(this, 1)} className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
});

var pathArray = window.location.pathname.split('/');
ReactDOM.render(
  <Reportback reportbackId={pathArray[2]} />,
  document.getElementById('content')
);
