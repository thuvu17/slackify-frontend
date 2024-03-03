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
            <Card className="home-card" style={{ width: '18rem' }}>
               <Card.Img variant="top" src="./public/logo192.png"/>
               <Card.Body>
               <Card.Title className="card-title">View Our Songs</Card.Title>
                  <Card.Text> 
                     From heart-pounding beats to adrenaline-pumping melodies, elevate your workout with the perfect soundtrack. 
                     Make every rep count with Slackify!
                  </Card.Text>
                  <a href="/songs">
                     <Button className="home-button">Go to Songs</Button>
                  </a>
               </Card.Body>
               </Card>
            </Row>
       </Container>
       </>

    );
  }
  
  export default Home;