import { Card, Button } from "react-bootstrap"

function NameCard({name}) {

  return <Card style={{ width: 200, margin: 10}}>
    <Card.Body>
      <Card.Img variant="top" style={{width: '100%', height: 150}} src={new URL(`../assets/character/${name}.png`, import.meta.url).href} />
      <Card.Title style={{padding: 5, fontSize: 36, fontWeight: 700}}>{name}</Card.Title>
    </Card.Body>
  </Card>
}

export default NameCard;