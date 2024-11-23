import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MUIDataTable from "mui-datatables";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, Box, Grid } from '@mui/material';
import Sidebar from '../Admin/SideBar';

const NewProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API}/product/${id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    const handleBulkDelete = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API}/products/bulk-delete`, { ids: selectedProducts });
            toast.success('Products deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting products');
        }
    };

    const handleSelect = (rowsSelected) => {
        const selectedIds = rowsSelected.map(row => products[row.index]._id);
        setSelectedProducts(selectedIds);
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
                        <>
                            <Button onClick={() => navigate(`/admin/product/${product._id}`)}>Edit</Button>
                            <Button onClick={() => handleDelete(product._id)}>Delete</Button>
                        </>
                    );
                }
            }
        }
    ];

    const options = {
        filterType: 'checkbox',
        onRowSelectionChange: (rowsSelected, allRows) => handleSelect(allRows),
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const product = products[rowMeta.dataIndex];
            return (
                <tr>
                    <td colSpan={6}>
                        <div>
                            <p><strong>Images:</strong></p>
                            {product.images.map((image, index) => (
                                <img key={index} src={image.url} alt={product.name} width="100" />
                            ))}
                        </div>
                    </td>
                </tr>
            );
        }
    };

    return (
        <>
         <Box sx={{ display: 'flex' }}>
         <Grid item xs={12} md={2}>
                    <Sidebar />
                </Grid>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Button onClick={() => navigate('/admin/product/new/form')}>Add Product</Button>
            <Button onClick={handleBulkDelete} disabled={selectedProducts.length === 0}>Delete Selected</Button>
            <MUIDataTable
                title={"Products"}
                data={products}
                columns={columns}
                options={options}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={product.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={product.price}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={product.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="stock"
                        label="Stock"
                        type="number"
                        fullWidth
                        value={product.stock}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="category"
                        label="Category"
                        type="text"
                        fullWidth
                        value={product.category}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="brand"
                        label="Brand"
                        type="text"
                        fullWidth
                        value={product.brand}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="seller"
                        label="Seller"
                        type="text"
                        fullWidth
                        value={product.seller}
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
                </DialogActions>
            </Dialog>
            </Box>
        </Box>
        </>
    );
};

export default NewProduct;