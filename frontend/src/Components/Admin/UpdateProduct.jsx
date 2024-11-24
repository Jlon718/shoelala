import React, { useState, useEffect } from 'react';
import MetaData from '../Layout/MetaData';
import Sidebar from './SideBar';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UpdateProduct = () => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [images, setImages] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, { position: 'bottom-left' });
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' });

    const getProductDetails = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`);
            setProduct(data.product);
            setLoading(false);
        } catch (error) {
            errMsg(error.response.data.message);
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setUpdateError(error.response.data.message);
            errMsg(updateError);
        }
    };

    useEffect(() => {
        if (product && product._id !== id) {
            getProductDetails(id);
        } else {
            setOldImages(product.images);
        }
        if (isUpdated) {
            navigate('/product/new');
            successMsg('Product updated successfully');
        }
    }, [isUpdated, product, id, updateError]);

    const onImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        price: Yup.number().positive('Price must be positive').required('Price is required'),
        description: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        brand: Yup.string().required('Brand is required'),
        stock: Yup.number().min(0, 'Stock cannot be negative').required('Stock is required'),
        seller: Yup.string().required('Seller Name is required'),
    });

    return (
        <>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <Formik
                            initialValues={{
                                name: product.name || '',
                                price: product.price || 0,
                                description: product.description || '',
                                category: product.category || '',
                                brand: product.brand || '',
                                stock: product.stock || 0,
                                seller: product.seller || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                const formData = new FormData();
                                formData.set('name', values.name);
                                formData.set('price', values.price);
                                formData.set('description', values.description);
                                formData.set('category', values.category);
                                formData.set('stock', values.stock);
                                formData.set('brand', values.brand);
                                formData.set('seller', values.seller);
                                images.forEach(image => {
                                    formData.append('images', image);
                                });
                                updateProduct(product._id, formData);
                            }}
                        >
                            {({ values, handleChange, setFieldValue, errors, touched }) => (
                                <Form className="shadow-lg" encType="multipart/form-data">
                                    <h1 className="mb-4">Update Product</h1>

                                    <div className="form-group">
                                        <label htmlFor="name_field">Name</label>
                                        <Field
                                            type="text"
                                            id="name_field"
                                            className="form-control"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="price_field">Price</label>
                                        <Field
                                            type="number"
                                            id="price_field"
                                            className="form-control"
                                            name="price"
                                            value={values.price}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="price" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description_field">Description</label>
                                        <Field
                                            as="textarea"
                                            id="description_field"
                                            className="form-control"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category_field">Category</label>
                                        <Field
                                            type="text"
                                            id="category_field"
                                            className="form-control"
                                            name="category"
                                            value={values.category}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="category" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="brand_field">Brand</label>
                                        <Field
                                            type="text"
                                            id="brand_field"
                                            className="form-control"
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="brand" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stock_field">Stock</label>
                                        <Field
                                            type="number"
                                            id="stock_field"
                                            className="form-control"
                                            name="stock"
                                            value={values.stock}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="stock" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="seller_field">Seller Name</label>
                                        <Field
                                            type="text"
                                            id="seller_field"
                                            className="form-control"
                                            name="seller"
                                            value={values.seller}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="seller" component="div" className="text-danger" />
                                    </div>

                                    <div className="form-group">
                                        <label>Images</label>
                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                name="images"
                                                className="custom-file-input"
                                                id="customFile"
                                                onChange={(e) => {
                                                    onImageChange(e);
                                                    setFieldValue("images", e.target.files);
                                                }}
                                                multiple
                                            />
                                            <label className="custom-file-label" htmlFor="customFile">
                                                Choose Images
                                            </label>
                                        </div>
                                        {oldImages && oldImages.map(img => (
                                            <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                        ))}
                                        {imagesPreview.map(img => (
                                            <img key={img} src={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                        ))}
                                    </div>

                                    <button
                                        id="login_button"
                                        type="submit"
                                        className="btn btn-block py-3"
                                        disabled={loading}
                                    >
                                        UPDATE
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProduct;
