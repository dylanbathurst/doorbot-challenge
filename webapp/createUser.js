import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class CreateUser extends Component {
  constructor() {
    super();
    this.state = {
      username: 'default',
      requires_reset: false
    }
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handleUserCreate(event) {
    let username = this.state.username;
    let _self = this;
    console.log(event.target.name);

    event.preventDefault();

    $.ajax({
       type: 'POST',
       url: '/users',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       data: JSON.stringify({ username: username })
     })
     .done(function(data) {
       console.log(data)
       _self.setState({
         password: data.password,
         requires_reset: data.requires_reset
      })

      _self.emailNewUser();
      _self.props.updateParent(data);
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  handleUserPermit(event) {
    let username = this.state.username;
    let _self = this;
    console.log(event.target.name);

    event.preventDefault();

    $.ajax({
       type: 'POST',
       url: '/doors/' + this.state.selectedDoor + '/permit/' + this.state.username,
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
     })
     .done(function(data) {
       console.log(data)
     })
     .fail(function(jqXhr) {
       console.log('failed to auth', jqXhr);
     });
  }

  selectedDoorOption (event) {
    let selectedDoor = event.target.value;
    this.setState({selectedDoor});
  }

  emailNewUser() {
    let { email, username, password } = this.state;

    // use a service to send an email telling the user to log in and change
    // their password
  }

  render() {
    let doorOptions = this.props.doorList.map((door) => {
      return <option value={door.id} key={door.name}>{door.name}</option>
    })

    return (
      <div>
      <h1>Create a new User</h1>
      <form onSubmit={(event) => {event.preventDefault()}}>
        <input type="text" value={this.state.email} name="email" onChange={this.handleEmailChange.bind(this)} />
        <input type="text" value={this.state.username} name="username" onChange={this.handleUsernameChange.bind(this)} />
        <select onChange={this.selectedDoorOption.bind(this)}>
          {doorOptions}
        </select>
        <button onClick={this.handleUserCreate.bind(this)}>
          Submit
        </button>
        <button onClick={this.handleUserPermit.bind(this)}>
          Permit
        </button>
      </form>
      </div>
    );
  }
}

module.exports = CreateUser;
