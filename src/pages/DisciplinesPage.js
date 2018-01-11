import React, {Component} from 'react';
import '../css/index.css'
import Link from 'react-router-dom/Link';

let allRacers = null;
let allDisciplines = null;
const defaultAddTo = '((Please pick a racer))';

export class DisciplinesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            isLoaded: false
        };
        this.getAllDisciplines = this.getAllDisciplines.bind(this);
        this.getAllDisciplines();
        this.getAllDisciplines;
    }

    getAllDisciplines(){
        fetch('http://localhost:8000/api/getAllElementsOfCollection')
        .then(result => result.json())
        .then((data) => {
            allRacers = this.getAllRacers(data);
            allDisciplines = this.getGlobalAllDisciplines(data);
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

    getGlobalAllDisciplines(data){
        let d = data.items;
        let discs = [];
        d.forEach(element => {
            if (element.hasOwnProperty('discname')) {
                discs.push(element);
            }
        });
        return discs;
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

    newDiscipline(){
        const currentDiscs = this.state.items;

        this.setState ({
            items: currentDiscs.concat([{
                _id: -1,
                discname: ''
            }])
        })
    }

    render() {
        const disciplines = this.state.items;
        return (
            <div margin-top='100px' className="container" id="disciplines">
                <h1>Disciplines</h1>
                
                <button onClick={() => this.newDiscipline()}>Add a new discipline</button>
                <div className='rTable'>
                    <div className='rTableRow'>
                        <div className="rTableHead"><strong>Discipline</strong></div>
                        <div className="rTableHead"><strong>Racer to add to discipline</strong></div>
                        <div className="rTableHead"><strong>Actions</strong></div>
                        <div className="rTableHead"><strong>Racer Actions</strong></div>
                        <div className="rTableHead"><strong>Discipline Actions</strong></div>
                    </div>
                    {
                        disciplines.map(discipline => (
                            discipline.hasOwnProperty('discname') ? 
                                <Discipline item={discipline} key={discipline._id} onUpdate={() => this.getAllDisciplines()}/>
                            : <div></div> 
                        ))
                    }
                </div> 
            </div>
        )
    }
}

class Discipline extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            adding: (this.props.item._id === -1 ? true : false),
            editing: (this.props.item._id === -1 ? true : false),
            _id: this.props.item._id,
            discname: this.props.item.discname
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    add(){
        let newDisc = {
            discname: this.state.discname
        }

        for (let i = 0; i < allDisciplines.length; i++) {
            if (newDisc.discname === allDisciplines[i].discname){
                alert('There is already a discipline with that name!');
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
            body: JSON.stringify(newDisc)
        })
        .then((response) => {
            this.props.onUpdate();
        })
    }

    //add discipline to a racer
    addToRacer(){
        let o = document.getElementById('racer_list'+this.state.item._id);
        let racerId = o.options[o.selectedIndex].value;

        if (racerId == -1) {
            alert('Please choose a racer other than the default one!');
            return;
        }
        let racerToUpdate = null
        for (let i = 0; i < allRacers.length; i++) {
            let r = allRacers[i];
            if (r._id === racerId){
                racerToUpdate = r;
                let curDiscs = r.disciplines;
                for (let j = 0; j < curDiscs.length; j++) {
                    if (curDiscs[j] === this.state.item.discname){
                        alert('Racer is already partaking in this discipline!');
                        return false;
                    }
                }
            }
        }
        
        racerToUpdate.disciplines.push(this.state.item.discname);

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
                alert('Discipline added to racer.');
            } else {
                alert('Failed to add discipline to racer.');
            }
        })
    }

    //remove discipline from racer
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
                let curDiscs = r.disciplines;
                let found = false;
                for (let j = 0; j < curDiscs.length; j++) {
                    const d = curDiscs[j];                    
                    if (d === this.state.item.discname){
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                } else {
                    alert('Racer is not partaking in the chosen discipline!');
                    return false;
                }
            }
        }

        let i = racerToUpdate.disciplines.indexOf(this.state.item.discname);
        racerToUpdate.disciplines.splice(i,1);
        
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
                alert('Discipline removed from racer.');
            } else {
                alert('Failed to remove discipline from racer.');
            }
        })
    }

    formOptions(racers){
        let options = [];
        options.push(<option value={-1} selected>{defaultAddTo}</option>);
        for (let i = 0; i < racers.length; i++) {
            const racer = racers[i];
            let found = false;
            if (racer.hasOwnProperty('disciplines')) {
                for (let j = 0; j < racer.disciplines.length; j++) {
                    const curRacerDisc = racer.disciplines[j];
                    if (curRacerDisc === this.state.item.discname) {
                        found = true;
                        break;
                    }
                }
            } else{
                found = true;
            }
            if (!found){
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

    cancel() {
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
                        !this.state.editing ? this.state.item.discname : (<input name='discname' value={this.state.discname} onChange={this.handleInputChange} type='text'/>)
                    }
                </div>
                <div className='rTableCell'>
                    {
                        !this.state.adding ? 
                        <select id={'racer_list'+this.state.item._id} name='racer_id' value={this.state.discipline} onChange={this.handleInputChange}>
                            {this.formOptions(allRacers)}
                        </select>
                        : <div className='rTableCell'></div> 
                    }
                </div>
                <div className='rTableCell'>
                    {
                        !this.state.adding ? 
                        <Link to={'Discipline/Statistics/' + this.state._id} key={this.state.item._id}>Racers in this discipline</Link> :
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
                                {   
                                    <button onClick={() => this.delete()}>Delete</button>
                                }
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default DisciplinesPage;
