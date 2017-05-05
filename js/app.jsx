import React from "react";
import ReactDOM from "react-dom";
require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){

class Header extends React.Component {
    render(){
        return <h1>Which country's flag is this?</h1>;
    }
}
    
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            flag: '',
            points: 0
        }
    }
    componentDidMount(){
        this.loadQuestion();
    }
    loadQuestion = () => {
        fetch('https://restcountries.eu/rest/v2/all?fields=flag;name').then(resp => {
            if(resp.ok)
                return resp.json();
            else 
                throw new Error('Network error');
        }).then(resp => {
            let namesArray = [];
            let flagsArray = [];
            for (let i=0; i<resp.length; i++){
                namesArray.push(resp[i].name);
                flagsArray.push(resp[i].flag);
            }
            let randomIndex = Math.floor(Math.random() * namesArray.length);
            console.log(randomIndex);
            this.setState({
                name: namesArray[randomIndex],
                flag: flagsArray[randomIndex]
            });
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
            this.loadQuestion();
        } else {
            console.log('nie ok')
        }
        input.val('');
    }
    render(){
        return <div>
            <img className="flag-image" src={this.state.flag} />
            <h2>Answer: 
                <input type="text"></input>
                <button onClick={this.validate} type="submit">Submit</button>
                Points: {this.state.points}
            </h2>
        </div>
    }
}

class Footer extends React.Component {
    render(){
        return ;
    }
}

class App extends React.Component {
    render() {
        return <div>
                <Header />
                <Game />
        </div>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

//function shuffle(a) {
//    for (let i = a.length; i; i--) {
//        let j = Math.floor(Math.random() * i);
//        [a[i - 1], a[j]] = [a[j], a[i - 1]];
//    }
//}

});