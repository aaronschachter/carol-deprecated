var React = require('react');
var ReactDOM = require('react-dom');


var InboxListItem = React.createClass({
  render: function() {
    var user = this.props.reportbackItem.user;
    if (!user.photo) {
      user.photo = 'http://placecorgi.com/200/200';
    }
    if (!user.first_name) {
      user.first_name = 'Doer';
    }
    var reportbackInfo = this.props.reportbackItem.campaign.reportback_info;
    var quantityLabel = reportbackInfo.noun + ' ' + reportbackInfo.verb;
    var url = 'https://www.dosomething.org/reportback/' + this.props.reportbackItem.reportback.id + '?fid=' + this.props.reportbackItem.id;
    return (
      <div className="row">
        <div className="col-md-1">
          <figure>
            <a href={url}><img className="img-responsive img-circle" src={user.photo}/></a>
            <figcaption>
              {user.first_name}
            </figcaption>
          </figure>
        </div>
        <div className="col-md-5">
          <figure>
            <a href={url}><img className="img-responsive" src={this.props.reportbackItem.media.uri}/></a>
            <figcaption>
              {this.props.reportbackItem.caption}
            </figcaption>
          </figure>
        </div>
        <div className="col-md-3">
          <div className="quantity text-center">
            <h3>
            {this.props.reportbackItem.reportback.quantity}
            </h3>
            {quantityLabel}
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

var InboxListView = React.createClass({
  fetchData: function(campaignId) {
    fetch('https://www.dosomething.org/api/v1/reportback-items?load_user=true&campaigns=' + campaignId)
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
