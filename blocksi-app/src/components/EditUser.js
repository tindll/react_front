import React, { useState, Component } from "react";

export class EditUser extends Component {

  constructor(props) {
    super(props);
    this.state = { name: '', surname: '', email: '', phone: '', address: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event, field) { this.setState({ [field]: event.target.value }); }
  handleSubmit(event) {
    this.props.getList();
    alert('User added successfully');
    var url = "http://localhost:8080/api/auth/add_contact"
    var toSend = JSON.stringify(this.state);
    var token = document.cookie.split(";").find(function(value,index)
    {return value.includes("jwtAuth=")}).split("jwtAuth=")[1];


    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: (toSend)
      }
    )
      .then((response) => {
        if (response.status != 200) {
          alert("Failed to add user")
        }
        else {
          response.json().then((data) => {
            alert(data)
          })
        }
      })
    event.preventDefault();
  }

  render() {
    return (
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="adduser" onSubmit={this.handleSubmit}>
                <div class="form-group">
                  <label for="exampleInputName1">Enter contact name :</label>
                  <input value={this.state.name} onChange={(event) => this.handleChange(event, "name")} type="text" class="form-control" id="name" placeholder="(required)" />
                </div>
                <div class="form-group">
                  <label for="exampleInputSurname1">Enter contact surname : </label>
                  <input value={this.state.surname} onChange={(event) => this.handleChange(event, "surname")} type="text" class="form-control" id="surname" placeholder="(required)" />
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Enter contact email : </label>
                  <input value={this.state.email} onChange={(event) => this.handleChange(event, "email")} type="text" class="form-control" id="email" placeholder="(not required)" />
                </div>
                <div class="form-group">
                  <label for="exampleInputPhone1">Enter contact phone : </label>
                  <input value={this.state.phone} onChange={(event) => this.handleChange(event, "phone")} type="text" class="form-control" id="phone" placeholder="(not required)" />
                </div>
                <div class="form-group">
                  <label for="exampleInputAddress1">Enter contact address : </label>
                  <input value={this.state.address} onChange={(event) => this.handleChange(event, "address")} type="text" class="form-control" id="address" placeholder="(not required)" />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" value="Submit" form="adduser" class="btn btn-primary">Save User</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
