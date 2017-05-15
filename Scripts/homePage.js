const colorArr = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'cyan',
  'brown',
  'yellow',
  'lightblue'
];

class HelloWorld extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      display: 'none'
    };
  }
  
  componentDidMount(){
    let colorPos = 0;
    setInterval(() => {
      if(colorArr.length - 1 > colorPos){
        this.setState({
          color: colorArr[colorPos]
        });
        //colorPos++;
      }
      else{
        this.setState({
          color: colorArr[colorPos]
        });
        colorPos = 0;
      }
    }, 700);
  }
  
  toggleDisplay(){
    this.setState({
    display: 'block'
    });
  }
  
  changeColor(event){
    this.setState({
      color: event.target.value
    });
  }
  
  render(){
    const styleObj = {
      backgroundColor: this.state.color
    };
    
    return (
      <section style={styleObj} id='hellow-world'>
        <h2 onmouseover={this.toggleDisplay.bind(this)}>{this.state.display}</h2>
        <input value={this.state.color} onChange={this.changeColor.bind(this)}/>
      </section>
    );
  }
}

ReactDOM.render(<HelloWorld name='Jeff' />, document.getElementById('schoolList'));