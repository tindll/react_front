import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginM from './components/LoginModal'
import Navbar from './components/Navbar';
import { experimentalStyled as styled } from '@mui/material/styles';
import { HiPencilAlt } from 'react-icons/hi'
import { ImBin } from 'react-icons/im'
import { CgProfile } from 'react-icons/cg'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AddUser from './AddUser';
import { Modal } from 'bootstrap';
import './components/navbar.css';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function openEdit() {
  var edituser = document.getElementById('editUser');
  var e = Modal.getOrCreateInstance(edituser);
  e.show();
}


async function openUserInfo(id) {
  //I dont need to do it this way, doing it like this to make use of GET /contacts/:id
  //
  //
  var url = "https://floating-springs-71363.herokuapp.com/api/auth/contacts/" + id
  var token = document.cookie.split(";").find(function (value, index) { return value.includes("jwtAuth=") }).split("jwtAuth=")[1];
  var value = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token
    }
  }).then(response => response.json())

  value = (value[0].contacts[0])
  var modal = document.getElementById("displayModal");
  var ui = Modal.getOrCreateInstance(modal);
  document.getElementById("displayModalTitle").textContent = value.name + " " + value.surname;
  document.getElementById("nameDisplay").textContent = value.name;
  document.getElementById("surnameDisplay").textContent = value.surname;
  document.getElementById("emailDisplay").textContent = value.email;
  document.getElementById("phoneDisplay").textContent = value.phone;
  document.getElementById("addressDisplay").textContent = value.address;
  ui.show();
}


export function success(message) {
  var success = document.getElementById('showconfirmation');
  document.getElementById("messageToshow").textContent = message
  var ui = Modal.getOrCreateInstance(success);
  ui.show();
}


