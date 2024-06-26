import React, { useState, useEffect } from 'react'
import Video from '../assets/5star-single.mp4'
import Sound from '../assets/reveal-5star.ogg'

function CongratPage({ winner, continues }) {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFinished(true);
    }, 6700)
  }, [])

  const handleContinue = () => {
    console.log('continue')
    continues();
  }


  return (
    <div id='congrat-page' style={{ width: "100vw", height: "100vh", overflow: 'hidden' }}>
      {
        finished ?
          <div className='background'>
            <button className="close" onClick={handleContinue} style={{position: 'fixed', right: '2%', top: '30px'}}>
              <span>x</span>
            </button>
            <video autoPlay playsInline style={{ display: "none" }}>
              <source src={Sound} type="video/ogg" />
            </video>
            <div className="art-wrapper">
              <div
                className="out star5 orbs out1"
                style={{ animationDuration: '0.8s', animationDelay: '.1s', aspectRatio: '1/1' }}
              />
              <div className="out star5 orbs out2" style={{ animationDuration: '2s', aspectRatio: '1/1' }} />
              <div
                className="out star5 orbs out3"
                style={{ animationDuration: '1.2s', animationDelay: '.1s', aspectRatio: '1/1' }}
              />
              <div className="zoomist-wrapper splash-art anim" style={{ overflow: 'visible' }}>
                <div className="zoomist-image" style={{}}>
                  <img
                    src={new URL(`../assets/character/${winner}.png`, import.meta.url).href}
                  />
                </div>
              </div>
            </div>
            <div className='info'>
              <div className="name animate">
                <div className="text animate">
                  {winner}
                </div>

                <div className="star animate">
                  {
                    Array.from({ length: 5 }, (_, index) => index).map((_, i) => {
                      return (
                        <svg key={i} className="gi-star animate" style={{ animationDelay: 2 + i * 0.15 + 's' }} t="1709853664995" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1459" width="50" height="50"><path d="M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z" p-id="1460" fill="#f7cf33"></path></svg>
                      )

                    })
                  }
                </div>
              </div>
            </div>

          </div>
          :
          <video width="100%" height="100%" autoPlay
            playsInline style={{ minHeight: '100%', minWidth: '100%', objectFit: 'cover' }}>
            <source src={Video} type="video/mp4" />
          </video>
      }
    </div>)
}

export default CongratPage;