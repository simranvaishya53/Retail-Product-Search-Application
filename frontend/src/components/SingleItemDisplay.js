// SingleItemDisplay.js
import React, {useState} from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ImagePopup from './ImagePopup.js';
import { Tab } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

function SingleItemDisplay() {

   // useLocation is a hook from react-router-dom that allows us to access the location object
   const location = useLocation();

   // Access data from redux store
   const selectedItem = useSelector((state) => state.singleItemDetails.item);
  
   const [showImagePopup, setShowImagePopup] = useState(false);

   const openImagePopup = () => {
     setShowImagePopup(true);
   };
 
   const closeImagePopup = () => {
     setShowImagePopup(false);
   };
 

    const status = useSelector((state) => state.singleItemDetails.status);
    // if the item is not selected, return null
    if (  status === 'loading') {
      // Show a loading indicator while waiting for the data
      return (
        <div>
         <ProgressBar animated now={45} />
        </div>
      );
    }


  // Create rows for itemSpecifics
  const itemSpecificsRows = selectedItem.itemSpecifics.map((specific) => (
    <tr key={specific.name}>
      <td className='text-start'>{specific.name}</td>
      <td className='text-start'>{specific.value[0]}</td>
    </tr>
  ));
  

  
  // Render Return Policy section
  const renderReturnPolicy = () => {
    if (selectedItem.returnAccepted && selectedItem.returnAccepted !== 'ReturnsNotAccepted') {
      return (
        <tr>
          <td className='text-start'>Return Policy</td>
          <td className='text-start'>
            {selectedItem.returnAccepted}
            {selectedItem.returnWithin ? ` within ${selectedItem.returnWithin}` : ''}
          </td>
        </tr>
      );
    }
    return (
      <tr className='text-start'>
        <td>Return Policy</td>
        <td className='text-start'>{selectedItem.returnAccepted}</td>
      </tr>
    );
  };
  
  return (
    <div className='container'>
    <div className='row justify-content-center'>
    <div className='col-lg-11 col-md-3'>
      
      <Table striped hover variant="dark" className="text-white mx-2" >
      <tbody>
        <tr>
          <td  className='text-start'>Product Images</td>
          <td className="text-start" >
            <a href="#" onClick={openImagePopup} className="text-success" style={{textDecoration: 'none'}}>
              View Product Images Here
            </a>
            {/* Assuming ImagePopup is a component you have created */}
            <ImagePopup images={selectedItem.productImages} show={showImagePopup} handleClose={closeImagePopup} />
          </td>
        </tr>
        <tr>
          <td className='text-start'>Price</td>
          <td className="text-start">${selectedItem.price}</td>
        </tr>
        <tr>
          <td className='text-start'>Location</td>
          <td className="text-start">{selectedItem.location}</td>
        </tr>
        {/* Insert renderReturnPolicy and itemSpecificsRows */}
        {renderReturnPolicy()}
        {itemSpecificsRows}
      </tbody>
    </Table>
    </div>
    </div>
    </div>
  );
  
}

export default SingleItemDisplay;
