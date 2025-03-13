# 🛒 Retail Product Search Application

A **MERN stack application** that allows users to search for products on **eBay** using various filters.  
The app retrieves product data via the **eBay API**, supports **location-based searches** with the **Geonames API**, and integrates the **Google Custom Search API** to display related product images.  
Additional features include **wishlist management, seller details, product sharing on Facebook, and similar product recommendations**.  

---

## 🚀 Features  

- 🔍 **Search for Products** – Users can search for eBay products using keywords.  
- 🎯 **Custom Filters** – Apply filters like **category, price range, shipping options, and distance** to refine results.  
- 📍 **Location-Based Search** – Uses **Geonames API** to auto-detect the user's location for relevant product searches.  
- 📝 **Product Details Page** – Displays:  
  - 🏷️ **Product Title, Price, and Condition**  
  - 🛍️ **Seller Information** (seller name, rating, feedback score)  
  - 🖼️ **Product Images** fetched from **Google Custom Search API**  
  - 🚚 **Shipping Details** (cost, options, estimated delivery date)  
  - 📊 **Item Specifications** (brand, color, material, etc.)  
- 🔄 **Similar Products Recommendation** – Displays alternative listings of related items.  
- ❤️ **Wishlist Management** – Users can **add/remove items** to/from their wishlist and see the **total price** of saved items.  
- 📤 **Facebook Sharing** – Users can **share product links** directly on Facebook.  
- 📑 **Pagination** – Implements paginated search results for **better navigation and performance**.  
- ⚡ **Optimized API Calls** – The backend processes **filters and data before sending responses**, improving speed.  
- ☁️ **Deployed on Google Cloud Platform (GCP)** – Ensures scalability and availability.  

---

## 🛠 Tech Stack  

| **Technology**            | **Usage**                                         |
|---------------------------|--------------------------------------------------|
| 🗄️ **MongoDB**            | Database for wishlist management                |
| ⚙️ **Express.js**         | Backend API handling                            |
| 🎨 **React.js**           | Frontend UI                                     |
| 🖥️ **Node.js**            | Server-side logic                              |
| 🎨 **Bootstrap**          | Styling & responsiveness                        |
| 🔍 **eBay API**           | Fetching product details, seller info, and similar products |
| 🖼️ **Google Custom Search API** | Fetching related product images             |
| 🌍 **Geonames API**       | Location-based search                           |
| 🔄 **Redux**              | State management                                |
| ☁️ **GCP (Google Cloud Platform)** | Deployment                            |

---

## 📂 Folder Structure  

```bash
/ebay-react-project
 ├── /public
 ├── /src
 │   ├── /components  # Reusable UI components
 │   ├── /pages       # Page-level components (Search, Product Details, Wishlist)
 │   ├── /redux       # State management (if applicable)
 │   ├── /services    # API calls & helper functions
 │   ├── App.js
 │   ├── index.js
 ├── /server          # Backend (Express.js & Node.js)
 │   ├── /routes      # API routes
 │   ├── /models      # Database models
 │   ├── server.js
 ├── package.json
 ├── README.md

```

## 📩 Contact  
👨‍💻 Author: Simran Vaishya 
🔗 GitHub: https://github.com/simranvaishya53
