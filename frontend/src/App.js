  import React from 'react';
  import { Routes, Route } from 'react-router-dom';
  import FormData from './components/FormData'; // Import your components
  import ResultsDisplay from './components/ResultsDisplay';
  import SingleItemDisplay from './components/SingleItemDisplay';
  import Photos from './components/Photos';
  import Shipping from './components/Shipping';
  import Seller from './components/Seller';
  import SimilarProducts from './components/SimilarProducts';
  import Wishlist from './components/Wishlist';
  import NavBar from './components/NavBar';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import './App.css';

  function App() {
    return (
      <div className="App">
        <FormData />
        <Routes>
        <Route path="/" element={<DefaultComponent />} />
          <Route path="results" element={<ResultsDisplay />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="singleItem" element={<NavBar />}>
            <Route index element={<SingleItemDisplay />} />
            <Route path="photos" element={<Photos />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="seller" element={<Seller />} />
            <Route path="similar-products" element={<SimilarProducts />} />
          </Route>
      
        </Routes>
      </div>
    );
  }
  // Define a simple component that will be rendered for the default route
  function DefaultComponent() {
    return (
      <div>
        {/* This can be an empty div or any placeholder content you want to show below the form */}
      </div>
    );
  }


  export default App;
