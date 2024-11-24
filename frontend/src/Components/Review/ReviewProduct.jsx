import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../productdetails.css';
import axios from 'axios';
import { getUser, getToken } from '../../utils/helpers';
import ListReviews from '../Review/ListReviews';
import backgroundImage from '../../img/bg.jpg';
import { Filter } from 'bad-words';

const ReviewProduct = ({ cartItems, addItemToCart }) => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState(getUser());
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Instantiate bad-words filter and add custom bad words
    const filter = new Filter();
    filter.addWords('potangina', 'asshole', 'dick'); // Add your custom bad words

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

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.starValue = index + 1;
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            });
        });
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
                        setRating(this.starValue);
                    } else {
                        star.classList.remove('orange');
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow');
                    }
                }
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow');
                }
            });
        }
    }

    const newReview = async () => {
        try {
            // Clean the comment
            const filteredComment = filter.clean(comment); // Filter bad words
            const reviewData = {
                rating,
                comment: filteredComment,
                productId: id,
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, config);
            setSuccess(data.success);
            toast.success('Review submitted successfully!');
        } catch (error) {
            setErrorReview(error.response?.data?.message || 'Error submitting review');
            toast.error('Error submitting review');
        }
    };

    const reviewHandler = () => {
        newReview();
    };

    return (
        <div style={styles.pageBackground}>
            <MetaData title={product.name} />
            <div style={styles.container}>
                <div style={styles.imageSection}>
                    <Carousel>
                        {product.images &&
                            product.images.map((image) => (
                                <Carousel.Item key={image.public_id}>
                                    <img src={image.url} alt={product.title} style={styles.productImage} />
                                </Carousel.Item>
                            ))}
                    </Carousel>
                </div>
                <div style={styles.detailsSection}>
                    <h2 style={styles.productName}>{product.name}</h2>
                    <p style={styles.productId}>Product ID: {product._id}</p>
                    <div style={styles.ratingContainer}>
                        <div style={{ ...styles.ratingInner, width: `${(product.ratings / 5) * 100}%` }}></div>
                        <span style={styles.reviewsCount}>({product.numOfReviews} Reviews)</span>
                    </div>
                    <p style={styles.productPrice}>₱{product.price}</p>
                    <div style={styles.quantityContainer}>
                        <button onClick={decrementQuantity} style={styles.quantityButton}>-</button>
                        <input type="number" value={quantity} readOnly style={styles.quantityInput} />
                        <button onClick={incrementQuantity} style={styles.quantityButton}>+</button>
                    </div>
                    <button
                        style={styles.addToCartButton}
                        onClick={addToCart}
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </button>
                    <p style={styles.sellerInfo}>Sold by: <strong>{product.seller}</strong></p>
                    {user ? (
                        <button
                            id="review_btn"
                            type="button"
                            className="btn btn-primary mt-4"
                            data-toggle="modal"
                            data-target="#ratingModal"
                            onClick={setUserRatings}
                        >
                            Submit Your Review
                        </button>
                    ) : (
                        <div className="alert alert-danger mt-5" type="alert">
                            Login to post your review.
                        </div>
                    )}
                </div>
            </div>
            <div className="row mt-2 mb-5">
                <div className="rating w-50">
                    <div
                        className="modal fade"
                        id="ratingModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="ratingModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="ratingModalLabel">
                                        Submit Review
                                    </h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ul className="stars">
                                        <li className="star">
                                            <i className="fa fa-star"></i>
                                        </li>
                                        <li className="star">
                                            <i className="fa fa-star"></i>
                                        </li>
                                        <li className="star">
                                            <i className="fa fa-star"></i>
                                        </li>
                                        <li className="star">
                                            <i className="fa fa-star"></i>
                                        </li>
                                        <li className="star">
                                            <i className="fa fa-star"></i>
                                        </li>
                                    </ul>
                                    <textarea
                                        name="review"
                                        id="review"
                                        className="form-control mt-3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                    <button
                                        className="btn my-3 float-right review-btn px-4 text-white"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={reviewHandler}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {product.reviews && product.reviews.length > 0 && (
                <div style={styles.reviewsSection}>
                    <h3 style={styles.reviewsHeading}>What Our Customers Say</h3>
                    <div style={styles.reviewsContainer}>
                        {product.reviews.map((review, index) => (
                            <div key={index} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${review.name}&background=random`}
                                        alt={review.name}
                                        style={styles.reviewerImage}
                                    />
                                    <div>
                                        <p style={styles.reviewerName}>{review.name}</p>
                                        <p style={styles.reviewDate}>{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <div style={styles.reviewBody}>
                                    <p style={styles.reviewRating}>{"⭐".repeat(review.rating)}</p>
                                    <p style={styles.reviewComment}>{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageBackground: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        minHeight: '100vh',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        background: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
    },
    imageSection: {
        flex: '1 1 45%',
        marginRight: '20px',
    },
    productImage: {
        width: '100%',
        borderRadius: '10px',
        objectFit: 'cover',
    },
    detailsSection: {
        flex: '1 1 45%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    productName: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    productId: {
        fontSize: '14px',
        color: '#777',
        marginBottom: '20px',
    },
    ratingContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    ratingInner: {
        height: '20px',
        background: '#FFD700',
        borderRadius: '5px',
    },
    reviewsCount: {
        fontSize: '14px',
        color: '#333',
        marginLeft: '10px',
    },
    productPrice: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: '20px',
    },
    quantityContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    quantityButton: {
        background: '#007BFF',
        color: '#fff',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
        marginRight: '10px',
    },
    quantityInput: {
        width: '50px',
        textAlign: 'center',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginRight: '10px',
    },
    addToCartButton: {
        background: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    sellerInfo: {
        fontSize: '16px',
        color: '#555',
        marginTop: '10px',
    },
    reviewsSection: {
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    reviewsHeading: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    },
    reviewsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
    },
    reviewCard: {
        background: '#f9f9f9',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    reviewHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    reviewerImage: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '10px',
    },
    reviewerName: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    reviewDate: {
        fontSize: '12px',
        color: '#777',
    },
    reviewBody: {
        marginTop: '10px',
    },
    reviewRating: {
        fontSize: '16px',
        color: '#FFD700',
        marginBottom: '5px',
    },
    reviewComment: {
        fontSize: '14px',
        color: '#555',
    },
};

export default ReviewProduct;