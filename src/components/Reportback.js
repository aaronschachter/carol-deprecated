var React = require('react');
var ReactDOM = require('react-dom');


var ReportbackItem = React.createClass({
  render: function() {
    return (
      <div className="col-md-2">
        <img src={this.props.reportbackItem.media.uri} />
        <p>{this.props.reportbackItem.caption}</p>
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
          data: json.data,
          loaded: true,
        });
      })
  },
  getInitialState: function() {
    return {
      data: [],
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
        <Carousel data={this.state.data.reportback_items.data} />
      </div>
    );
  }
});

var Carousel = React.createClass({
  render: function() {
    var items = this.props.data.map(function(reportbackItem) {
      return (
        <ReportbackItem 
          reportbackItem={reportbackItem}
          key={reportbackItem.id}
        />
      );
    });
    return (
      <div className="row">
        {items}
      </div>
    );
  }
});


var pathArray = window.location.pathname.split('/');
ReactDOM.render(
  <Reportback reportbackId={pathArray[2]} />,
  document.getElementById('content')
);
