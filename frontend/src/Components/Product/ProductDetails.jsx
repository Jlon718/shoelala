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

const ProductDetails = ({ cartItems, addItemToCart }) => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [user] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorReview, setErrorReview] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const productDetails = async (id) => {
    const link = `${import.meta.env.VITE_API}/product/${id}`;
    try {
      const res = await axios.get(link);
      if (res.data.success) {
        setProduct(res.data.product);
      } else {
        setError('Product not found');
        toast.error('Product not found');
        navigate('/');
      }
    } catch {
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

  const reviewHandler = async () => {
    const reviewData = {
      rating,
      comment,
      productId: id,
    };
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, config);
      setSuccess(data.success);
    } catch (err) {
      setErrorReview(err.response.data.message);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <MetaData title={product.name} />
      <div style={styles.container}>
      <div style={styles.imageSection}>
          <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
            {product.images && product.images.map((image) => (
              <div key={image.public_id} style={styles.carouselImageContainer}>
                <img src={`https://res.cloudinary.com/dop23iret/image/upload/${image.public_id}`} alt={product.name} style={styles.carouselImage} />
              </div>
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

  carouselImageContainer: {
    display: 'flex',
    justifycontent: 'center',
    alignitems: 'center',
    height: '100%', /* Match parent container height */
    width: '100%',/* Match parent container width */
    overflow: 'hidden', /* Prevent overflow of images */
  },
  
  carouselImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', // Ensure the image maintains its aspect ratio
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
    maxWidth: '45%',
  },
  productImage: {
    width: '100%',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  detailsSection: {
    flex: '1 1 50%',
    maxWidth: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  productId: {
    fontSize: '1rem',
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
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
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
  ratingOuter: {
    position: 'relative',
    display: 'inline-block',
    width: '100px',
    height: '20px',
    backgroundColor: '#ccc',
    marginRight: '10px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#555',
  },
  ratings: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
};

export default ProductDetails;
