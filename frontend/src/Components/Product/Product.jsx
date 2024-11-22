import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import shoesImage from './shoes.png';

const Product = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 250, margin: '15px' }}>
  <CardMedia
    sx={{ height: 250 }}
    image={shoesImage}
    title="shoes"
  />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <div className="ratings mt-auto">
          <div className="rating-outer">
            <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
          </div>
          <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 1 }}>
            ({product.numOfReviews} reviews)
          </Typography>
        </div>
        <Typography variant="h6" sx={{ color: 'primary.main', marginTop: 2 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/product/${product._id}`} sx={{ color: 'primary.main' }}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;