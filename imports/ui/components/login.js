import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react';

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wrongLogin: false,
        }
    }
    
    login = (event) => {
        event.preventDefault();
        let loginMethod = Meteor.settings.public.loginWithLdap ? Meteor.loginWithLDAP : Meteor.loginWithPassword;

        const username = this.inputUsername.value;
        const password = this.inputPassword.value;
        loginMethod(username, password, (error) => {
            if (error) {
                this.setState({
                    wrongLogin: true,
                });
            } else {
                this.setState({
                    wrongLogin: false,
                });
            }
        });
    }

    logout = (event) => {
        event.preventDefault();
        Meteor.logout(err => {
            if (err) {
                console.log(err.reason);
            }
        });
    }

    render() {
        const formState = ''
        const wrongLogin = this.state.wrongLogin ? <div id="wrong-login">De combinatie van e-mailadres en wachtwoord is onjuist!</div>: null
        const gebruiker = Meteor.user()
        
        return (
            <div>
                {
                    gebruiker ? 
                    <div>
                        <div>{gebruiker.username}</div>
                        <button id="logout-button" className="btn btn-primary" onClick={this.logout} >Uitloggen</button>
                    </div> :
                    <form id="login-form" onSubmit={this.login}>
                        <div className="form-group">
                            <label htmlFor="inputUsername">E-mail</label>
                            <input type="text" id="inputUsername" className="form-control" ref={(input) => this.inputUsername = input} placeholder="E-mail" required disabled={formState}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword">Wachtwoord</label>
                            <input type="password" className="form-control" ref={(input) => this.inputPassword = input} id="inputPassword" placeholder="Wachtwoord" required disabled={formState}/>
                        </div>
                        {wrongLogin}
                        <button type="submit" className="btn btn-primary" style={{display: "block"}} >Inloggen</button>
                    </form>
                }
            </div>
        );
    }
}
