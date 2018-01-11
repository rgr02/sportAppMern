import React, {Component} from 'react';
import '../css/index.css'
import Link from 'react-router-dom/Link';

let availableDisciplines = null;
const defaultAddTo = '((Please pick a racer))';
let allRacers = null;
let allEvents = null;


export class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            isLoaded: false
        };
        this.getAllEvents = this.getAllEvents.bind(this);
        this.getAllEvents();
        this.getAllEvents;
    }

    getAllEvents(){
        fetch('http://localhost:8000/api/getAllElementsOfCollection')
        .then(result => result.json())
        .then((data) => {
            availableDisciplines = this.getAvailableDisciplines(data);
            allRacers = this.getAllRacers(data);
            allEvents = this.getGlobalAllEvents(data);
            this.setState({
                isLoaded: true,
                items: data.items
            })
        }, (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }

    getGlobalAllEvents(data){
        let d = data.items;
        let e = [];
        d.forEach(element => {
            if (element.hasOwnProperty('eventname')) {
                e.push(element);
            }
        });
        return e;
    }

    getAllRacers(data){
        let d = data.items;
        let racers = []
        d.forEach(element => {
           if (element.hasOwnProperty('name')){
               racers.push(element);
           } 
        });
        return racers;
    }

    //Filters the fetched data for disciplines that will be needed for creating an event.
    getAvailableDisciplines (data){
        let items = data.items;
        let disciplines = [];
        items.forEach(element => {
            if(element.hasOwnProperty('discname')){
                disciplines.push(element);
            }
        });   
        return disciplines;
    }

    newEvent(){
        const currentEvents = this.state.items;

        this.setState({
            items: currentEvents.concat([{
                _id: -1,
                eventname: '',
                discipline: '',
                location: '',
                date: new Date()
            }])
        });
    }


    render() {
        const events = this.state.items;
        return (
            <div margin-top='100px' className="container" id="events">
                <h1>Events</h1>
                
                <button onClick={() => this.newEvent()}>Add a new Event</button>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>Eventname</strong></div>
                        <div className="rTableHead"><strong>Discipline</strong></div>
                        <div className="rTableHead"><strong>Location</strong></div>
                        <div className="rTableHead"><strong>Date</strong></div>
                        <div className="rTableHead"><strong>Racer Actions</strong></div>
                        <div className="rTableHead"><strong>Add racers to event</strong></div>
                        {/* <div className="rTableHead"><strong>Add / Remove racers to / from event</strong></div> */}
                        <div className="rTableHead"><strong>Event Actions</strong></div>
                    </div>
                    {
                        events.map(event => (
                            event.hasOwnProperty('eventname') ? 
                                <Event item={event} key={event._id} onUpdate={() => this.getAllEvents()}/>
                            : <div></div> 
                        ))
                    }
                </div>

            </div>
        )
    }
}

var dateFormat = require('dateformat');

class Event extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            adding: (this.props.item._id === -1 ? true : false),
            editing: (this.props.item._id === -1 ? true : false),
            _id: this.props.item._id,
            eventname: this.props.item.eventname,
            discipline: this.props.item.discipline,
            location: this.props.item.location,
            date: this.props.item.date
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.availableDisciplines = availableDisciplines;
        
        this.formOptionsDisc = this.formOptionsDisc.bind(this);
    }

    add(){
        let disc = document.getElementById('disc'+this.state.item._id)
        let discVal = disc.options[disc.selectedIndex].value;
        if (this.state.eventname == null || this.state.eventname == '' || !this.state.eventname.replace(/\s/g, '').length){
            alert('Please enter a valid value for \'Eventname\'!');
            return false;
        }
        if (this.state.location == null || this.state.location == '' || !this.state.location.replace(/\s/g, '').length){
            alert('Please enter a valid value for \'Location\'!');
            return false;
        }
        try {
            if (this.state.date == null) throw 'date is null';
            dateFormat(new Date(this.state.date), 'yyyy-mm-dd');
        } catch (error) {
            alert('Please enter a valid value for \'Date\'!');
            return false;
        }
        
        let newEvent = {
            eventname: this.state.eventname,
            discipline: discVal,
            location: this.state.location,
            date: this.state.date
        }

        for (let i = 0; i < allEvents.length; i++) {
            if (newEvent.eventname === allEvents[i].eventname){
                alert('There is already an event with the given name!');
                return false;
            }
        }
        
        fetch('http://localhost:8000/api/postNewElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(newEvent)
        })
        .then((response) => {
            this.props.onUpdate();
        })
    }

    delete(){
        if (!(this.state._id === -1)) {
            fetch('http://localhost:8000/api/deleteElement/' + this.state._id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                },
                crossdomain: true,
                mode: "cors",
            })
            .then((response) => {
                this.props.onUpdate();
            })
        }
        else {
            this.props.onUpdate();
        }
    }

    cancel(){
        this.setState({
            editing: false
        });
        this.props.onUpdate();
    }
    handleInputChange(event){
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]:value
        })
    }
    /**
     * Creates the <options> for the dropdown menu, therefore only existing disciplines are allowed.
     * @param {*} d an array of disciplines 
     */
    formOptionsDisc(d){
        let options = [];
        d.forEach(disc => {
            options.push(<option value={disc.discname}>{disc.discname}</option>);
        });
        return options;
    }

    formOptionsRacers(){
        let options = [];
        options.push(<option value={-1} selected>{defaultAddTo}</option>)
        for (let i = 0; i < allRacers.length; i++) {
            const e = allRacers[i];
            let found = false;
            if (e.hasOwnProperty('achievements')) {
                for (let j = 0; j < e.achievements.length; j++) {
                    const curEvent = e.achievements[j].event;
                    if (curEvent.eventname === this.state.item.eventname) {
                        found = true;
                        break;
                    }
                }
            } else {
                found = true;
            }
            if (!found) {
                options.push(<option value={e._id}>{e.name + ' ' + e.surname}</option>);
            }
        }
        return options;
    }

    addToRacer(){
        let o = document.getElementById('racer_list'+this.state.item._id);
        let racerId = o.options[o.selectedIndex].value;
        if (racerId == -1) {
            alert('Please choose a racer other than the default one!');
            return;
        }

        let racerToUpdate = null
        for (let i = 0; i < allRacers.length; i++) {
            const r = allRacers[i];
            if (r._id === racerId){
                racerToUpdate = r;
                if (racerToUpdate.hasOwnProperty('achievements')){
                    let a  = r.achievements;
                    for (let j = 0; j < a.length; j++) {
                        let curA = a[j];
                        if(curA.hasOwnProperty('event')){
                            if (curA.event.eventname === this.state.item.eventname){
                                alert('Racer is already taking part in this event!');
                                return false;
                            }
                        }
                    }  
                }
               
            }
        }
        window.location = '/EventRacer/:eid'+this.state.item._id+'/:rid'+racerToUpdate._id;

    }

    removeFromRacer(){
        let o = document.getElementById('racer_list'+this.state.item._id);
        let racerId = o.options[o.selectedIndex].value;
        if (racerId == -1) {
            alert('Please choose a racer other than the default one!');
            return;
        }
        let index = -1;
        let racerToUpdate = null
        for (let i = 0; i < allRacers.length; i++) {
            const r = allRacers[i];
            if (r._id === racerId){
                racerToUpdate = r;
                let found = false;
                if (racerToUpdate.hasOwnProperty('achievements')){
                    let a = r.achievements;
                    for (let j = 0; j < a.length; j++) {
                        let curA = a[j];
                        if (curA.hasOwnProperty('event')){
                            if(curA.event.eventname === this.state.item.eventname){
                                found = true;
                                index = j;
                                break;
                            }
                        }
                    }
                }
                if (found){
                    break;
                } else {
                    alert('Racer is not taking part in this event!');
                    return false;
                }
            }
        }

        racerToUpdate.achievements.splice(index, 1);

        fetch('http://localhost:8000/api/modifyElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(racerToUpdate)
        })
        .then((response) => {
            this.props.onUpdate();
            if (response.ok) {
                alert('Event removed from racer.');
            } else {
                alert('Failed to remove event from racer.');
            }
        })
    }


    render(){
        let date = dateFormat(new Date(this.state.date), 'yyyy-mm-dd');
        if (this.availableDisciplines !== undefined) {
            return (
                <div className='rTableRow' key={this.state.item._id}>
                     <div className='rTableCell'>
                        {
                            !this.state.adding ? this.state.item.eventname : (<input name='eventname' value={this.state.eventname} onChange={this.handleInputChange} type='text'/>)
                        }
                    </div>
                    <div className='rTableCell'>
                        {
                            !this.state.adding ? this.state.item.discipline : 
                            (
                                <select id={'disc'+this.state.item._id} name='discipline' value={this.state.discipline} onChange={this.handleInputChange} >
                                   {this.formOptionsDisc(this.availableDisciplines)}
                                </select>
                            )
                        }
                    </div>
                    <div className='rTableCell'>
                        {
                            !this.state.adding ? this.state.item.location : (<input name='location' value={this.state.location} onChange={this.handleInputChange} type='text'/>)
                        }
                    </div>
                    <div className='rTableCell'>
                        {
                            !this.state.adding ? date : (<input name='date' value={date} onChange={this.handleInputChange} type='date'/>)
                        }
                    </div>
                    {
                        !this.state.adding ?
                        <div className='rTableCell'>
                            <Link to={'Event/Statistics/' + this.state._id} key={this.state.item._id}>Racers in this event</Link>
                        </div> : <div className='rTableCell'></div>
                    }
                    <div className='rTableCell'>
                        {
                            !this.state.adding ?
                            <div>
                                <select id={'racer_list'+this.state.item._id} name='racer_id' value={this.state.event} onChange={this.handleInputChange}>
                                    {this.formOptionsRacers()}
                                </select>
                                <button onClick={() => this.addToRacer()}>Add</button>
                                {/* <button onClick={() => this.removeFromRacer()}>Remove</button> */}
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                    <div className='rTableCell'>
                        {
                            !this.state.adding ? 
                            <div>
                                <button onClick={() => this.delete()}>Delete</button>
                            </div>
                            :
                            <div>
                                <button onClick={() => this.add()}>Add</button>
                                <button onClick={() => this.cancel()}>Cancel</button>
                            </div>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <p>No disciplines found. Please create a discipline before adding a new event.</p>
            );
        }
    }
}

export default EventsPage;