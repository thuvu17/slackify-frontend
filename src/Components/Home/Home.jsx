import React, { useState } from "react";
import axios from "axios";

const SONG_REC_EP = '/rec';
const SONG_REC_AVG_STRIDE_EP = `${SONG_REC_EP}/avg_stride`;
// const SONG_REC_STRIDE_EP = `${SONG_REC_EP}/stride`;
// const SONG_REC_HEIGHT_EP = `${SONG_REC_EP}/height`;

function Home() {
   const [speed, setSpeed] = useState("");
   const [gender, setGender] = useState("");
   const [recommendedSong, setRecommendedSong] = useState("");

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
         <form onSubmit={handleSubmit}>
            <label>
              Running Speed (mph):
              <input type="text" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            </label>
            <label>
              Gender:
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </label>
            <button type="submit">Get Song</button>
          </form>
          {recommendedSong && (
            <div className="recommended-song">
              Get Song: {recommendedSong}
            </div>
          )}
      </>

   );
  }
  
  export default Home;