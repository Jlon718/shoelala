import React, { useState, useEffect } from 'react'
import MetaData from './Layout/MetaData'
import axios from 'axios'
import Product from './Product/Product'

const Home = () => {
    const [products, setProducts] = useState([])
    const [productsCount, setProductsCount] = useState(0)

    const getProducts = async () => {

        let link = 'http://localhost:4001/api/v1/products'

        let res = await axios.get(link)
        console.log(res)
        setProducts(res.data.products)

        setProductsCount(res.data.count)

    }

    useEffect(() => {
        getProducts()
    }, []);
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
            </div>
        </>

    )
}

export default Home