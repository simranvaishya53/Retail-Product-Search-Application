  // NavBar.js

  import React from 'react';
  import { Link, Outlet } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import Button from 'react-bootstrap/Button';
  import ProgressBar from 'react-bootstrap/ProgressBar';
  import { useLocation } from 'react-router-dom';
  import { useDispatch } from 'react-redux';
  import { getFromWishlist } from '../redux/getMongoSlice';
  import { FacebookShareButton, FacebookIcon } from 'react-share';
  import { Table } from 'react-bootstrap';
  import { FaFacebookSquare  } from 'react-icons/fa'; // Importing Facebook icon

  const NavBar = () => {

    const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

      const dispatch = useDispatch();
      const location = useLocation();

      // get the data of the item from the redux store
      const selectedItem = useSelector((state) => state.singleItemDetails.item);

      // Access result data from redux store for search results
      const resultData = useSelector((state) => state.searchResults.items);

    // Access data from redux store for wishlist
    const wishlistBucket = useSelector((state) => state.wishlist.wishlistBucket || []);

    // Check if the selectedItem is not null and find the matching item in resultData
    const matchingItemDetails = selectedItem && resultData.find(item => item.ItemId === selectedItem?.ItemId);

    const isitInWishlist = selectedItem && wishlistBucket.some(wishlistItem => wishlistItem.ItemID === selectedItem.ItemId);

    const status = useSelector((state) => state.singleItemDetails.status);

    // This function checks if the path exactly matches the given route
    const isActive = (route) => {
      // Assuming your route structure is such that 'product' is at the root like "/product"
      return location.pathname === (route === 'product' ? '/singleItem' : `/singleItem/${route}`);
    };

    const activeStyle = {
      backgroundColor: 'black',
      color: 'white'
    };

    const inactiveStyle = {
      backgroundColor: 'transparent',
      color: 'black',
    };

    const cleanTitle = (Title) => {
      // Use a regular expression to remove special characters
      const cleanedTitle = Title.replace(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\\|]/g, '');
    
      return cleanedTitle;
    };

    // // Add an item to the wishlist
    const handleAddToWishlist = (ItemID, Title, Image, Price, Shipping) => {

      const isInWishlist = Array.isArray(wishlistBucket) && wishlistBucket.some(wishlistItem => wishlistItem.ItemID === selectedItem.ItemId);

      const cleanedTitle = cleanTitle(Title);
      const encodedTitle = encodeURIComponent(cleanedTitle);

      const itemData = {
        ItemID: ItemID,
        Title: encodedTitle,
        Image: Image,
        Price: Price,
        Shipping: Shipping,
      };
      // Construct the URL with query parameters

    if(!isInWishlist){

          const baseUrl = `${BASE_URL}/addItem`;
          const queryParams = Object.keys(itemData)
            .map((key) => `${key}=${itemData[key]}`)
            .join('&');
          const url = `${baseUrl}?${queryParams}`;
          console.log("url", url);
          // Send a GET request to the server to add the item
          fetch(url, {
            method: 'GET',
          })
            .then((response) => {
              if (response.status === 200) {
                console.log('Item added to the database.');
                console.log('response from mongodb for adding', response);
                dispatch(getFromWishlist());
                // You can update your UI to show a success message or perform other actions.
              } else {
                console.error('Error adding item to the database.');
                // Handle errors here.
              }

            })
            .catch((error) => {
              console.error('Error sending the GET request:', error);
            });
      }
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

    const handleFacebookShare = () => {
      if (selectedItem.title && selectedItem.price && selectedItem.viewitemurlfornaturalsearch) {
        const productName = selectedItem.title;
        const productPrice = selectedItem.price;
        const productLink = selectedItem.viewitemurlfornaturalsearch;
        const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productLink)}`;
        // Specify the width and height of the new window
        const width = 1920, height = 1080;
      // Open the window covering the entire screen
      window.open(facebookShareURL, 'facebook-share-dialog', `width=${width},height=${height}`);
      }
    };
    
    
      // if the item is not selected, return null
      if (  status == 'loading') {
          // Show a loading indicator while waiting for the data
          return (
            <div className='container mt-2'> 
            <ProgressBar animated now={45} />
            <br />
            <Table striped hover variant='dark'>
              <thead>
                <tr>
                  <th>Product Images</th>
                  <th>
                    <a href="#" target="_blank" className="text-success" style={{textDecoration: 'none'}}>View Product Images here</a>
                  </th>
                </tr>
              </thead>
            </Table>
            </div>
          );
        }

        // if the item is not selected, return no records found
        


    return (
      <div className="container">
      <div className='col-lg-11 col-md-10'>
        
          <p className='mt-3'>{selectedItem.title}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side */}
            <Button style={{ border: '1px solid black', color: "black", backgroundColor: "#f8f9fa" }}>
            <Link to="../results" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: "black" }}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
              List
            </Link>
          </Button>


    {/* Right side */}
    <div>
      {/* Facebook Share Button */}
      <FaFacebookSquare style={{color:'#3b5998', backgroundColor: 'white', width: '50px', height:'50px' }} onClick={handleFacebookShare} />

      {isitInWishlist ? (
        // If the item is in the wishlist, show the "Remove from Cart" button
        <button className="btn" style={{ backgroundColor: 'white', marginRight: '10px', width: '50px', height:'50px' }} onClick={() => handleRemoveFromWishlist(selectedItem.ItemId)}>
          <span className="material-symbols-outlined" style={{ color: 'orange' }}>remove_shopping_cart</span>
        </button>
      ) : (
        // If the item is not in the wishlist and matchingItemDetails is found, show the "Add to Cart" button
        matchingItemDetails && (
          <button className='btn' style={{ backgroundColor: 'white', marginRight: '10px', width: '50px', height:'50px' }} onClick={() => handleAddToWishlist(matchingItemDetails.ItemId, matchingItemDetails.Title, matchingItemDetails.Image, matchingItemDetails.Price, matchingItemDetails.Shipping)}>
            <span className="material-symbols-outlined" style={{ color: 'black' }}>
              add_shopping_cart
            </span>
          </button>
        )
      )}
      
    </div>
  </div>
  </div>
          
          <ul className="nav nav-tabs justify-content-end">
          {/* Adjust the `to` attribute if your routing is different */}
          <li className="nav-item">
            <Link to="/singleItem" className="nav-link" style={isActive('product') ? activeStyle : inactiveStyle}>Product</Link>
          </li>
          <li className="nav-item">
            <Link to="photos" className="nav-link" style={isActive('photos') ? activeStyle : inactiveStyle}>Photos</Link>
          </li>
          <li className="nav-item">
            <Link to="shipping" className="nav-link" style={isActive('shipping') ? activeStyle : inactiveStyle}>Shipping</Link>
          </li>
          <li className="nav-item">
            <Link to="seller" className="nav-link" style={isActive('seller') ? activeStyle : inactiveStyle}>Seller</Link>
          </li>
          <li className="nav-item">
            <Link to="similar-products" className="nav-link" style={isActive('similar-products') ? activeStyle : inactiveStyle}>Similar Products</Link>
          </li>
        </ul>
        <Outlet />
    
      </div>
    );
  };

  export default NavBar;
