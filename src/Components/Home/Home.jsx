import React from "react";

function Home() {
    return (
       <>
          <div className="home-title">View Our Songs</div>
          <div className="home-body" style={{
             textAlign: 'center', color: 'white',
             fontSize: 20,
          }}>
            <p>From heart-pounding beats to adrenaline-pumping melodies, elevate your workout with the perfect soundtrack. </p>
             <p>Make every rep count with Slackify!</p></div>
          <img className="photo" src={require('.//assets/workout.jpeg')}></img>
       </>

    );
  }
  
  export default Home;