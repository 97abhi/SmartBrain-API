import './App.css';
import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const app = new Clarifai.App({
  apiKey: 'd66f2876365b4dd39b5f03b6c113d61e'
 });

class App extends Component{
 constructor(){
  super();
  this.state = {
    input : '',
    imageUrl: '',
    box : {},
    route: 'SignIn',
    isSignedIn : false,
    user: {
      id:"",
            name :'',
            email : '',
            password: '',
            entries : 0,
            joined : new Date()
    }
  }
 }

loadUser = (data)=>{
  this.setState({user: {
            id:data.id,
            name :data.name,
            email : data.email,
            password: data.password,
            entries : data.entries,
            joined : data.joined
  }})
}

 calculateFaceLocation = (data) =>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width,height);
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }

 }

 displayFaceBox = (box) =>{
  console.log(box);
  this.setState({box : box});
 }

 onInputChange = (event) =>{
  console.log(event.target.value);
  this.setState({input: event.target.value})
 }

onButtonSubmit =  (event) =>{
  this.setState({imageUrl : this.state.input});
  app.models
  .predict(
    Clarifai.FACE_DETECT_MODEL,
    this.state.input)
  .then(response => {
    if (response) {
      fetch('http://localhost:3001/image',{
        method: 'put',
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                id : this.state.user.id
            })
      }).then(response => response.json())
      .then(count =>{
        this.setState(Object.assign(this.state.user, {entries : count}))
      })
      this.displayFaceBox(this.calculateFaceLocation(response));
    }
  })
  .catch(err => console.log(err));
}

onRoutechange = (route) =>{
  if (route === 'signOut') {
    this.setState({isSignedIn: false})
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render() {
  const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Navigation isSignedIn={isSignedIn} onRoutechange={this.onRoutechange} />
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
           route === 'SignIn'
           ? <SignIn  loadUser = {this.loadUser} onRoutechange={this.onRoutechange}/>
           : <Register  loadUser = {this.loadUser} onRoutechange={this.onRoutechange}/>
          )
      }
    </div>
  );
}
 }

export default App;
