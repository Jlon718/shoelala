import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../productdetails.css';
import axios from 'axios';
import shoesImage from './shoes.png';

const ProductDetails = ({ cartItems, addItemToCart }) => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    let { id } = useParams();
    let navigate = useNavigate();

    const productDetails = async (id) => {
        const link = `${import.meta.env.VITE_API}/product/${id}`;
        try {
            let res = await axios.get(link);
            if (res.data.success) {
                setProduct(res.data.product);
            } else {
                setError('Product not found');
                toast.error('Product not found');
                navigate('/');
            }
        } catch (error) {
            setError('Error fetching product details');
            toast.error('Error fetching product details');
            navigate('/');
        }
    };

    useEffect(() => {
        productDetails(id);
        if (error) {
            navigate('/');
            setError('');
        }
    }, [id, error]);

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const addToCart = async () => {
        await addItemToCart(id, quantity);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    return (
        <div>
            <MetaData title={product.name} />
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Carousel pause='hover'>
                        {product.images && product.images.map(image => (
                            <Carousel.Item key={image.public_id}>
                                <img className="d-block w-100" src={image.url} alt={product.title} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>

                    <hr />

                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                    <hr />

                    <p id="product_price">${product.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decrementQuantity}>-</span>
                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                        <span className="btn btn-primary plus" onClick={incrementQuantity}>+</span>
                    </div>
                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0} onClick={addToCart}>
                        Add to Cart
                    </button>

                    <hr />

                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                    <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                        Submit Your Review
                    </button>

                    <div className="row mt-2 mb-5">
                        <div className="rating w-50">
                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <ul className="stars">
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                            </ul>

                                            <textarea name="review" id="review" className="form-control mt-3"></textarea>

                                            <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;