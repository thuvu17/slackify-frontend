import React from "react";
import Container from "react-bootstrap/Container";
// import { Helmet } from "react-helmet";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
// import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Home() {
    return (
       <>
       <Container>
         <Row>
            <Card style={{ width: '23rem' }}>
               <Card.Img variant="top" src="./public/StockPng/workout_pic.png" />
               <Card.Body>
               <Card.Title>View Our Songs</Card.Title>
                  <Card.Text>
                     Packed with high-energy tracks, it is your go-to source for a powerful and motivating fitness experience. 
                     From heart-pounding beats to adrenaline-pumping melodies, elevate your workout with the perfect soundtrack. 
                     Make every rep count with Slackify!
                  </Card.Text>
                  <Button href="/songs">Go to Songs</Button>
               </Card.Body>
               </Card>
            </Row>
       </Container>
       </>

    );
  }
  
  export default Home;