import React from "react";
import "react-responsive-modal/styles.css";
import { CgLock } from 'react-icons/cg'
import {MdOutlineEmail} from 'react-icons/md'
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Modal } from "react-responsive-modal";
import './navbar.css'

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};


class LoginModal extends React.Component {

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pw:'',
      pwC:'',
      open:true,
      error : '',
      show : true,
      pwshow : false
    };
  }
  updateInputUser(e) {
    const us = e.target.value;
    this.setState({
      user: us
    });
  }
  updateInputPW(e) {
    const pw = e.target.value;
    this.setState({
      pw: pw
    });
  }
  updateInputPWC(e) {
    const pwC = e.target.value;
    this.setState({
      pwC: pwC
    });
  }
  changeContent (err) {
    this.setState({
      error: err
    });
  };
  pwShow(bool){
    this.setState({
      pwshow : bool
    }
    )
  }

  login() {
    var url = "https://floating-springs-71363.herokuapp.com/api/auth/login"
    const email = this.state.user
    const password = this.state.pw
    var toSend = JSON.stringify({
      'email': email,
      'password': password,
    });
    fetch(url, { method: 'POST' ,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: (toSend)}
    )
          .then((response) => {
            if (response.status!=200) {
              this.changeContent("Invalid username or password")
            }
            else{
              response.json().then((data) => {
                document.cookie = "jwtAuth=" + data.token;
                console.log(document.cookie)
                this.onCloseModal()
                this.props.authChange(true)
                this.props.GetContactList()
              })
            }
          })
  }
  register(){
    var url = "https://floating-springs-71363.herokuapp.com/api/auth/register"
    const email = this.state.user
    const password = this.state.pw
    var toSend = JSON.stringify({
      'email': email,
      'password': password,
    });
    if (this.state.pwshow==false) this.setState({pwshow: true });
    else if (this.state.user.length==0) this.changeContent("Username can't be empty")
    else if (this.state.pw.length<5) this.changeContent("Password has to have 5 or more characters")
    else if (this.state.pw != this.state.pwC) this.changeContent("Password does not match confirmation")
    else {fetch(url, { method: 'POST' ,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: (toSend)}
    )
          .then((response) => {
            if (response.status==501) {
              this.pwShow(true)
            }
            else if (response.status == 404){
              this.changeContent("Email already in use")
              if(this.state.pwshow==false) this.setState({pwshow: true });
            }
            else{
              response.json().then((data) => {
                document.cookie = "jwtAuth="+data.token
                this.onCloseModal()
                this.props.authChange(true)
              })
            }
          })
        }
    
  }




  render() {
    const { open } = this.state;
    return (
      <div style={styles}>
        <Modal open={open} onClose={this.onCloseModal} closeOnEsc={false} closeOnOverlayClick ={false} showCloseIcon ={false} classNames={{modal: 'customModal'}}>
          <div class="inputContainer"> 
            <div className="input-group mb-3">
              <div className="input-group-prepend">
              </div>
               <input class="input" type="text" className="form-control" placeholder="@username" aria-label="Username" aria-describedby="basic-addon1" value={this.state.user} onChange={e => this.updateInputUser(e)} />
               <MdOutlineEmail size={25} style={{opacity: 0.4}} class="inputIcon"/>
            </div> 
          </div>
            <div class="inputContainer">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
              </div>
              <input class="input" type="password" class="form-control" placeholder="●●●●●●●● (password)" aria-label="Password" aria-describedby="basic-addon1" value={this.state.pw} onChange={e => this.updateInputPW(e)} />
              <CgLock class="inputIcon" style={{opacity: 0.4}} size={25}/>
            </div>
            </div>

            <div class="inputContainer" style={{display: this.state.pwshow ? 'block' : 'none' }}>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
              </div>
              <input class="input" type="password" class="form-control" placeholder="●●●●●●●● (password_confirmation)" aria-label="Password" aria-describedby="basic-addon1" value={this.state.pwC} onChange={e => this.updateInputPWC(e)} />
              <CgLock class="inputIcon" style={{opacity: 0.4}} size={25}/>
            </div>
            </div>

            
            <div className="error" style={{display: this.state.show ? 'block' : 'none' }}> <p class="text-center text-danger"> {this.state.error} </p> </div>

            <ButtonGroup vertical className="w-100">
              <button type="submit" className="btn btn-primary mb-2" onClick={() => {this.login();}}>Log in</button>    
              <button className="btn btn-primary" onClick={() => {this.register();}}>Register</button>
            </ButtonGroup>
          </Modal>
        </div>
      
    );
  }
}

export default LoginModal;