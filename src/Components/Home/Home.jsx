import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from '../../constants';
// import SongsObjectToArray from '../Songs/Songs';
import AddToPlaylistPopup from '../AddToPlaylistPopup/AddToPlaylistPopup';

const SONG_REC_EP = `${BACKEND_URL}/rec`;
const SONG_REC_AVG_STRIDE_EP = `${SONG_REC_EP}/avg_stride`;
const SONG_REC_ENERGY_EP = `${SONG_REC_EP}/workout`
// const SONG_REC_STRIDE_EP = `${SONG_REC_EP}/stride`;
// const SONG_REC_HEIGHT_EP = `${SONG_REC_EP}/height`;


function Home() {
   const [speed, setSpeed] = useState("");
   const [gender, setGender] = useState("");
   const [exercise, setExercise] = useState("");
   const [recommendedSongs, setRecommendedSongs] = useState([]);

   const changeExercise = (event) => { setExercise(event.target.value); };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         let response;
         if (exercise === "jog") {
            response = await axios.get(`${SONG_REC_AVG_STRIDE_EP}/${speed}/${gender}`);
         } else {
            response = await axios.get(`${SONG_REC_ENERGY_EP}/${exercise}`);
         }
         console.log(response.data)
         setRecommendedSongs((response.data));
      } catch (error) {
         console.error("Error fetching recommended song:", error);
         console.log(error);
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

         {recommendedSongs && (
            <div>
                  <div className='song-container' key={recommendedSongs._id}>
                  <div className='playlist-song-subcontainer'>
                     <h2>{recommendedSongs.name}</h2>
                  </div>
                  <div className='song-subcontainer'>
                     <div>
                        <p>Aritst: {recommendedSongs.artist}</p>
                        <p>Album: {recommendedSongs.album}</p>
                        <p>Energy: {recommendedSongs.energy}</p>
                        <p>BPM: {recommendedSongs.bpm}</p>
                     </div>
                     <div className='song-buttons'>
                        <AddToPlaylistPopup
                           name={recommendedSongs.name}
                           artist={recommendedSongs.artist}
                           song_id={recommendedSongs._id}
                        />
                     </div>
                  </div>
               </div>
          </div> 
         )}
      </>

   );
  }
  
  export default Home;