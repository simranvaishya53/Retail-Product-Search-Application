  import React from 'react'
  import { useSelector } from 'react-redux'
  import { Card, Col, Row } from 'react-bootstrap';


  function Photos() {

    const googlePhotos = useSelector((state) => state.googlePhotos.photos);

    if(googlePhotos !== null) {
      console.log(googlePhotos);
    }

    const handlePhotoClick = (link) => {
      window.open(link, '_blank');
    };

    return (
      <Row className="g-4">
        {googlePhotos.map((photo, index) => (
          <Col key={index} xs={4}>
            <Card 
            style={{ border: '10px solid black', borderRadius: '0' }}
            onClick={() => handlePhotoClick(photo.link)}>
              <Card.Img src={photo.link} alt={photo.name} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  export default Photos
