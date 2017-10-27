// Entry point for your app
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CreateDoor from './createDoor';
import CreateUser from './createUser';
import $ from 'jquery';

class AdminLogin extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username: 'admin',
      password: 'admin',
      requires_reset: false,
      adminLoggedIn: false,
      doorList: [],
      userList: []
    };
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleAdminAuth(e) {
    let _self = this;
    e.preventDefault();

    $.ajax({
       type: 'POST',
       url: '/auth',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       data: JSON.stringify({username: this.state.username, password: this.state.password})
     })
     .done(function(data) {
       console.log(data)
       let adminLoggedIn = false;
       if (!data.requires_reset) {
         adminLoggedIn = true;
       }

       _self.setState({ requires_reset: data.requires_reset, adminLoggedIn: adminLoggedIn })
       _self.getAllDoors();
       _self.getAllUsers();
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  handlePasswordReset(e) {
    let _self = this;
    e.preventDefault();

    $.ajax({
       type: 'PATCH',
       url: '/users/' + this.state.username,
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       data: JSON.stringify({username: this.state.username, password: this.state.password})
     })
     .done(function(data) {
       console.log(data)
       _self.setState({ requires_reset: data.requires_reset, adminLoggedIn: true })
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  getAllDoors() {
    let _self = this;

    $.ajax({
       type: 'GET',
       url: '/doors',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json'
     })
     .done(function(data) {
      console.log(data)
      data.forEach((door) => {
        _self.updateDoorList(door); // this should def not be a loop if I had more time.
      });
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  getAllUsers() {
    let _self = this;

    $.ajax({
       type: 'GET',
       url: '/users',
       contentType: 'application/json; charset=utf-8',
       dataType: 'json'
     })
     .done(function(data) {
      console.log(data)
      data.forEach((user) => {
        _self.updateUserList(user); // this should def not be a loop if I had more time.
      });
     })
     .fail(function(jqXhr) {
       console.log('failed to auth');
     });
  }

  updateDoorList(newDoor) {
    let doorList = [newDoor, ...this.state.doorList];
    this.setState({doorList});
  }
  updateUserList(newUser) {
    let userList = [newUser, ...this.state.userList];
    this.setState({userList});
  }

  render() {
    let requires_reset = this.state.requires_reset;
    let adminLoggedIn = this.state.adminLoggedIn;

    let doors = this.state.doorList.map((door) => {
      return (
        <li key={door.name}>
          <p>{door.name}, {door.id}</p>
        </li>
      )
    });

    let users = this.state.userList.map((user) => {
      return <li key={user.username}>{user.username}</li>
    });

    return (
      <div>
      { doors.length &&
        <ul>
          {doors}
        </ul>
      }

      { users.length &&
        <ul>
          {users}
        </ul>
      }

      { !requires_reset &&
        !adminLoggedIn &&
        <div>
        <h1>Admin Auth</h1>
        <form onSubmit={this.handleAdminAuth.bind(this)}>
          <input type="text" name="username" onChange={this.handleUsernameChange.bind(this)} />
          <input type="text" name="password" onChange={this.handlePasswordChange.bind(this)} />
          <input type="submit" name="Submit"  />
        </form>
        </div>
      }

      { requires_reset &&
        <div>
        <h1>Admin Password Reset</h1>
        <form onSubmit={this.handlePasswordReset.bind(this)}>
          <input type="text" name="username" onChange={this.handleUsernameChange.bind(this)} />
          <input type="text" name="password" onChange={this.handlePasswordChange.bind(this)} />
          <input type="submit" name="Submit"  />
        </form>
        </div>
      }

      { !requires_reset &&
        adminLoggedIn &&
        <div>
          <CreateDoor updateParent={this.updateDoorList.bind(this)} />
          <CreateUser doorList={this.state.doorList} updateParent={this.updateUserList.bind(this)} />
        </div>
      }
      </div>
    )
  }
}

window.onload = function() {
  // let adminAuth = new AdminLogin(document.getElementsByTagName('body')[0]);
  // adminAuth.render();
  var root = document.createElement('div');
  root.id = 'root';
  document.getElementsByTagName('body')[0].innerText = '';
  document.getElementsByTagName('body')[0].appendChild(root);
  ReactDOM.render(<AdminLogin />, document.getElementById('root'));
};
