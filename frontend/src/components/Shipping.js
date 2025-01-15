import React from 'react'
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';


function Shipping() {

  const searchResults = useSelector((state) => state.searchResults.items);
  const singleItemDetails = useSelector((state) => state.singleItemDetails.item);

  if (!searchResults || !singleItemDetails) {
    return null; // Handle the case when data is not available
  }

  // Assuming that item IDs are unique, find the matching item from singleItemDetails
  const matchedItem = searchResults.find((item) => item.itemId === singleItemDetails.itemId);

  return (
    <div className='container'>
    <div className='row justify-content-center'>
    <div className='col-lg-11 col-md-3'>
    <Table striped hover variant="dark" className="text-white mx-2" >
        <colgroup>
        <col class="col-first"/>
        <col class="col-second"/>
      </colgroup>
      <tbody>
        <tr>
          <td className='text-start'>Shipping</td>
          <td className='text-start'>{matchedItem.Shipping}</td>
        </tr>
        <tr>
          <td className='text-start'>Shipping Location</td>
          <td className='text-start'>{matchedItem.ShippingLocation}</td>
        </tr>
        <tr>
          <td className='text-start'>Handling Time</td>
          <td className='text-start'>{matchedItem.HandlingTime > 1 ? `${matchedItem.HandlingTime} Days` : `${matchedItem.HandlingTime} Day`}</td>
        </tr>
        <tr>
          <td className='text-start'>Expedited Shipping</td>
          <td className='text-start'>{matchedItem.ExpeditedShipping ? <i className="material-icons green">check</i> : <i className="material-icons red">cancel</i>}</td>
        </tr>
        <tr>
          <td className='text-start'>One Day Shipping Available</td>
          <td className='text-start'>{matchedItem.OneDayShippingAvailable ? <i className="material-icons green">check</i> : <i className="material-icons red">cancel</i>}</td>
        </tr>
        <tr>
          <td className='text-start'>Returns Accepted</td>
          <td className='text-start'>{matchedItem.ReturnsAccepted ? <i className="material-icons green">check</i> : <i className="material-icons red">cancel</i>}</td>
        </tr>
      </tbody>
    </Table>
    </div>
    </div>
    </div>
  );
};

export default Shipping
