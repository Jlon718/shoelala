import React, { useState, useEffect } from 'react'
import MetaData from './Layout/MetaData'
import axios from 'axios'
import Product from './Product/Product'
import { useParams, useNavigate } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const Home = () => {
    const [products, setProducts] = useState([])
    const [productsCount, setProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [resPerPage, setResPerPage] = useState(0)
    const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]
    let { keyword } = useParams();

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const getProducts = async (page = 1, keyword = '', price, category) => {

        let link = `http://localhost:4001/api/v1/products?page=${page}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`
       
        if (category) {
            link = `http://localhost:4001/api/v1/products?keyword=${keyword}&page=${page}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`
        }

        let res = await axios.get(link)
        console.log(res)
        setProducts(res.data.products)
        setResPerPage(res.data.resPerPage)
        setProductsCount(res.data.count)
        setFilteredProductsCount(res.data.filteredProductsCount)

    }

    useEffect(() => {
        getProducts(currentPage, keyword, price, category)
    }, [currentPage, keyword, price, category]);

    let count = productsCount
    if (keyword) {
        count = filteredProductsCount
    }

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }
    
    return (
        <>
            <MetaData title={'Buy Best Products Online'} />
            <div className="container container-fluid">
                <h1 id="products_heading">Latest Products</h1>
                <section class="py-5">
                    <div class="container px-4 px-lg-5 mt-5">
                        <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                        {products && products.map(product => (
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
                        </div>)}
            </div>
        </>

    )
}

export default Home