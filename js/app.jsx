import React from "react";
import ReactDOM from "react-dom";
require('../scss/style.scss');

document.addEventListener('DOMContentLoaded', function(){

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOver: false
        }
    }
    componentDidMount(){
        this.timeoutId = setTimeout(() => {
            this.setState({
                isOver: true
            });
        },9000);
    }
    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }
    render(){
        if(this.state.isOver){
            return <h1>GAME OVER</h1>
        } else {
            return <h1>Which country's flag is this?</h1>;
        }
    }
}
/////////////////////////////////////////////////////////////////   
class Flag extends React.Component {
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
        fetch('https://restcountries.eu/rest/v2/region/europe?fields=flag;name').then(resp => {
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
                <Footer points={this.state.points} validate={this.validate} />
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
            return <h2>0s</h2>
        }
        else return <h2>{this.state.time}s</h2>
    }
}
////////////////////////////////////////////////////////// 
class Footer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            time: 9,
            isOver: false
        }
    }

    componentDidMount(){
        this.timeoutId = setTimeout(() => {
            this.setState({
                isOver: true
            });
        },9000);
    }

    componentWillUnmount(){
        clearTimeout(this.timeoutId);
    }

    render(){
        if(this.state.isOver){
            return <div>
                        <h2>Points: {this.props.points}</h2>
                        <Timer />
                    </div>;
        } else {
            return  <div>
                        <h2>Answer: 
                        <input type="text"></input>
                        <button onClick={this.props.validate} type="submit">Submit</button>
                        Points: {this.props.points}
                        </h2>
                        <Timer timeLeft={this.state.time} />
                    </div>
        }
    }
}
/////////////////////////////////////////////////////////////
class App extends React.Component {
    render() {
        return <div>
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