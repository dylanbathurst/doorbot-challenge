import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class CreateDoor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doorname: 'testDoor',
      doorToken: '',
      doorId: ''
    }

    console.log(this.props);
  }

  handleDoornameChange(event) {
    this.setState({doorname: event.target.value});
  }

  handleDoorCreate(event) {
    let doorname = this.state.doorname;
    let _self = this;

    event.preventDefault();

    $.ajax({
       type: 'POST',
       url: '/doors',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       data: JSON.stringify({ name: doorname })
     })
     .done(function(data) {
       console.log(data)
       _self.setState({
         doorToken: data.token,
         doorId: data.id
      })

      _self.props.updateParent(data);
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  render() {
    return (
      <div>
      <h1>Create a new Door</h1>
      <form onSubmit={this.handleDoorCreate.bind(this)}>
        <input type="text" value={this.state.doorname} name="doorname" onChange={this.handleDoornameChange.bind(this)} />
        <input type="submit" name="Submit"  />
      </form>
      </div>
    );
  }
}

module.exports = CreateDoor;
