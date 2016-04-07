var React = require('react');
var ReactDOM = require('react-dom');

var Profile = React.createClass({
  render: function() {
    console.log(localStorage['user_' + this.props.userId]);
    return (
      <div className="well">
        <h2>Hello world {this.props.userId}</h2>
      </div>
    );
  }
});

var pathArray = window.location.pathname.split('/');
ReactDOM.render(
  <Profile userId={pathArray[2]} />,
  document.getElementById('content')
);