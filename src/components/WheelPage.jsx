import React, { useState } from 'react'
import { InputGroup, Form, Row, Button, Col } from 'react-bootstrap'
import NameCard from './NameCard'
import WheelComponent from './Wheel'
import CongratPage from './CongratPage'

const Main = () => {

  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [segments, setSegments] = useState([])
  const [names, setNames] = useState("")
  const [segColors, setSegColors] = useState([])
  const [winner, setWinner] = useState('')
  const [upDuration, setUpDuration] = useState(1000)
  const [downDuration, setDownDuration] = useState(3000)
 
  function generateDarkRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 50) + 50;
    const lightness = Math.floor(Math.random() * 35) + 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const continues = () => {
    console.log(segments)
    setIsFinished(false)
  }

  const add = () => {
    setSegments((oldSegments) => {
      const newTextElements = names.split(',').map(element => element.trim());
      const uniqueElements = newTextElements.filter(element =>
        !oldSegments.includes(element) && element !== ''
      );
      const randSegColors = newTextElements.map((_) => {
        return generateDarkRandomColor()
      })
      setSegColors((oldSegColors) => oldSegColors.concat(randSegColors))
      return oldSegments.concat(uniqueElements);
    })
  }

  const onFinished = (e) => {
    setWinner(e)
    setSegments((oldSegments) => {
      return oldSegments.filter((element) => {
        return element !== e
      })
    })
    setTimeout(() => {
      setIsFinished(true)
    }, 1000)
  }
  if (!isStarted) {
    return <>
      <div style={{ padding: 10 }}>
        <Row>
          {
            segments.map((el, idx) => {
              return <Col key={el}>
                <NameCard
                  name={el}
                  id={idx % 12 + 1}>
                </NameCard>
              </Col>
            })}
        </Row>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', padding: 10 }}>
        <Button style={{ width: '100%', height: 40 }} variant='light' onClick={() => {
          if (segments.length <= 1) {
            alert("请添加更多抽奖人")
            return;
          }
          setIsStarted(true)
        }
        }>开始</Button>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <InputGroup style={{ padding: 5 }}>
            <Form.Control as="textarea" value={names} placeholder='可使用逗号隔开抽奖人' aria-label="With textarea" onChange={(e) => setNames(e.target.value)} />
          </InputGroup>
          <Button style={{ height: '100%' }} variant='primary' onClick={add}>添加</Button>
        </div>
      </div>
    </>
  } else if (isFinished) {
    return (
      <CongratPage winner={winner} continues={continues} />
    )
  } else {
    return (
      <WheelComponent
        segments={segments}
        segColors={segColors}
        onFinished={(winner) => onFinished(winner)}
        primaryColor='black'
        contrastColor='white'
        buttonText='开始!'
        isOnlyOnce={false}
        size={300}
        upDuration={upDuration}
        downDuration={downDuration}
        fontFamily='Arial'
      />
    )
  }

}

export default Main