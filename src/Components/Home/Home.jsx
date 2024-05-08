import React, { useState } from "react";
import axios from "axios";

const SONG_REC_EP = '/rec';
const SONG_REC_AVG_STRIDE_EP = `${SONG_REC_EP}/avg_stride`;
// const SONG_REC_STRIDE_EP = `${SONG_REC_EP}/stride`;
// const SONG_REC_HEIGHT_EP = `${SONG_REC_EP}/height`;

function Home() {
   const [speed, setSpeed] = useState("");
   const [gender, setGender] = useState("");
   const [exercise, setExercise] = useState("");
   const [recommendedSong, setRecommendedSong] = useState("");

   const changeExercise = (event) => { setExercise(event.target.value); };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.get(`${SONG_REC_AVG_STRIDE_EP}/${speed}/${gender}`);
         setRecommendedSong(response.data);
      } catch (error) {
         console.error("Error fetching recommended song:", error);
      }
   };
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
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ width: '300px', textAlign: 'center' }}>
               <div>
                  <p>What exercise are you doing today?</p>
                  <select id="exercise" name="exercise" onChange={changeExercise}>
                     <option value="yoga">Yoga</option>
                     <option value="pilates">Pilates</option>
                     <option value="jog">Walking/Jogging/Running</option>
                     <option value="cycling">Cycling</option>
                     <option value="lifting">Weightlifting</option>
                     <option value="boxing">Boxing</option>
                     <option value="aerobics">Aerobics</option>
                     </select>
               </div>
               <div style={{ display: exercise === "jog" ? 'block' : 'none' }}>
                  <div>
                     <p>Running Speed (mph):</p>
                     <input type="text" value={speed} onChange={(e) => setSpeed(e.target.value)} />
                  </div>
                  <div>
                     <p>Gender:</p>
                     <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                     </select>
                     
                  </div> 
                  
               </div>
               <button type="submit">Get Song</button>
            </form>           
         </div>

          {recommendedSong && (
            <div className="recommended-song">
              Get Song: {recommendedSong}
            </div>
          )}
      </>

   );
  }
  
  export default Home;