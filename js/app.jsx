import React from "react";
import ReactDOM from "react-dom";
require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: 'Poland',
            flag: 'https://restcountries.eu/data/pol.svg',
            points: 0
        }
    }
    componentDidMount(){
        fetch('https://restcountries.eu/rest/v2/all?fields=name;flag').then(resp => {
            if(resp.ok)
                return resp.json();
            else 
                throw new Error('Network error');
        }).then(resp => {
            console.log(resp);
        }).catch(err => {
            console.log('Error', err);
        });
    }
    validate = () => {
        let input = $('input');
        let inputVal = input.val();
        if((this.state.name).toUpperCase() == inputVal.toUpperCase()){
            console.log('ok');
            this.setState({
                points: this.state.points +1
            })
        } else {
            console.log('nie ok')
        }
        input.val('');
    }
    render(){
        return <div>
            <h1>Which country's flag is this?</h1>
            <img src={this.state.flag} style={{height: '200px', border: '1px solid black'}} />
            <h2>Answer: 
                <input type="text"></input>
                <button onClick={this.validate} type="submit">Submit</button>
                Points: {this.state.points}
            </h2>
        </div>
    }
}

class App extends React.Component {
    render() {
        return <Game />
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

});