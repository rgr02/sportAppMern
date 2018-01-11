import React, {Component} from 'react';
import '../css/index.css'
import Link from 'react-router-dom/Link';

let allRacers = null;
let allSponsors = null;
const defaultAddTo = '((Please pick a racer))';

export class SponsorsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            isLoaded: false
        };
        this.getAllSponsors = this.getAllSponsors.bind(this);
        this.getAllSponsors();
        this.getAllSponsors;
    }

    getAllSponsors(){
        fetch('http://localhost:8000/api/getAllElementsOfCollection')
        .then(result => result.json())
        .then((data) => {
            allRacers = this.getAllRacers(data);
            allSponsors = this.getGlobalAllSponsors(data);
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

    getGlobalAllSponsors(data){
        let d = data.items;
        let s = [];
        d.forEach(element => {
            if (element.hasOwnProperty('sponsorname')) {
                s.push(element);
            }
        });
        return s;
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

    newSponsor(){
        const currentSponsors = this.state.items;

        this.setState({
            items: currentSponsors.concat([{
                _id: -1,
                sponsorname: ''
            }])
        })
    }

    render() {
        const sponsors = this.state.items;
        return (
            <div margin-top='100px' className="container" id="sponsors">
                <h1>Sponsors</h1>
                <button onClick={() => this.newSponsor()} >Add a new Sponsor</button>

                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>Sponsor</strong></div>
                        <div className="rTableHead"><strong>Racer to add to sponsor</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                        <div className="rTableHead"><strong>Racer Actions</strong></div>
                        <div className="rTableHead"><strong>Sponsor Actions</strong></div>
                    </div>
                    {
                        sponsors.map(sponsor => (
                            sponsor.hasOwnProperty('sponsorname') ? 
                                <Sponsor item={sponsor} key={sponsor._id} onUpdate={() => this.getAllSponsors()}/>
                            : <div></div> 
                        ))
                    }
                </div> 
            </div>
        )
    }
}

class Sponsor extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            item: this.props.item,
            adding: (this.props.item._id === -1 ? true : false),
            editing: (this.props.item._id === -1 ? true : false),
            _id: this.props.item._id,
            sponsorname: this.props.item.sponsorname
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    add(){
        let newSponsor ={
            sponsorname: this.state.sponsorname
        }

        for (let i = 0; i < allSponsors.length; i++) {
            if (newSponsor.sponsorname === allSponsors[i].sponsorname) {
                alert('There is already a sponsor with this name!');
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
            body: JSON.stringify(newSponsor)
        })
        .then((response) => {
            this.props.onUpdate();
        })
    }

    //add sponsor to a racer
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
                let curSponsors = r.sponsored_by;
                for (let j = 0; j < curSponsors.length; j++) {
                    if (curSponsors[j] === this.state.item.sponsorname){
                        alert('Racer is already sponsored by this sponsor');
                        return false;
                    }
                }
            }
        }

        racerToUpdate.sponsored_by.push(this.state.item.sponsorname);

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
                alert('Sponsor added to racer.');
            } else {
                alert('Failed to add sponsor to racer.');
            }
        })
    }

    //remove sponsor from racer
    removeFromRacer(){
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
                let curSponsors = r.sponsored_by;
                let found = false;
                for (let j = 0; j < curSponsors.length; j++) {
                    const s = curSponsors[j];               
                    if (s === this.state.item.sponsorname){
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                } else {
                    alert('Racer is not sponsored by this sponsor!');
                    return false;
                }
            }
        }
        
        let i = racerToUpdate.sponsored_by.indexOf(this.state.item.sponsorname);
        racerToUpdate.sponsored_by.splice(i,1);

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
                alert('Sponsor removed from racer.');
            } else {
                alert('Failed to remove sponsor from racer.');
            }
        })
    }

    formOptions(racers){
        let options = [];
        options.push(<option value={-1} selected>{defaultAddTo}</option>);
        for (let j = 0; j < racers.length; j++) {
            const racer = racers[j];
            let found = false;
            for (let i = 0; i < racer.sponsored_by.length; i++) {
                if (this.state.item.sponsorname === racer.sponsored_by[i]){
                    found = true;
                    break;
                }
               
            }
            if (!found) {
                options.push(<option value={racer._id}>{racer.name + ' ' + racer.surname}</option>);
            }
        }
        return options;
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

    render(){
        return (
            <div className='rTableRow' key={this.state.item._id}>
                <div className='rTableCell'>
                    {
                        !this.state.editing ? this.state.item.sponsorname : (<input name='sponsorname' value={this.state.sponsorname} onChange={this.handleInputChange} type='text'/>)
                    }
                </div>
                <div className='rTableCell'>
                    {
                        !this.state.adding ? 
                        <select id={'racer_list'+this.state.item._id} name='racer_id' value={this.state.sponsor} onChange={this.handleInputChange}>
                            {this.formOptions(allRacers)}
                        </select>
                        : <div className='rTableCell'></div> 
                    }
                </div>
                <div className='rTableCell'>
                    {
                        !this.state.adding ? 
                        <Link to={'Sponsor/Statistics/' + this.state._id} key={this.state.item._id}>Racers supported by this sponsor</Link> :
                        <div className='rTableCell'></div> 
                    }
                </div>
                <div className='rTableCell'>
                    {
                        this.state.adding ? 
                            <div> 
                            </div>
                            :
                            <div>
                                <button onClick={() => this.addToRacer()}>Add</button>
                                {/* <button onClick={() => this.removeFromRacer()}>Remove</button> */}
                            </div>
                    }
                </div>
                <div className='rTableCell'>
                    {
                        this.state.adding ? 
                            <div> 
                                <button onClick={() => this.add()}>Add</button>
                                <button onClick={() => this.cancel()}>Cancel</button>
                            </div>
                            :
                            <div>
                                <button onClick={() => this.delete()}>Delete</button>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default SponsorsPage;