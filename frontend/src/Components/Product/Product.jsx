import React from 'react'
import {Link} from 'react-router-dom'
import shoesImage from './shoes.png'
const Product = ({ product }) => {
  return (
        <div class="col mb-5">
            <div class="card h-100">
                <img class="card-img-top" src={shoesImage} alt="shoes.png" />
                {/*  src={product.images[0].url} */}
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">{product.name}</h5>
                                <div className="ratings mt-auto">
                                    <div className="rating-outer">
                                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                    </div>
                                    <span id="no_of_reviews">({product.numOfReviews} reviews)</span>
                                </div>
                                    ${product.price}
                        </div>
                    </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="/product/${product._id}">View options</a>
                            </div>
                        </div>
            </div>
        </div>
  )
}
export default Product