import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../productdetails.css'
import axios from 'axios';
import shoesImage from './shoes.png'

const ProductDetails = ({cartItems, addItemToCart}) => {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    // const [state, setState] = useState({
    //     cartItems: localStorage.getItem('cartItems')
    //       ? JSON.parse(localStorage.getItem('cartItems'))
    //       : [], 
    //   })
    const [error, setError] = useState('');
    let { id } = useParams();
    let navigate = useNavigate();

    const productDetails = async (id) => {
        const link = `${import.meta.env.VITE_API}product/${id}`;
        try {
            let res = await axios.get(link);
            setProduct(res.data.product);
        } catch (err) {
            console.log(err);
            setError('Product not found');
        }
    };

    // const addItemToCart = async (id, quantity) => {
    //     // console.log(id, quantity)
    //     try {
    //       const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
    //       const item = {
    //         product: data.product._id,
    //         name: data.product.name,
    //         price: data.product.price,
    //         image: data.product.images[0].url,
    //         stock: data.product.stock,
    //         quantity: quantity
    //       }
    
    //       const isItemExist = state.cartItems.find(i => i.product === item.product)
    //       console.log( state)
    //       setState({
    //         ...state,
    //         cartItems: [...state.cartItems, item]   
    //       })
    //       if (isItemExist) {
    //         setState({
    //           ...state,
    //           cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
    //         })
    //       }
    //       else {
    //         setState({
    //           ...state,
    //           cartItems: [...state.cartItems, item]
    //         })
    //       }
    
    //       toast.success('Item Added to Cart', {
    //         position: 'bottom-right'
    //       })
    
    //     } catch (error) {
    //       toast.error(error, {
    //         position: 'top-left'
    //       });
    //       navigate('/')
    //     }
    
    //   }
    
    const addToCart = async () => {
        await addItemToCart(id, quantity);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    }

    useEffect(() => {
        productDetails(id);
        if (error) {
            navigate('/');
            setError('');
        }
    }, [id, error]);


    // Handle increment and decrement
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

    return (
        <>
            <MetaData title={product.name} />
            <section className="py-5">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" src={shoesImage} alt="..." /></div>
                        <div className="col-md-6">
                            <div className="small mb-1">Product ID: {product._id}</div>
                            <h1 className="display-5 fw-bolder">{product.name}</h1>

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                            <div className="fs-5 mb-5">
                                <span>${product.price}</span>
                            </div>
                            <p className="lead">{product.description}</p>
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                
                                <input
                                    className="form-control text-center me-2"
                                    id="inputQuantity"
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    style={{ maxWidth: '3rem' }}
                                />

                                <button
                                    className="btn btn-primary me-3"
                                    onClick={incrementQuantity}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                                
                                <button
                                    className="btn btn-outline-dark flex-shrink-0"
                                    type="button"
                                    disabled={product.stock === 0}
                                    id="cart_btn"
                                    onClick={addToCart}
                                >
                                    <i className="bi-cart-fill me-1"></i>
                                    Add to Cart
                                </button>
                            </div>
                            
                            <small className="text-muted">In Stock: {product.stock || 0}</small>

                            <hr>
                            <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal"  >
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

                                            <ul className="stars" >
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                            </ul>

                                            <textarea
                                                name="review"
                                                id="review" className="form-control mt-3"
                                          
                                            >
                                            </textarea>

                                            
                                            <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" >Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                            </hr>
                        </div>
                    </div>
                </div>
            </section>

            {/* <MetaData title={product.name} />
            <div className="row d-flex justify-content-around">
               

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

                        <span className="btn btn-danger minus" >-</span>

                        <input type="number" className="form-control count d-inline" readOnly />


                        <span className="btn btn-primary plus" >+</span>
                    </div>

                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0} >Add to Cart</button>

                    <hr />

                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} >{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                    <hr />

                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr />
                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                    <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal"  >
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

                                            <ul className="stars" >
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                            </ul>

                                            <textarea
                                                name="review"
                                                id="review" className="form-control mt-3"
                                          
                                            >
                                            </textarea>

                                            
                                            <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" >Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default ProductDetails