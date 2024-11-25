import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Accordion, AccordionSummary, AccordionDetails, Slider, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ratings = [1, 2, 3, 4, 5];

const Filters = ({ categories, onSelectCategory, onPriceChange, onRatingChange }) => {
  const [price, setPrice] = useState([1, 1000]);
  const [rating, setRating] = useState(0);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
    onPriceChange(newValue);
  };

  const handleRatingChange = (event) => {
    const newRating = Number(event.target.value);
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (panel === 'categories') {
      setCategoriesOpen(isExpanded);
    } else if (panel === 'price') {
      setPriceOpen(isExpanded);
    } else if (panel === 'ratings') {
      setRatingsOpen(isExpanded);
    }
  };

  return (
    <Box sx={{ width: 250, padding: 2, backgroundColor: '#B9D4F1' }}>
      <Accordion expanded={categoriesOpen} onChange={handleAccordionChange('categories')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {categories.map((category) => (
              <ListItem button key={category._id} onClick={() => onSelectCategory(category._id)}>
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={priceOpen} onChange={handleAccordionChange('price')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={price}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={1}
            max={1000}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={ratingsOpen} onChange={handleAccordionChange('ratings')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ratings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <FormLabel component="legend">Rating</FormLabel>
            <RadioGroup value={rating} onChange={handleRatingChange}>
              {ratings.map((ratingValue) => (
                <FormControlLabel
                  key={ratingValue}
                  value={ratingValue}
                  control={<Radio />}
                  label={`${ratingValue} Stars`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Filters;