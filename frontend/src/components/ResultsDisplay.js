  import React from 'react';

  import ProgressBar from 'react-bootstrap/ProgressBar';
  import { useLocation } from 'react-router-dom';
  import SingleItemDisplay from './SingleItemDisplay';
  import { useNavigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import { useDispatch } from 'react-redux';
  import { fetchSingleItemDetails } from '../redux/singleItemDetailsSlice';
  import { fetchSimilarProducts } from '../redux/similarProductsSlice';
  import { fetchGooglePhotos } from '../redux/googlePhotosSlice';
  import { useState, useEffect } from 'react';
  import { useHistory } from 'react-router-dom';
  import Pagination from 'react-bootstrap/Pagination';
  import Tooltip from 'react-bootstrap/Tooltip';
  import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
  import  Table from 'react-bootstrap/Table';
  import { getFromWishlist } from '../redux/getMongoSlice';
  import { Button } from 'react-bootstrap';
  import { Link } from 'react-router-dom';

  function ResultsDisplay() {

      // useLocation is a hook from react-router-dom that allows us to access the location object
      const location = useLocation();

      // navigate to the single item page
      const navigate = useNavigate();

      const dispatch = useDispatch();

      // Access data from redux store for search results
      const selectedItem = useSelector((state) => state.searchResults.items);
      
        // Access data from redux store for single item details
      const singleItemDetails = useSelector((state) => state.singleItemDetails.item);

    
      // Access data from redux store for wishlist
      const wishlistBucket = useSelector((state) => state.wishlist.wishlistBucket);

      const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
      
    let handleTitleClick = (ItemId, Title) => {
            console.log("Title, ItemId", Title, ItemId);
            dispatch(fetchSingleItemDetails(ItemId));
            dispatch(fetchSimilarProducts(ItemId));
            dispatch(fetchGooglePhotos(Title));
            navigate('/singleItem');
            

    };

    // to togle the details button
    const [isDetailsButtonDisabled, setIsDetailsButtonDisabled] = useState(true);
    
    // to set the highlighted item
    const [highlightedItemId, setHighlightedItemId] = useState(null);

    useEffect(() => {
      if (selectedItem && selectedItem.itemId) {
        setHighlightedItemId(selectedItem.itemId);
      }
    }, [selectedItem]);

    
    useEffect(() => {
      if (singleItemDetails !== null) {
        setIsDetailsButtonDisabled(false);
      } else {
        setIsDetailsButtonDisabled(true);
      }
    }, [singleItemDetails]);


    const HandleDetailsCick = () => {
      navigate('/singleItem');
    };


    // For title to be added to the wishlist encoded title is required
    const cleanTitle = (Title) => {
      // Use a regular expression to remove special characters
      const cleanedTitle = Title.replace(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\\|]/g, '');
    
      return cleanedTitle;
    };


    // Add an item to the wishlist
    const handleAddToWishlist = (ItemID, Title, Image, Price, Shipping) => {

      const isInWishlist = Array.isArray(wishlistBucket) && wishlistBucket.some(wishlistItem => wishlistItem.ItemID === ItemID);

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

    const itemsPerPage = 10; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the first and last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Slice the items array to display only items for the current page
    const displayedItems = selectedItem.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(selectedItem.length / itemsPerPage);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const pageItems = [];
    for (let page = 1; page <= totalPages; page++) {
      pageItems.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

  
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



    // Access data from redux store
    const status = useSelector((state) => state.searchResults.status);

    // If the data is still loading, display a loading indicator
    if (  status === 'loading') {
      // Show a loading indicator while waiting for the data
      return (
        <div className='container mt-2'>
        <ProgressBar animated now={50} />
        </div>
      );
    }


    return (
      (selectedItem.length ===0) ?
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
      
      <div className='container'>
        <Button style={{ border: '1px solid black', color: "black", backgroundColor: "#f8f9fa", borderRadius:"0" }} disabled={isDetailsButtonDisabled} onClick={HandleDetailsCick}>
            <Link to="/singleItem" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: "black" }}>
              Details
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </Link>
          </Button>

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
              <th>Zipcode</th>
              <th>Wishlist</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item) => (
              <tr key={item.ItemId} style={item.ItemId === selectedItem.itemId ? {backgroundColor: 'yellow'} : null}>
                <td>{item.Index}</td>
                <td>
                  <a href={item.Image} target="_blank" rel="noopener noreferrer">
                    <img src={item.Image} alt={item.Title} style={{ width: '100px', height: '100px' }} />
                  </a>
                </td>
                <td>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.Title}</Tooltip>}>
                    <div
                      className="clickable-title truncate-text"
                      onClick={() => handleTitleClick(item.ItemId, item.Title)}
                      style={{color: 'blue'}}
                    >
                      {truncateText(item.Title, 35)}
                    </div>
                  </OverlayTrigger>
                </td>
                <td>${item.Price}</td>
                <td>{item.Shipping}</td>
                <td>{item.Zip}</td>
                <td>
                  {!Array.isArray(wishlistBucket) || !wishlistBucket.some(wishlistItem => wishlistItem.ItemID === item.ItemId) ? (
                    <button className='btn' style={{ backgroundColor: 'white' }} onClick={() => handleAddToWishlist(item.ItemId, item.Title, item.Image, item.Price, item.Shipping)}>
                      <span className="material-symbols-outlined" style={{ color: 'black' }}>
                        add_shopping_cart
                      </span>
                    </button>
                  ) : (
                    <button className="btn" style={{ backgroundColor: 'white' }} onClick={() => handleRemoveFromWishlist(item.ItemId)}>
                      <span className="material-symbols-outlined" style={{ color: 'orange' }}>remove_shopping_cart</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  </div>



        <div className="d-flex justify-content-center">
        <Pagination className="custom-pagination">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="underline-on-hover no-border-radius"
          >
            &laquo; {/* This is the left double angle quote character */}
            Previous
          </Pagination.Prev>
          {pageItems}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="underline-on-hover no-border-radius"
          >
            Next
            &raquo; {/* This is the right double angle quote character */}
            
          </Pagination.Next>
        </Pagination>
        </div>
        
      </div>
    );
  }



  export default ResultsDisplay;



