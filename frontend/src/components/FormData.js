
  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { useDispatch } from 'react-redux';
  import { fetchSearchResults, clearSearchResults } from '../redux/searchResultsSlice';
  import { Button } from 'react-bootstrap';
  import Autocomplete from '@mui/material/Autocomplete';
  import TextField from '@mui/material/TextField';
  import { fetchZipCode } from '../redux/zipCodeSlice';
  import { useSelector } from 'react-redux';



  export default function FormData() {


    // navigate to the results page
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

    
  // create forData as an object with all the fields
    let [formData, setFormData] = useState({
      keyword: '',
      category: 'all',
      conditions: [], // Store selected conditions as an array
      shippingOptions: [], // Store selected shipping options as an array
      distance: 10,
      location: 'current', 
      zipCode: '',
    });



    const [locationInputDisabled, setLocationInputDisabled] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(''); // Store the current location
  
    const location = useLocation();


    // get the suggestions of zipcode from the redux store
    const zipSuggestions = useSelector((state) => state.zipCode.suggestions) || [];
    // const zipSuggestions = [{ zipCode: '12345' }, { zipCode: '23456' }]; 

    const getButtonStyle = (buttonPath) => {
      const currentPath = location.pathname;
      // Highlight the Wishlist button only if the current path is /wishlist
      if (buttonPath === '/wishlist' && currentPath === '/wishlist') {
        return { backgroundColor: 'black', color: 'white' };
      }
      // Always highlight the Results button for all other paths
      else if (buttonPath === '/results' && currentPath !== '/wishlist') {
        return { backgroundColor: 'black', color: 'white' };
      }
      // Default style for non-highlighted buttons
      else {
        return { backgroundColor: 'white', color: 'black' };
      }
    };
    
    
    

    //this is the object that will hold all the errors for each field
    const [formError, setFormError] = useState({
      keyword: '',
      zipCode: '',
    }) 

  // this the respnse data that will be returned from the api call from the backend
  const [responseData, setResponseData] = useState(null);

  // to disable the search button by default and enable it only when keyword and zipCode are entered
  const [isSearchButtonDisabled, setSearchButtonDisabled] = useState(true);
  const [isKeywordBlurred, setKeywordBlurred] = useState(false);
  // const [zipData,setZipData]=useState();



  const keywordInputRef = useRef(false);
  const zipcodeInputRef = useRef(null);


    const validateKeyword = () => {
      if (keywordInputRef.current && formData.keyword.trim() === '') {
        setFormError((prevErrors) => ({
          ...prevErrors,
          keyword: 'Keyword is required',
        }));
      } else {
        setFormError((prevErrors) => ({
          ...prevErrors,
          keyword: '',
        }));
      }
    };

    const validateZipCode = () => {
      // Assuming your formData has a zipCode property that holds the actual zip code value
      const zipCode = formData.zipCode;

      // Check if the location is 'otherLocation' and the zipCode is not entered or invalid
      if (formData.location === 'otherLocation' && !zipCode) {
        setFormError((prevErrors) => ({
          ...prevErrors,
          zipCode: 'Zip code is required',
        }));
      } else {
        // If the location is not 'otherLocation' or if a zip code is entered, clear the error
        setFormError((prevErrors) => ({
          ...prevErrors,
          zipCode: '',
        }));
      }
    };



    // handle the input change
      const handleInputChange = (e, value) => {

        const inputText = e.target.value; // Directly from the event now
        const zipCodeLength = inputText.length;

        if (zipCodeLength === 3) {
          dispatch(fetchZipCode(inputText));
        }
    

      if(e.target.name === 'conditions') {
        let copy = { ...formData }
        if(e.target.checked) {
          copy.conditions.push(e.target.value)  // add the checked value to the array
        } else {
          copy.conditions = copy.conditions.filter(el => el !== e.target.value) // remove the unchecked value from the array
        }
        setFormData(copy)
      } else if(e.target.name === 'shippingOptions') {
        let copy = { ...formData }
        if(e.target.checked) {
          copy.shippingOptions.push(e.target.value)
        } else {
          copy.shippingOptions = copy.shippingOptions.filter(el => el !== e.target.value)
        }
        setFormData(copy)
      } else if(e.target.name === 'zipCode') {

        setFormData(() => ({
          ...formData,
          zipCode: e.target.value
        }))

        
      } 
      else {
        setFormData(() => ({
          ...formData,                // this is the spread operator which copies all the fields from the formData object and then we are only changing the field that we want to change
          [e.target.name]: e.target.value
        }))
      }

      // const isFormValid = validateKeyword();
    setSearchButtonDisabled(false);

    }

    // handle the location change
    const handleLocationChange = (e) => {

      const locationType = e.target.value;
      if (locationType === 'current') {
        // Set the location to the API call value when "Current Location" is selected
        setFormData((prevFormData) => ({
          ...prevFormData,
          location: "current",
        }));
      } else if (locationType === 'otherLocation') {
        
        setFormData((prevFormData) => ({
          ...prevFormData,
          location: "otherLocation",
        }));
        validateZipCode();
      }
      
      else {
        // Set the location to the value entered by the user when "Other Location" is selected
        // setCurrentLocation("zipcode")
        setFormData((prevFormData) => ({
          ...prevFormData,
          location: "otherLocation",
        }));
      }
      setLocationInputDisabled(locationType === 'current');
    }
    

  // For fetching the current location
    useEffect(() => {
      if(locationInputDisabled && location.pathname === '/')
      {
      fetch('https://ipinfo.io/json?token=082f647f55996a')
        .then((response) => response.json())
        .then((data) => {
          setCurrentLocation(data.postal);
          console.log("The current location", data.postal)
          if (formData.location === 'current') {
            setFormData((prevFormData) => ({
              ...prevFormData,
              zipCode: data.postal,
            }));
          }
        })
        .catch((error) => {
          console.error('Error fetching current location:', error);
        });
      }
      // effectTriggerRef.current = false;
    },[locationInputDisabled, location.pathname]);
    

    // Clear the form
    const handleClear = () => {

      setFormData({
        keyword: '',
        category: 'all',
        conditions: [],
        shippingOptions: [],
        distance: 10,
        location: 'current',
        zipCode: '',
      });

      
      if (zipcodeInputRef.current) {
        zipcodeInputRef.current.value = ''; // Directly reset the value of the input if necessary
      }

      dispatch(clearSearchResults());

      // Navigate to the default route
      navigate('/');
    }


    // handle the form submission
    let onSubmitHandler = (event) => {
      event.preventDefault()
      console.log("form data in formdata.js" , formData)
      dispatch(fetchSearchResults(formData));
      navigate('/results');
    }


    return (
      <>
      <div className="container bg-dark p-4 rounded">
        <h2 className='text-white'>Product Search</h2> 
        <div className="container justify-content-center">
        <form onSubmit={onSubmitHandler}>
              <div className="mb-3 row">
                  <label htmlFor="keyword" className="col-sm-2 col-form-label text-white">Keyword</label>
                  <div className="col-sm-3">
                    <input
                      type="text"
                      className={`form-control ${formError.keyword ? 'is-invalid' : ''}`}
                      id="keyword"
                      name="keyword"
                      placeholder="Enter Product Name (e.g. iPhone 8)"
                      ref={keywordInputRef}
                      onChange={handleInputChange}
                      value={formData.keyword}
                      onBlur={() => {
                        keywordInputRef.current = true;
                        setKeywordBlurred(true);
                        validateKeyword();
                      }}
                />
                </div>
                
                {formError.keyword && <div className="text-danger">{formError.keyword}</div>}
          
              </div>

            {/* Category Selection */}
            <fieldset className="mb-3 row">
              
              <legend htmlFor="category" className='col-sm-2 col-form-label text-white'>Category</legend>
                
                <div className="col-sm-2">
                <select
                  className="form-select" aria-label="Default select example"
                  id="category"
                  name="category"
                  onChange={handleInputChange}
                  value={formData.category}
                >
                
                  <option value="all">All Categories</option>
                  <option value="art">Art</option>
                  <option value="baby">Baby</option>
                  <option value="books">Books</option>
                  <option value="clothing">Clothing, Shoes & Accessories</option>
                  <option value="computers">Computers/Tablets & Networking</option>
                  <option value="health">Health & Beauty</option>
                  <option value="music">Music</option>
                  <option value="video">Video Games and Consoles</option>
                </select>
                </div>
          </fieldset>


          {/* Condition Options */}
          <fieldset className="mb-3 row">
          <legend className="col-form-label col-sm-2 pt-0 text-white">Condition</legend>
          <div className="col-sm-3">
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="new" name="conditions" value="new" onChange={handleInputChange}  checked={formData.conditions.indexOf('new') !== -1}/>
              <label className="form-check-label text-white" htmlFor="new">New</label>
            </div>

            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="used" name="conditions" value="used" onChange={handleInputChange}
            checked={formData.conditions.indexOf('used') !== -1}/>
              <label className="form-check-label text-white" htmlFor="used">Used</label>
            </div>

            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="unspecified" name="conditions" value="unspecified" onChange={handleInputChange} checked={formData.conditions.indexOf('unspecified') !== -1}/>
              <label className="form-check-label text-white" htmlFor="unspecified">Unspecified</label>
            </div>
          </div>
          </fieldset>

          {/* Shipping Options */}
          <fieldset className="mb-3 row">
            <label className='col-form-label col-sm-2 pt-0 text-white'>Shipping Options</label>
            <div className="col-sm-3">
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="localPickup"
                name="shippingOptions"
                value="localPickup"
                onChange={handleInputChange}
                checked={formData.shippingOptions.indexOf('localPickup') !== -1}
              />
              <label className="form-check-label text-white" htmlFor="localPickup">Local Pickup</label>
            </div>
            
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="freeShipping"
                name="shippingOptions"
                value="freeShipping"
                onChange={handleInputChange}
                checked={formData.shippingOptions.indexOf('freeShipping') !== -1}
              />
              <label className="form-check-label text-white" htmlFor="freeShipping">Free Shipping</label>
            </div>
            </div>
          </fieldset>
          
          {/* Distance Input */}
          <div className="mb-3 row">
            <label htmlFor="distance" className="col-form-label col-sm-2 pt-0 text-white">Distance (Miles)</label>
            <div className="col-sm-2">
              <input type='number' className="form-control" id="distance" name="distance" onChange={handleInputChange} value={formData.distance} />
            </div>
          </div>


          {/* Location Input */}
          <fieldset className="mb-3 row">
              <legend className='col-form-label col-sm-2 pt-0 text-white'>From</legend>
              <div className="col-sm-3">
              <div className="form-check col-sm-6">
                <input type="radio" className="form-check-input" id="currentLocation" name="location" value="current" onChange={handleLocationChange} checked={formData.location === "current"}/>
                <label className="form-check-label text-white" htmlFor="currentLocation">'Current Location'</label>
              </div>
        
              <div className="form-check col-sm-8">
                <input type="radio" className="form-check-input" id="otherLocation" name="location" value="otherLocation" onChange={handleLocationChange} checked={formData.location ==="otherLocation"}/>
                <label className="form-check-label text-white" htmlFor="otherLocation"> Other. Please Specify zip code:</label>
              </div>
              
              <div className='col-auto'>
            
              <div>
              <Autocomplete
              freeSolo
              disablePortal
              disableClearable
              disabled={locationInputDisabled}
              value={formData.location === 'otherLocation' ? formData.zipcode : ''}
              options={zipSuggestions || []}
              onInputChange={(event, newInputValue) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  zipCode: newInputValue,
                }));
              }}
              onChange={(event, newValue) => {
                // Handle the selection event, call handleInputChange with the new value
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  zipCode: newValue,
                }));
              }}
              renderInput={(params) => (
                
                <TextField
                sx={{
                  width: 300,
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      padding: '10px 14px', // Adjust the top and bottom padding to reduce height
                    },
                    '& fieldset': {
                      borderRadius: '5px', // Keep the border radius consistent with the style
                    },
                  },
                }}
                  {...params}
                  name='zipCode'
                  inputRef={zipcodeInputRef}
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setFormData({
                      ...formData,
                      zipcode: newValue
                    });
                    if (handleInputChange) {
                      handleInputChange(event); // call the provided input change handler if it exists
                    }
                  }}
                  onBlur={() => {
                    validateZipCode(); // Validate zipCode when input loses focus
                  }}

                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    disabled: locationInputDisabled,
                  }}
                />
              )}
            />

            </div>

              </div>
            
              </div>
          </fieldset>
          {formError.zipCode && <div className="text-danger">{formError.zipCode}</div>}



          {/* Search and Clear Buttons */}
          <div className="row">
            <div className="col-sm-10 offset-sm-2">
              <button type="submit" className="btn btn-white" style={{ backgroundColor: 'white' }} disabled={isSearchButtonDisabled}>
              <span className="material-icons">search</span>Search</button>
              
              <button type="button" className="btn btn-white" style={{ backgroundColor: 'white' }} onClick={handleClear}>
              <span className="material-icons">clear_all</span>
              Clear
            </button>
            </div>
          </div>
          
        </form>
        </div>
      </div>

      <div className='container mt-4'>
        <Button
          variant="white"
          style={getButtonStyle('/results')}
          onClick={() => navigate('/results')}
        >
          Results
        </Button>
        <Button
          variant="white"
          style={getButtonStyle('/wishlist')}
          onClick={() => navigate('/wishlist')}
        >
          Wishlist
        </Button>
      </div>
      </>
    );
  }

