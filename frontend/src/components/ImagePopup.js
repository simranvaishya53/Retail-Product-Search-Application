  import React, { useState } from 'react';
  import Modal from 'react-bootstrap/Modal';
  import Button from 'react-bootstrap/Button';
  import Carousel from 'react-bootstrap/Carousel';

  const ImagePopup = ({ images, show, handleClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageClick = (index) => {
      window.open(images[index]); // Open the image in a new tab
    };
    const modalStyle = {
      top: 0
    };

    const imageStyle = {
      maxWidth: '400px',
      maxHeight: '400px',
      objectFit: 'contain',
      border: '10px solid black',
      borderRadius: '5px'
    };

    return (
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="image-popup-modal"
        style={modalStyle}
      >
        <Modal.Header closeButton>
          <Modal.Title  style={{ fontSize: '14px' }}>Product Images</Modal.Title>
        </Modal.Header>

        <Modal.Body className="square-popup">
          <Carousel
            activeIndex={currentIndex}
            onSelect={setCurrentIndex}
            interval={null}
            prevIcon={<span>&#9001;</span>}
            nextIcon={<span>&#9002;</span>}
            indicators={false} // Remove the indicators
          >
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <div
                  className="image-container d-flex justify-content-center align-items-center"
                  onClick={() => handleImageClick(index)}
                >
                  <img src={image} alt={`Product Image ${index}`} style={imageStyle} />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default ImagePopup;
