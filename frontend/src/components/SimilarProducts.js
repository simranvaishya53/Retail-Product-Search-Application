import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SimilarProducts = () => {
  const similarProducts = useSelector((state) => state.similarProducts.itemSM);

  const [sortCategory, setSortCategory] = useState('Default');
  const [sortOrder, setSortOrder] = useState('Ascending');
  const [showMore, setShowMore] = useState(false);

  const handleSortChange = (category) => {
    setSortCategory(category);
    if (category === 'Default') {
      setSortOrder('Ascending');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'Ascending' ? 'Descending' : 'Ascending');
  };

  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);

    // Scroll to the bottom when "Show More" is clicked
    if (!showMore) {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth' // Optional: if you want a smooth scroll
      });
    } else {
      // Scroll to the top when "Show Less" is clicked
      window.scrollTo(0, 0);
    }
  };

  const sortedProducts = [...similarProducts].sort((a, b) => {
    if (sortCategory === 'Product Name') {
      return a.productName.localeCompare(b.productName);
    } else if (sortCategory === 'Days Left') {
      return a.daysLeft - b.daysLeft;
    } else if (sortCategory === 'Price') {
      return a.price - b.price;
    } else if (sortCategory === 'Shipping Cost') {
      return a.shippingCost - b.shippingCost;
    }
    return 0;
  });

  if (sortOrder === 'Descending') {
    sortedProducts.reverse();
  }

  return (
    (similarProducts.length ===0) ?
    <div className="container mt-4">
      <div className="row my-2 ">
        <div className="col-12 ">
          <div className="alert alert-warning " role="alert"  style={{ textAlign: 'left' }}>
            No Records.
          </div>
        </div>
      </div>
    </div>
    :   
    <Container className="mt-4">
      <Row className="mb-3">
      <Col xs={1}>
        <Dropdown className="d-inline mx-1">
          <Dropdown.Toggle variant="white" id="sortDropdown" style={{ border: '1px solid black' }}>
            Sort by: {sortCategory}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSortChange('Default')}>Default</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('Product Name')}>Product Name</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('Days Left')}>Days Left</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('Price')}>Price</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('Shipping Cost')}>Shipping Cost</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
       
        </Col>
        <Col xs={3} >
       
        <Dropdown className="d-inline mx-1">
            <Dropdown.Toggle
              variant="white"
              id="orderDropdown"
              style={{ border: '1px solid black' }}
              disabled={sortCategory === 'Default'} // Disable when Sort Category is "Default"
            >
          
            Sort Order: {sortOrder}
          </Dropdown.Toggle>
          <Dropdown.Menu>
              <Dropdown.Item onClick={toggleSortOrder}>Ascending</Dropdown.Item>
              <Dropdown.Item onClick={toggleSortOrder}>Descending</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
       
        </Col>
      </Row>

      <Row>
      
      {sortedProducts
  .slice(0, showMore ? sortedProducts.length : 5)
  .map((product, index) => (
    <div key={index} className="product-card bg-dark text-white container" style={{ display: 'flex', marginBottom: '20px', backgroundColor: 'dark', color: 'white', borderRadius: '5px', width: "1200px" }}>
      <div style={{ flex: '1' }}>
        <img src={product.imageURL} alt={product.productName} style={{ width: '200px', height: '200px', paddingTop:"15px", paddingBottom:"15px" }}/>
      </div>
      <div style={{ flex: '2', textAlign: 'left', paddingTop:"20px" }}>
        <p className="card-title" style={{ color: 'darkgreen' }}>{product.productName}</p>
        <p className="card-text" style={{ color: 'lightgreen' }}>Price: <span className="text-price" style={{ color: 'lightgreen' }}>${product.price}</span></p>
        <p className="card-text" style={{ color: 'orange' }}>Shipping Cost: <span className="text-shipping" style={{ color: 'orange' }}>${product.shippingCost}</span></p>
        <p className="card-text" style={{ color: 'white' }}>Days Left: <span className="text-days" style={{ color: 'white' }}>{product.daysLeft}</span></p>
      </div>
    </div>
      ))}
      
      </Row>

      {sortedProducts.length > 5 && (
        <Button onClick={toggleShowMore} style={{backgroundColor: 'black' , color:'white'}}>
          {showMore ? 'Show Less' : 'Show More'}
        </Button>
      )}
      {sortedProducts.length === 0 && <p>No Records</p>}
    </Container>
  );
};

export default SimilarProducts;
