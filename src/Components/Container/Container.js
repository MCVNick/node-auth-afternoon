import React, { Component } from 'react';
import './Container.css';
import Treasure from '../Treasure';
import Axios from 'axios';
import AddTreasure from '../AddTreasure';

export default class Container extends Component {
  constructor() {
    super();
    this.state = {
      treasures: {},
    };
    this.addMyTreasure = this.addMyTreasure.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ treasures: {} });
    }
  }

  getDragonTreasure(){
    // no auth required
    Axios.get('/api/treasure/dragon')
      .then(res => {
        const treasures = {...this.state.treasures, dragon: res.data}

        this.setState({
          treasures: treasures
        })
      })
  }
  getAllTreasure(){
    // admin auth required
    Axios.get('/api/treasure/all')
      .then(res => {
        const treasures = {...this.state.treasures, all: res.data}

        this.setState({
          treasures: treasures
        })
      })
  }
  getMyTreasure(){
    // login auth required
    Axios.get('api/treasure/user')
      .then(res => {
        const treasures = {...this.state.treasures, user: res.data}

        this.setState({
          treasures: treasures
        })
      })
  }

  addMyTreasure (addedTreasure) {
    this.setState({
      treasures: {...this.state.treasures}, user: addedTreasure
    })
  };

  render() {
    const { username } = this.props.user;
    const { dragon, user, all } = this.state.treasures;
    return (
      <div className="Container">
        {dragon ? (
          <div className="treasureBox loggedIn">
            <h1>Dragon's treasure</h1>
            <Treasure treasure={dragon} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={()=>this.getDragonTreasure()}>
              See Dragon's <br /> Treasure
            </button>
            <p>This treasure trove does not require a user to be logged in for access</p>
          </div>
        )}
        {user && username ? (
          <div className="treasureBox loggedIn">
            <h1>
              {this.props.user.username}
              's treasure
            </h1>
            <Treasure treasure={user} addMyTreasure={this.addMyTreasure}/>
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={()=> this.getMyTreasure()} name="user">
              See My <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be logged in for access</p>
          </div>
        )}
        {all && username ? (
          <div className="treasureBox loggedIn">
            <h1>All treasure</h1>
            <Treasure treasure={all} />
          </div>
        ) : (
          <div className="treasureBox">
            <button className="title" onClick={()=> this.getAllTreasure()} name="all">
              See All <br /> Treasure
            </button>
            <p>This treasure trove requires a user to be a logged in as an admin user for access</p>
          </div>
        )}
      </div>
    );
  }
}
