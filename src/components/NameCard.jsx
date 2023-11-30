import { Card } from "react-bootstrap"

function NameCard(props) {

  return <Card style={{ width: 200, margin: 10}}>
    <Card.Body>
      <Card.Img variant="top" style={{width: '100%', height: 150}} src={'https://cssa-mini-na.oss-us-west-1.aliyuncs.com/cssa-mini-avatar/' + props.id + '.jpg'} />
      <Card.Title style={{padding: 5, fontSize: 36, fontWeight: 700}}>{props.name}</Card.Title>
    </Card.Body>
  </Card>
}

export default NameCard;