export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      update: 0,
      open: false,
      name: '', surname: '', email: '', phone: '', address: '',
      isAuthenticated: false,
      idChange: ''
    }
    this.GetContactList = this.GetContactList.bind(this);
    this.authChange = this.authChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    if(document.cookie.match(/^(.*;)?\s*jwtAuth\s*=\s*[^;]+(.*)?$/)) var token = document.cookie.split(";").find(function (value, index) { if(value!=null) return value.includes("jwtAuth=") }).split("jwtAuth=")[1];
    if (token) {
      var url = "https://floating-springs-71363.herokuapp.com/api/auth/verifyToken/" + token
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      })
        .then((response) => {
          if (response.status != 200) {
            this.setState({ isAuthenticated: false });
          }
          else {
            this.setState({ isAuthenticated: true });
            this.GetContactList()
          }
        })
       
    }
  }

  handleChange(event, field) { this.setState({ [field]: event.target.value }); }
  deleteUser(id) {
    var url = "https://floating-springs-71363.herokuapp.com/api/auth/contacts/" + id
    var token = document.cookie.split(";").find(function (value, index) { return value.includes("jwtAuth=") }).split("jwtAuth=")[1];
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
      .then((response) => {
        if (response.status != 200) {
          success("Failed to delete user.")
        }
        else {
          success("Deleted user successfully.")
          this.GetContactList()
        }
      })
  }
  editUser(event) {
    var url = "https://floating-springs-71363.herokuapp.com/api/auth/contacts/" + this.state.idChange
    var token = document.cookie.split(";").find(function (value, index) { return value.includes("jwtAuth=") }).split("jwtAuth=")[1];
    var modifications = JSON.stringify({
      'name': this.state.name, 'surname': this.state.surname, 'email': this.state.email, 'phone': this.state.phone, 'address': this.state.address
    })
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      },
      body: (modifications)
    })
      .then((response) => {
        if (response.status != 200) {
          success("Failed to modify this user's information.")
        }
        else {
          success("User modified successfully")
          this.GetContactList()
        }
      }).catch((err) => { console.log(modifications); console.log(this.state.idChange); console.log(url); console.log(err) })
    event.preventDefault()
    this.setState({ name: '', surname: '', email: '', phone: '', address: '' });
  }

  GetContactList() {
    var url = "https://floating-springs-71363.herokuapp.com/api/auth/contacts"
    var tokenString = document.cookie.split(";").find(function (value, index) { return value.includes("jwtAuth=") });
    let token = "";
    if (tokenString) {
      token = tokenString.split("jwtAuth=")[1];
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      }).then((response) => {
        if (response.status != 200) {
          alert("Error listing users")
        }
        else {

          response.json().then((data) => {
            this.setState({
              contactList: data
            })
          })
        }
      })

    }
  }
  authChange = auth => {  
    this.setState({isAuthenticated: auth });
  };
  showModal = () => {
    this.setState({ open: true });
  };
  hideModal = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <>
        <Router>
          <div className="row mx-0 flex-fill">
            <Navbar />
            <div className='col vh-100'>
              <Routes>
                <Route path="/" element={
                  <Grid className='mh-100 overflow-auto pb-4 my-0' container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Array.from(this.state.contactList).map((value, index) => (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <div className='w-100'>
                          <Item className='btn d-block w-100' onClick={() => openUserInfo(value._id)}> {/*No need to do it like this as we already have the data, but i'm going to call the api with /contacts/:id to show that it works */}
                            {value.name + " " + value.surname}
                            <CgProfile color='black' cursor={"pointer"} />
                          </Item>
                          <div className='mt-2 d-flex justify-content-center'>
                            <HiPencilAlt className='pencil' cursor={"pointer"} onClick={() => { this.setState({ idChange: value._id }); openEdit() }} />
                            <ImBin className='bin' cursor={"pointer"} onClick={() => { this.deleteUser(value._id); }} />
                          </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                }></Route>
              </Routes>
            </div>
          </div>
        </Router>
        {(() => {
          if (this.state.isAuthenticated == false) {
            return <LoginM auth={this.state.isAuthenticated} authChange={this.authChange} GetContactList={this.GetContactList} />;
          }
          if (this.state.isAuthenticated == true) {
            return <AddUser GetContactList2={this.GetContactList} />;
          }

        })()}

        <div class="modal fade" id="showconfirmation" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Success</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label id="messageToshow"></label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>


        <div class="modal fade" id="editUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="edituser" onSubmit={this.editUser.bind(this)}>
                  <div class="form-group">
                    <label for="exampleInputName1">Enter contact name :</label>
                    <input value={this.state.name} onChange={(event) => this.handleChange(event, "name")} type="text" class="form-control" id="name12"  />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputSurname1">Enter contact surname : </label>
                    <input value={this.state.surname} onChange={(event) => this.handleChange(event, "surname")} type="text" class="form-control" id="surname"  />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Enter contact email : </label>
                    <input value={this.state.email} onChange={(event) => this.handleChange(event, "email")} type="text" class="form-control" id="email"  />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputPhone1">Enter contact phone : </label>
                    <input value={this.state.phone} onChange={(event) => this.handleChange(event, "phone")} type="text" class="form-control" id="phone"  />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputAddress1">Enter contact address : </label>
                    <input value={this.state.address} onChange={(event) => this.handleChange(event, "address")} type="text" class="form-control" id="address" />
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" value="Submit" form="edituser" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="displayModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Information for : <b id="displayModalTitle"></b></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-start">
                <div class="mb-2">
                  <label>Contact name :
                    <span id="nameDisplay"></span>
                  </label>
                </div>
                <div class="mb-2">
                  <label>Contact surname :
                    <span id="surnameDisplay"></span>
                  </label>
                </div>
                <div class="mb-2">
                  <label>Contact email :
                    <span id="emailDisplay"></span>
                  </label>
                </div>
                <div class="mb-2">
                  <label>Contact phone :
                    <span id="phoneDisplay"></span>
                  </label>
                </div>
                <div class="mb-2">
                  <label>Contact address :
                    <span id="addressDisplay"></span>
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }

}

export default App;
