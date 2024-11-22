import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../productdetails.css';
import axios from 'axios';
import shoesImage from './shoes.png';
import { getUser, getToken, successMsg, errMsg } from '../../utils/helpers'
import ListReviews from '../Review/ListReviews';

const ProductDetails = ({ cartItems, addItemToCart }) => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState(getUser())
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('')
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
    }, [id, error, errorReview]);

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

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.starValue = index + 1;
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow')
                    }
                }
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    };

    const newReview = async (reviewData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, config)
            setSuccess(data.success)
        } catch (error) {
            setErrorReview(error.response.data.message)
        }
    };

    const reviewHandler = () => {
        const formData = new FormData();
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', id);
        newReview(formData)
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



                </div>
            </div>
            {product.reviews && product.reviews.length > 0 && (
                    <ListReviews reviews={product.reviews} />
                )}
        </div>
    );
};

export default ProductDetails;