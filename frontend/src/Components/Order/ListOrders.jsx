import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom'

const ListOrders = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [myOrdersList, setMyOrdersList] = useState([])
    const [reviewedOrders, setReviewedOrders] = useState([]) // To track reviewed orders

    const myOrders = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/orders/me`, config)
            console.log(data)
            setMyOrdersList(data.orders)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        myOrders();
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }
    }, [error])

    // Separate orders into "Products to be reviewed" and "My Reviews"
    const getOrdersToBeReviewed = () => {
        return myOrdersList.filter(order => order.orderStatus === 'Delivered' && !reviewedOrders.includes(order._id));
    };

    const getReviewedOrders = () => {
        return myOrdersList.filter(order => reviewedOrders.includes(order._id));
    };

    // Move orders to review state
    const markAsReviewed = (orderId) => {
        setReviewedOrders(prevState => [...prevState, orderId]);
        toast.success('Order marked as reviewed');
    };

    const setOrders = (orders) => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                },
            ],
            rows: []
        }
        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: (
                    <>
                        <Link to={`/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-eye"></i>
                        </Link>
                        {order.orderStatus === 'Delivered' && !reviewedOrders.includes(order._id) && (
                            <button 
                                onClick={() => markAsReviewed(order._id)} 
                                className="btn btn-success ml-2">
                                Mark as Reviewed
                            </button>
                        )}
                    </>
                )
            })
        })
        return data;
    }

    return (
        <>
            <MetaData title={'My Orders'} />
            <h1 className="my-5">My Orders</h1>
            {loading ? <Loader /> : (
                <MDBDataTable
                    data={setOrders(myOrdersList)}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            )}

            <br></br>
            <h1 className="my-5">Products to be Reviewed:</h1>
            {loading ? <Loader /> : (
                <MDBDataTable
                    data={setOrders(getOrdersToBeReviewed())}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            )}

            <h1 className="my-5">My Reviews:</h1>
            {loading ? <Loader /> : (
                <MDBDataTable
                    data={setOrders(getReviewedOrders())}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            )}
        </>
    )
}

export default ListOrders
