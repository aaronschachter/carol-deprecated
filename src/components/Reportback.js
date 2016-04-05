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
    return {
      reportback: [],
      loaded: false,
    };
  },
  componentDidMount: function() {
    this.fetchData();
  },
  render: function() {
    if (!this.state.loaded) {
      return (<div>Loading</div>);
    }
    return (
      <div>
        <div className="page-header">
          <h2>{this.state.reportback.user.first_name} <small>{this.state.reportback.campaign.title}</small></h2>
          <h5>{this.state.reportback.user.country.toUpperCase()}</h5>
        </div>
        
        <Carousel data={this.state.reportback.reportback_items.data} />
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
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
          <li data-target="#carousel-example-generic" data-slide-to="1"></li>
          <li data-target="#carousel-example-generic" data-slide-to="2"></li>
        </ol>
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
