import React, { useState, useEffect } from 'react';
import MetaData from './Layout/MetaData';
import axios from 'axios';
import Product from './Product/Product';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import 'rc-slider/assets/index.css';
import Loader from './Layout/Loader';
import Filters from './Layout/Filters'; // Adjusted import
import { Box } from '@mui/material';


const Index = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const categories = [
    { _id: '671b6d275ff9bb4826220b25', name: 'Running' },
    { _id: '671b6d275ff9bb4826220b26', name: 'Casual' },
    { _id: '671b6d275ff9bb4826220b27', name: 'Formal' },
    { _id: '671b6d275ff9bb4826220b28', name: 'Outdoor' },
    { _id: '671b6d275ff9bb4826220b29', name: 'Sneakers' },
  ];

  let { keyword } = useParams();

  const filteredProducts = (products, keyword, price, category, rating) => {
    return products.filter(product => {
        if (category && product.category !== category) {
            return false;
        }
        if (rating && product.ratings < rating) {
            return false;
        }
        if (price) {
            if (product.price < price[0] || product.price > price[1]) {
                return false;
            }
        }
        if (keyword) {
            if (product.name.toLowerCase().includes(keyword)) {
                return true;
            }
        }
        return true;
    })
  };

  const getProducts = async (page = 1, keyword = '', price, category, rating) => {

    const link = `http://localhost:4001/api/v1/index/products?keyword=${keyword}&page=${page}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&rating[gte]=${rating};`
    const res = await axios.get(link);

    let filtered = filteredProducts(res.data.products, keyword, price, category, rating)
    if (filtered.length) res.data.products = filtered
    setProducts(res.data.products)


    setResPerPage(res.data.resPerPage);
    setProductsCount(res.data.count);
    setFilteredProductsCount(res.data.filteredProductsCount);
    setLoading(false);
  };

  useEffect(() => {
    getProducts(currentPage, keyword, price, category, rating);
  }, [currentPage, keyword, price, category, rating]);

  const handleSelectCategory = (categoryId) => {
    setCategory(categoryId);
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const count = keyword ? filteredProductsCount : productsCount;

  return (
    <>
      <MetaData title={'Shop'} />
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ display: 'flex', backgroundColor: '#B9D4F1' }}>
          <Filters
            categories={categories}
            onSelectCategory={handleSelectCategory}
            onPriceChange={handlePriceChange}
            onRatingChange={handleRatingChange}
          />
          <Box sx={{ flexGrow: 1, padding: 2 }}>
            <div className="container container-fluid">
              <h1 id="products_heading">Shoelala Products</h1>
              <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                  <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {products.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
              {resPerPage <= count && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={count}
                    onChange={setCurrentPageNo}
                    nextPageText={'Next'}
                    prevPageText={'Prev'}
                    firstPageText={'First'}
                    lastPageText={'Last'}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Index;