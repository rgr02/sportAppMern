import React, {Component} from 'react';
import {Link} from 'react-router-dom'


let all = null;
let loaded = false;

export class StatisticsPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            item: {},
            isLoaded: false,
            error: ""
        }
        this.getAll();
        this.getItem();
    }

    getAll(){
        fetch('http://localhost:8000/api/getAllElementsOfCollection')
        .then(res => res.json())
        .then((d) => {
            all = d.items;
            loaded = true;
            }, (e) => {
                loaded = true;
                console.error(e);
            })
    }
    getItem(){
        const id = this.props.match.params.id
        fetch('http://localhost:8000/api/getItemsByKeyValuePair/_id=' + id)
        .then(res => res.json())
        .then((data) => {
            this.setState({
                isLoaded: true,
                item: data.items[0]
            })
        }, (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }

    getObj(obj){
        if (obj != null && all != null) {
            for (let i = 0; i < all.length; i++) {
                if (this.state.item._id === all[i]._id){
                    return all[i];
                }
            }
        }
        return null;
    }

    display(){
        let obj = this.getObj(this.state.item._id);
        if (obj != null) {
            if (obj.hasOwnProperty('name')){ // racer
                return this.displayRacer(obj);
            } else if (obj.hasOwnProperty('discname')){ //discipline
                return this.displayDiscipline(obj);
            } else if (obj.hasOwnProperty('sponsorname')){ //sponsor
                return this.displaySponsor(obj);
            } else if (obj.hasOwnProperty('eventname')){ //event
                return this.displayEvent(obj);
            } else {
                return null;
            }
        } else {
            return null;
        } 
    }
    /**
     * Show the racer's statistics (i.e. list everything relevant 
     * namely personal info, disciplines, sponsors & achievements)
     * @param {*} racer 
     */
    displayRacer(racer){        
        if (racer == null) {
            return null;
        }
        return (
            <div>
                <h1>{'Statistics for '+racer.name + ' ' + racer.surname+':'}</h1>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableCell"><strong>Gender</strong></div>
                        <div className="rTableCell">{racer.gender}</div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"><strong>Date of Birth</strong></div>
                        <div className="rTableCell">{racer.date_of_birth}</div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"><strong>Disciplines</strong></div>
                        <div className="rTableCell"></div>
                    </div>
                    {
                        racer.disciplines.length > 0 ? 
                        this.displayRacerDiscs(racer)
                        : 
                        <div className='rTableRow'>
                            <div className="rTableCell"></div>
                            <div className="rTableCell">None</div>
                        </div>
                    }
                    <div className='rTableRow'>
                        <div className="rTableCell"><strong>Sponsors</strong></div>
                        <div className="rTableCell"></div>
                    </div>
                    {
                        racer.sponsored_by.length > 0 ? 
                        this.displayRacerSponsors(racer)
                        : 
                        <div className='rTableRow'>
                            <div className="rTableCell"></div>
                            <div className="rTableCell">None</div>
                        </div>
                    }
                </div>
                <h2>Achievements</h2>
                {/* <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableCell"><strong>Achievements</strong></div>
                    </div>
                </div> */}
                <div className='rTable'>
                    {
                        racer.achievements.length > 0 ? 
                        this.displayRacerAchievements(racer)
                        : 
                        <div className='rTableRow'>
                            <div className="rTableCell">None</div>
                        </div>
                    }
                </div>
                <Link to='/racers'>Back</Link>
            </div>
        );
    }
    displayRacerDiscs(racer){
        let discs = [];
        racer.disciplines.forEach(d => {
            discs.push(
                <div className='rTableRow'>
                    <div className="rTableCell">
                        <button onClick={() => this.removeDiscipline(racer, d)} >Remove discipline</button>
                    </div>
                    <div className="rTableCell">{d}</div>
                </div>);
        });
        return discs;
    }
    displayRacerSponsors(racer){
        let sponsors = [];
        racer.sponsored_by.forEach(s => {
            sponsors.push(
                <div className='rTableRow'>
                    <div className="rTableCell">
                        <button onClick={() => this.removeSponsorship(racer, s)} >Remove sponsorship</button>
                    </div>
                    <div className="rTableCell">{s}</div>
                </div>);
        });
        return sponsors;
    }
    displayRacerAchievements(racer){
        let ach = [];
        for (let i = 0; i < racer.achievements.length; i++) {
            const a = racer.achievements[i];
            ach.push(
                <div className='rTable'>
                <div className='rTableRow'>
                        <div className="rTableCell"><strong>{i+1}</strong></div>
                        <div className="rTableCell">
                            <button onClick={() => this.deleteAchievement(racer, racer.achievements[i])} >Delete Achievement</button>
                        </div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"></div>
                        <div className="rTableCell">Type</div>
                        <div className="rTableCell">{a.type}</div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"></div>
                        <div className="rTableCell">Rank</div>
                        <div className="rTableCell">{a.rank}</div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"></div>
                        <div className="rTableCell">Time in ms</div>
                        <div className="rTableCell">{a.time_in_milliseconds}</div>
                    </div>
                    <div className='rTableRow'>
                        <div className="rTableCell"></div>
                        <div className="rTableCell"><strong>Eventdetails</strong></div>
                        <div className="rTableCell">
                            {
                                this.getRacerAchievementEventDetails(a.event)
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return ach;
    }
    getRacerAchievementEventDetails(event){
        let details = [];
        details.push([
            <div className='rTable'>
                <div className='rTableRow'>
                    <div className="rTableCell"><strong>Event</strong></div>
                    <div className="rTableCell">{event.eventname}</div>
                </div>
                <div className='rTableRow'>
                    <div className="rTableCell"><strong>Discipline</strong></div>
                    <div className="rTableCell">{event.discipline}</div>
                </div>
                <div className='rTableRow'>
                    <div className="rTableCell"><strong>Location</strong></div>
                    <div className="rTableCell">{event.location}</div>
                </div>
                <div className='rTableRow'>
                    <div className="rTableCell"><strong>Run</strong></div>
                    <div className="rTableCell">{event.run}</div>
                </div>
                <div className='rTableRow'>
                    <div className="rTableCell"><strong>Date</strong></div>
                    <div className="rTableCell">{event.date}</div>
                </div>
            </div>
        ]);
        return details;
    }


    removeDiscipline(r, d){
        let index = -1;
        for (let i = 0; i < r.disciplines.length; i++) {
            if (d === r.disciplines[i]){
                index = i;
                break;
            }
        }
        if (index < 0) {
            alert('This achievement does not exist anymore.');
            return false;
        }
        r.disciplines.splice(index, 1);
        fetch('http://localhost:8000/api/modifyElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(r)
        })
        .then((response) => {
            if (response.ok) {
                alert('Removed this discipline from this racer.');
            } else {
                alert('Failed to remove discipline from this racer.');
            }
            window.location = '/Racers';
        })
    }

    removeSponsorship(r, s){
        let index = -1;
        for (let i = 0; i < r.sponsored_by.length; i++) {
            if (s === r.sponsored_by[i]){
                index = i;
                break;
            }
        }
        if (index < 0) {
            alert('This sponsor does not support this racer.');
            return false;
        }

        r.sponsored_by.splice(index, 1);
        fetch('http://localhost:8000/api/modifyElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(r)
        })
        .then((response) => {
            if (response.ok) {
                alert('Removed this sponsor from this racer.');
            } else {
                alert('Failed to remove sponsor from this racer.');
            }
            window.location = '/Racers';
        })
    }

    deleteAchievement(r, a){
        let index = -1;
        for (let i = 0; i < r.achievements.length; i++) {
            if (a === r.achievements[i]){
                index = i;
                break;
            }
        }
        if (index < 0) {
            alert('This achievement does not exist anymore.');
            return false;
        }

        r.achievements.splice(index, 1);
        fetch('http://localhost:8000/api/modifyElement', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            crossdomain: true,
            mode: "cors",
            body: JSON.stringify(r)
        })
        .then((response) => {
            if (response.ok) {
                alert('Deleted this achievement for this racer.');
            } else {
                alert('Failed to delete achievement for this racer.');
            }
            window.location = '/Racers';
        })
    }

    /**
     * Show all racers in a given discipline
     * @param {*} discipline 
     */
    displayDiscipline(discipline){
        if (discipline == null) {
            return null;
        }
        let racers = this.getRacersInDiscipline(discipline);
        if (racers.length == 0){
            return(
                <div>
                <h1>{'The discipline \''+discipline.discname +'\' has no racers.'}</h1>
                <Link to='/disciplines'>Back</Link>
            </div>
            );
        }
        return (
            <div>
                <h1>{'Racers in discipline \''+discipline.discname+'\':'}</h1>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>First name</strong></div>
                        <div className="rTableHead"><strong>Surname</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                    </div>
                    {
                        this.displayDiscRacers(racers)
                    }
                </div>
                
                <Link to='/disciplines'>Back</Link>
            </div>
        );
    }
    displayDiscRacers(racers){
        let r = [];
        for (let i = 0; i < racers.length; i++) {
            r.push(
                <div className='rTableRow'>
                    <div className="rTableCell">{racers[i].name}</div>
                    <div className="rTableCell">{racers[i].surname}</div>
                    <div className="rTableCell">
                        <a href={'/Racer/Statistics/' + racers[i]._id}>This racer's statistics</a>
                    </div>
                </div>
            );        
        } 
        return r;
    }
    getRacersInDiscipline(d){
        let racers = [];
        for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            if(cur.hasOwnProperty('name')){
                for (let j = 0; j < cur.disciplines.length; j++) {
                    const curDisc = cur.disciplines[j];
                    if(curDisc === d.discname){
                        racers.push(cur);
                    }
                }
            }
        }
        return racers;
    }
    

    /**
     * Show all racers sponsored by a given sponsor
     * @param {*} sponsor 
     */
    displaySponsor(sponsor){
        if (sponsor == null){
           return null; 
        }
        let racers = this.getSponsoredRacers(sponsor);
        if (racers.length == 0){
            return(
                <div>
                <h1>{'The sponsor \''+sponsor.sponsorname +'\' does not support any racers.'}</h1>
                <Link to='/sponsors'>Back</Link>
            </div>
            );
        }
        return (
            <div>
                <h1>{'Racers sponsored by \''+sponsor.sponsorname+'\':'}</h1>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>First name</strong></div>
                        <div className="rTableHead"><strong>Surname</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                    </div>
                    {
                        this.displaySponsoredRacers(racers)
                    }
                </div>
                
                <Link to='/sponsors'>Back</Link>
            </div>
        );
    }
    displaySponsoredRacers(racers){
        let r = [];
        for (let i = 0; i < racers.length; i++) {
            r.push(
                <div className='rTableRow'>
                    <div className="rTableCell">{racers[i].name}</div>
                    <div className="rTableCell">{racers[i].surname}</div>
                    <div className="rTableCell">
                        <a href={'/Racer/Statistics/' + racers[i]._id}>This racer's statistics</a>
                    </div>
                </div>
            );        
        } 
        return r;
    }
    getSponsoredRacers(sponsor){
        let racers = [];
        for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            if(cur.hasOwnProperty('name')){
                for (let j = 0; j < cur.sponsored_by.length; j++) {
                    const curSponsor = cur.sponsored_by[j];
                    if(curSponsor === sponsor.sponsorname){
                        racers.push(cur);
                    }
                }
            }
        }
        return racers;
    }
    

    /**
     * Show all racers taking part in a given event
     * @param {*} event 
     */
    displayEvent(event){
        if (event == null) {
            return null;
        }
        let racers = this.getEventRacers(event);
        if (racers.length == 0){
            return(
                <div>
                    <h1>{'The events \''+event.eventname +'\' has no racers.'}</h1>
                    <Link to='/events'>Back</Link>
                </div>
            );
        }
        return (
            <div>
                <h1>{'Racers in event \''+event.eventname+'\':'}</h1>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>First name</strong></div>
                        <div className="rTableHead"><strong>Surname</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                    </div>
                    {
                        this.displayEventRacers(racers)
                    }
                </div>
                
                <Link to='/events'>Back</Link>
            </div>
        );
    }
    displayEventRacers(racers){
        let r = [];
        for (let i = 0; i < racers.length; i++) {
            r.push(
                <div className='rTableRow'>
                    <div className="rTableCell">{racers[i].name}</div>
                    <div className="rTableCell">{racers[i].surname}</div>
                    <div className="rTableCell">
                        <a href={'/Racer/Statistics/' + racers[i]._id}>This racer's statistics</a>
                    </div>
                </div>
            );
        }
        return r;
    }
    getEventRacers(e){
        let racers = [];        
        for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            if(cur.hasOwnProperty('name')){
                if(cur.hasOwnProperty('achievements')){
                    for (let j = 0; j < cur.achievements.length; j++) {
                        const curEvent = cur.achievements[j].event;
                        if(curEvent.eventname === e.eventname){
                            racers.push(cur);
                        }
                    }
                }
            }
        }
        return racers;
    }

    render(){
        return this.display();
        /*return (
            <div>
                <h1>{'Statistics for '}</h1>
                <div>
                    {JSON.stringify(this.state.item)}
                </div>
                <Link to='/racers'>Back</Link>
            </div>
        )*/
    }
}

export default StatisticsPage;