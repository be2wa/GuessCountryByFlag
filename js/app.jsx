import React from "react";
import ReactDOM from "react-dom";
require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOver: false,
        }
    }
    componentDidMount(){
        this.timeoutId = setTimeout(() => {
            this.setState({
                isOver: true
            });
        },29000);
    }
    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }
    render(){
        if(this.state.isOver){
            return <h1 className="header">GAME OVER</h1>
        } else {
            return <h1 className="header">Which country's flag is this?</h1>;
        }
    }
}
/////////////////////////////////////////////////////////////////   
class Flag extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            time: 29,
            name: '',
            flag: '',
            points: 0,
            answer: null
        }
    }
    
    componentDidMount(){
        this.loadQuestion();
    }
    
    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }
    
    loadQuestion = () => {
        fetch('https://restcountries.eu/rest/v2/region/europe?fields=flag;name').then(resp => {
            if(resp.ok)
                return resp.json();
            else 
                throw new Error('Network error');
        }).then(resp => {
            const namesArray = [];
            const flagsArray = [];
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
        let input = document.querySelector('input');
        let inputVal = input.value;
        let correctAnswer = '';
        if((this.state.name).toUpperCase() == inputVal.toUpperCase()){
            console.log('ok');
            this.setState({
                points: this.state.points +1,
                answer: 'You were CORRECT!'
            })
            this.loadQuestion();
        } else {
            console.log(this.state.name);
            this.setState({
                answer: ['Wrong! It was ', 
                        this.state.name]
            })
            this.loadQuestion();
        }
        input.value = '';
    }
    
    render(){
            return <div>
                        <img className="flag-image" src={this.state.flag} />
                        <h2>{this.state.answer}</h2>
                        <Footer points={this.state.points} validate={this.validate} />
                        <Timer timeLeft={this.state.time}/>
                    </div>
       
    }
}
///////////////////////////////////////////////////////////
class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            time: this.props.timeLeft
        }
    }

    componentDidMount(){
        this.intervalId = setInterval(()=>{
            this.setState({
                time: this.state.time - 1,
            })
       },1000)
    }

    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    render(){
        if(this.state.time < 1){
            clearInterval(this.intervalId)
            return <h3 className="timer">Time's out!</h3>
        }
        else return <h3 className="timer">Time: {this.state.time}s</h3>
    }
}
////////////////////////////////////////////////////////// 
class Footer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOver: false
        }
    }

    componentDidMount(){
        this.nameInput.focus();
        this.timeoutId = setTimeout(() => {
            this.setState({
                isOver: true
            });
        },29000);
    }

    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }
    
    handleKeyPress = (event) => {
        if(event.key == 'Enter'){
            this.props.validate();
        }
    }

    render(){
        if(this.state.isOver){
            return <div>
                        <h2>Points: {this.props.points}</h2>
                    </div>;
        } else {
            return  <div>
                    <input className="answer-input" ref={(input) => {this.nameInput = input; }} type="text" onKeyPress={this.handleKeyPress}></input>
                    <button onClick={this.props.validate} type="submit">Enter</button>
                    <h3>Points: {this.props.points}</h3>
                    </div>
        }
    }
}
/////////////////////////////////////////////////////////////
class App extends React.Component {
    render() {
        return <div className="small-container">
                    <Header />
                    <Flag />
                </div>
    }
}
////////////////////////////////////////////////////////////
ReactDOM.render(
    <App />,
    document.getElementById('app')
);
});