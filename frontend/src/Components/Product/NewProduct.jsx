import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MUIDataTable from "mui-datatables";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Grid, Typography } from '@mui/material';
import Sidebar from '../Admin/SideBar';

const NewProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category: '',
        brand: '',
        seller: '',
        images: []
    });
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/products`);
            setProducts(data.products);
        } catch (error) {
            toast.error('Error fetching products');
        }
    };

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, images: [...e.target.files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(product).forEach(key => {
                if (key === 'images') {
                    product.images.forEach(image => {
                        formData.append('images', image);
                    });
                } else {
                    formData.append(key, product[key]);
                }
            });

            if (isEdit) {
                await axios.put(`${import.meta.env.VITE_API}/product/${product._id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API}/product/new`, formData);
                toast.success('Product created successfully');
            }

            fetchProducts();
            setOpen(false);
        } catch (error) {
            toast.error('Error creating/updating product');
        }
    };

    const handleEdit = (product) => {
        setProduct(product);
        setIsEdit(true);
        setOpen(true);
    };

    const columns = [
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "stock",
            label: "Stock",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "category",
            label: "Category",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "brand",
            label: "Brand",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "seller",
            label: "Seller",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const product = products[tableMeta.rowIndex];
                    return (
                        <Button
                            onClick={() => navigate(`/admin/product/${product._id}`)}
                            variant="contained"
                            sx={{
                                bgcolor: '#608BC1',
                                color: '#F3F3E0',
                                ':hover': { bgcolor: '#CBDCEB' }
                            }}
                        >
                            Edit
                        </Button>
                    );
                }
            }
        }
    ];

    const options = {
        filterType: 'checkbox',
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const product = products[rowMeta.dataIndex];
            return (
                <tr>
                    <td colSpan={6}>
                        <Box sx={{ p: 2, bgcolor: '#CBDCEB' }}>
                            <Typography variant="body1"><strong>Images:</strong></Typography>
                            {product.images.map((image, index) => (
                                <img key={index} src={image.url} alt={product.name} width="100" style={{ margin: '10px' }} />
                            ))}
                        </Box>
                    </td>
                </tr>
            );
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#133E87', minHeight: '100vh' }}>
            <Box sx={{ width: '250px' }}>
                    <Sidebar />
            </Box>
            <Box
                component="main"
                sx={{
                    width: '100%',
                    bgcolor: '#608BC1',
                    borderRadius: '10px',
                    margin: '20px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                }}
            >
                <Button
                    onClick={() => navigate('/admin/product/new/form')}
                    sx={{
                        bgcolor: '#133E87',
                        color: '#F3F3E0',
                        mb: 2,
                        ':hover': { bgcolor: '#608BC1' }
                    }}
                >
                    Add Product
                </Button>
                <MUIDataTable
                    title={"Products"}
                    data={products}
                    columns={columns}
                    options={options}
                />
            </Box>
        </Box>
    );
};

export default NewProduct;
