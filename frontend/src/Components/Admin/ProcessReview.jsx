import { useState, useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Box, TextField, Button, Typography } from '@mui/material';
import Sidebar from './SideBar'; 
import MetaData from '../Layout/MetaData';
import Toast from '../Layout/Toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getUser, getToken } from '../../utils/helpers';

const ProductReviews = () => {
    const [productId, setProductId] = useState('');
    const [error, setError] = useState('');
    const [listReviews, setListReviews] = useState([]);
    const [deleteError, setDeleteError] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };

    const getProductReviews = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/reviews?id=${id}`, config);
            setListReviews(data.reviews);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching reviews');
        }
    };

    const deleteReview = async (id, productId) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API}/reviews?id=${id}&productId=${productId}`, config);
            setIsDeleted(data.success);
        } catch (error) {
            setDeleteError(error.response?.data?.message || 'Error deleting review');
        }
    };

    const deleteReviewHandler = (id) => {
        Swal.fire({
            title: 'Delete Review',
            icon: 'warning',
            text: 'Are you sure you want to delete this review?',
            confirmButtonText: 'Delete',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReview(id, productId);
            }
        });
    };

    useEffect(() => {
        if (error) {
            Toast('Error fetching reviews', 'error');
            setError('');
        }
        if (deleteError) {
            Toast(deleteError, 'error');
            setDeleteError('');
        }
        if (productId) {
            getProductReviews(productId);
        }
        if (isDeleted) {
            Toast('Review deleted successfully', 'success');
            setIsDeleted(false);
        }
    }, [error, productId, isDeleted, deleteError]);

    const setReviews = () => ({
        columns: [
            { label: 'Review ID', field: 'id', sort: 'asc' },
            { label: 'Rating', field: 'rating', sort: 'asc' },
            { label: 'Comment', field: 'comment', sort: 'asc' },
            { label: 'User', field: 'user', sort: 'asc' },
            {
                label: 'Actions',
                field: 'actions',
            },
        ],
        rows: listReviews.map((review) => ({
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            user: review.name,
            actions: (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteReviewHandler(review._id)}
                >
                    Delete
                </Button>
            )
        })),
    });

    const submitHandler = (e) => {
        e.preventDefault();
        getProductReviews(productId);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(to top, #F3F3E0, #133E87, #608BC1, #CBDCEB)',
            }}
        >
            {/* Sidebar */}
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <MetaData title="Product Reviews" />
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        mb: 4,
                        p: 4,
                        borderRadius: '10px',
                        backgroundColor: '#f3f3e0',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            color: '#133E87',
                            fontWeight: 'bold',
                        }}
                    >
                        Product Reviews
                    </Typography>
                    <form onSubmit={submitHandler}>
                        <TextField
                            label="Enter Product ID"
                            fullWidth
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#4A628A',
                                color: '#FFF',
                                ':hover': { bgcolor: '#2E4B6A' },
                                py: 1.5,
                                fontWeight: 'bold',
                                fontSize: '16px',
                            }}
                        >
                            Search
                        </Button>
                    </form>
                </Box>

                {listReviews.length > 0 ? (
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '90%',
                            backgroundColor: '#F3F3E0',
                            borderRadius: '10px',
                            p: 3,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <MDBDataTable
                            data={setReviews()}
                            bordered
                            striped
                            hover
                            responsive
                            className="px-3"
                        />
                    </Box>
                ) : (
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 5,
                            textAlign: 'center',
                            color: '#4A628A',
                        }}
                    >
                        No Reviews Found
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ProductReviews;
