import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {DisciplinesPage} from "./pages/DisciplinesPage";
import {SponsorsPage} from "./pages/SponsorsPage";
import {StatisticsPage} from "./pages/StatisticsPage";
import {EventsPage} from "./pages/EventsPage";
import {SubmitPage} from "./pages/SubmitPage";
import {RacersPage} from "./pages/RacersPage";
import {EventRacerPage} from "./pages/EventRacerPage";

const icon = require("./img/icon.png");

//Renders the Composition of the App Components
class App extends Component {

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand">
                        <img src={icon} height="70"/>
                    </a>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link ">
                                    <Link to="/Home">Home</Link>
                                </a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link">
                                    <Link to="/Statistics">Statistics</Link>
                                </a>
                            </li> */}
                            <li className="nav-item">
                                <a className="nav-link">
                                    <Link to="/Disciplines">Disciplines</Link>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">
                                    <Link to="/Racers">Racers</Link>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">
                                    <Link to="/Events">Events</Link>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">
                                    <Link to="/Sponsors">Sponsors</Link>
                                </a>
                            </li>
                        </ul>
                        {/* <div className="navbar-nav ml-auto">
                            <button type="button" className="btn btn-outline-primary pull-right">
                                <Link to="/Submit">Submit</Link>
                            </button>
                        </div> */}
                    </div>
                </nav>

                <div className="container" id="content">
                    <Route path={"/Racer/Statistics/:id"} component={StatisticsPage}/>
                    <Route path={"/Discipline/Statistics/:id"} component={StatisticsPage}/>
                    <Route path={"/Sponsor/Statistics/:id"} component={StatisticsPage}/>
                    <Route path={"/Event/Statistics/:id"} component={StatisticsPage}/>
                    <Route path={"/EventRacer/:eid/:rid"} component={EventRacerPage}/>
                    <Route path={"/Disciplines"} component={DisciplinesPage}/>
                    <Route path={"/Racers"} component={RacersPage}/>
                    <Route path={"/Events"} component={EventsPage}/>
                    <Route path={"/Sponsors"} component={SponsorsPage}/>
                    <Route path={"/Submit"} component={SubmitPage}/>
                </div>
            </div>
        );
    }
}

export default App;
