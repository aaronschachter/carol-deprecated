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
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
  },
  render: function() {
    var createdAt = this.timeConverter(this.props.reportbackItem.created_at);
    return (
      <ul className="list-group">
        <li className="list-group-item">
          ID: {this.props.reportbackItem.id}
        </li>
        <li className="list-group-item">
           {createdAt}
        </li>
        <li className="list-group-item">
          <p className="item-status">
            {this.props.reportbackItem.status.toUpperCase()}
          </p>
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
      reportbackItem: null,
      loaded: false,
    };
  },
  setReportbackItem: function(reportbackItem) {
    this.setState({
      reportbackItem: reportbackItem,
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
    return (
      <div>
        <div className="page-header">
          <h1 className="pull-right">{this.state.reportback.quantity} <small>{suffix}</small></h1>
          <h2>{this.state.reportback.user.first_name} <small>{this.state.reportback.campaign.title}</small></h2>
          <h5>{this.state.reportback.user.country.toUpperCase()}</h5>
        </div>
        <div className="row">
          <div className="col-md-8">
            <Carousel
              key={this.state.reportback.id}
              data={this.state.reportback.reportback_items.data}
              setReportbackItem={this.setReportbackItem}
            />
          </div>
          <div className="col-md-4">
            <ReportbackItemSummary
              reportbackItem={this.state.reportback.reportback_items.data[0]} 
            />
          </div>
        </div>
      </div>
    );
  }
});

var Carousel = React.createClass({
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
        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
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
