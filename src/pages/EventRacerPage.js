import React, {Component} from 'react';
import '../css/index.css'
import Link from 'react-router-dom/Link';

export class EventRacerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            event: null,
            racer: null,
            existingEvents: null,
            isLoaded: false
        };
        this.getDetails();
    }

    eventAlreadyExists(){
        if (this.racer.hasOwnProperty('achievements')){
            for (let i = 0; i < this.racer.achievements.length; i++) {
                const e = this.racer.achievements[i];
                if (e.event.eventname === this.event.eventname){
                    return true;
                }
            }
        }
        return false;
        
    }

    addAchievementToRacer(){
        let t = document.getElementById('type').value;
        let r = document.getElementById('rank').value;
        let time = document.getElementById('time').value;  
        let run = document.getElementById('run').value;  
        
        if (t == null || t == '' || !t.replace(/\s/g, '').length){
            alert('Please enter a valid value for \'Type\'!');
            return false;
        }
        if (r == null || r =='' || r < 1){
            alert('Please enter a valid value for \'Rank\'! (a number greater than 0)');
            return false;
        }
        if (time == null || time == '' || time < 1){
            alert('Please enter a valid value for \'Time in milliseconds\'! (a number greater than 0)');
            return false;
        }
        if (t == null || t == '' || !t.replace(/\s/g, '').length){
            alert('Please enter a valid value for \'Run\'!');
            return false;
        }
        if (this.eventAlreadyExists()){
            alert('Event already exists for this racer.');
            window.location = '/events';
            return false;
        }
        let achievement = {
            type: t,
            rank: r,
            time_in_milliseconds: time,
            event: this.event
        }
        achievement.event.run = run;
        this.racer.achievements.push(achievement);

        fetch('http://localhost:8000/api/modifyElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(this.racer)
        })
        .then((response) => {
            if (response.ok) {
                alert('Event / Achievement added to racer.');
                window.location = '/Racers';
            } else {
                alert('Failed to add the event to racer.');
                window.location = '/events';
            }
        })
    }

    getDetails(){
        let eventid = this.props.match.params.eid;
        let racerid = this.props.match.params.rid;
        //remove ':eid' & ':rid' from parameters
        eventid = eventid.substring(4, eventid.length);
        racerid = racerid.substring(4, racerid.length);
        this.fetchData(racerid, eventid);
    }

    fetchData(rid, eid){
        let racer = null;
        let event = null;
        Promise.all([
            fetch('http://localhost:8000/api/getItemsByKeyValuePair/_id=' + rid),
            fetch('http://localhost:8000/api/getItemsByKeyValuePair/_id=' + eid)
        ]).then((res) => {
            Promise.all([
                res[0].json(),
                res[1].json()
            ]).then((data) => { // racer first, then event
                this.racer = data[0].items[0]; 
                this.event = data[1].items[0];
                this.setState({
                    isLoaded: true
                })                
            }, (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            });      
        }, (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        });
    }

    render() {
        if (this.event == null || this.racer == null){
            return null;
        }
        return (
            <div margin-top='100px' className="container" id="events">
                <h2>{'Add racer \''+ this.racer.name + ' ' + this.racer.surname + '\' to Event \''+ this.event.eventname +'\':'}</h2>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>Type</strong></div>
                        <div className="rTableHead"><strong>Rank</strong></div>
                        <div className="rTableHead"><strong>Time in milliseconds</strong></div>
                        <div className="rTableHead"><strong>Run</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell">
                            <input id='type'name='type' type='text'></input>
                        </div>
                        <div className="rTableCell">
                            <input id='rank' name='rank' type='number' min='1'></input>
                        </div>
                        <div className="rTableCell">
                            <input id='time' name='time_in_milliseconds' type='number' min='1'></input>
                        </div>
                        <div className="rTableCell">
                            <input id='run' name='run' type='text'></input>
                        </div>
                        <div className="rTableCell">
                            <button onClick={() => this.addAchievementToRacer()}>Add</button>
                        </div>
                    </div>
                </div>
                <Link to='/events'>Back</Link>
            </div>
        )
    }
}

export default EventRacerPage;