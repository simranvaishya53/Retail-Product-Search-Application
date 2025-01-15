import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/esm/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSingleItemDetails } from '../redux/singleItemDetailsSlice';
import { fetchSimilarProducts } from '../redux/similarProductsSlice';
import { fetchGooglePhotos } from '../redux/googlePhotosSlice';
import { useSelector } from 'react-redux';
import { getFromWishlist } from '../redux/getMongoSlice';

function Wishlist() {

 
  const [totalShoppingCost, setTotalShoppingCost] = useState(0);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [updateFlag, setUpdateFlag] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

    const items = useSelector((state) => state.wishlist.wishlistBucket || []);

    
  let handleTitleClick = (ItemId, Title) => {
    console.log("Title, ItemId", Title, ItemId);
    dispatch(fetchSingleItemDetails(ItemId));
    dispatch(fetchSimilarProducts(ItemId));
    dispatch(fetchGooglePhotos(Title));
    navigate('/singleItem');

};

  // Remove an item from the wishlist
  const handleRemoveFromWishlist = (ItemID) => {

    // Send a GET request to the server to remove the item
    fetch(`${BASE_URL}/wishlist/remove?ItemID=${ItemID}`, {
      method: 'GET',
    })
      .then((response) => {
        if (response.status === 200) {
          // After successfully removing the item, update the state
          dispatch(getFromWishlist());
          console.log('Item removed from the wishlist.');
        } else if (response.status === 404) {
          console.error('Item not found in the wishlist.');
        } else {
          console.error('Error removing item from the wishlist.');
        }
      })
      .catch((error) => {
        console.error('Error sending the GET request:', error);
      });

  };

const renderTooltip = (name) => (
    <Tooltip id="name-tooltip">{name}</Tooltip>
  );

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      return `${truncatedText.substring(0, lastSpaceIndex)}...`;
    } else {
      return `${truncatedText}...`;
    }
  };



  useEffect(() => {
    // Calculate the total shopping cost by summing up the prices
    const totalPrice = items.reduce((total, item) => total + parseFloat(item.Price || 0), 0);
    setTotalShoppingCost(totalPrice);
  }, [items]); // Recalculate whenever items change


  return (
    (!items.length) ?
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
    <div>
    <div className='container'>
    <div className='row justify-content-center'>
    <div className='col-lg-11 col-md-3'>
      <Table striped hover variant='dark'>
      <thead>
        <tr>
          <th>Index</th>
          <th>Image</th>
          <th>Title</th>
          <th>Price</th>
          <th>Shipping</th>
          <th>Wishlist</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, key) => (
        
          <tr key={item.key}>
            <td>{item.key}</td>
            <td>
              <img src={item.Image} alt={item.Title} style={{ width: '50px' }} />
            </td>
            <td>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{item.Title}</Tooltip>}
              >
                <div
                  className="clickable-title truncate-text"
                  onClick={() => handleTitleClick(item.ItemID, item.Title)}
                  style={{color: 'blue'}}
                >
                  {truncateText(item.Title, 35)}
                </div>
              </OverlayTrigger>
            </td>
            <td>${item.Price}</td>
            <td>{item.Shipping}</td>
            <td>
            <button className="btn" style={{ backgroundColor: 'white' }} onClick={() => handleRemoveFromWishlist(item.ItemID)}>
                <span className="material-symbols-outlined" style={{ color: 'orange' }}>remove_shopping_cart</span>
            </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
                <tr>
                  {/* Spanning across all the columns except the last one */}
                  <td colSpan="4" className='text-end' style={{textAlign: "right"}}>Total Shopping:</td>
                  {/* Total price in the last column */}
                  <td>${totalShoppingCost.toFixed(2)}</td>
                  {/* Empty cell for the column where the remove button would normally be */}
                  <td></td>
                </tr>
              </tfoot>
    </Table>
    </div>
    
     </div>
     </div>
     </div>
  );
}

export default Wishlist;
