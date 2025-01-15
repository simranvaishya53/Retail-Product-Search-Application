import React from 'react';
import { useSelector } from 'react-redux';
import { AiFillStar, AiOutlineStar, AiFillCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Table from 'react-bootstrap/Table';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import 'react-circular-progressbar/dist/styles.css';

const Seller = () => {
  const singleItemDetails = useSelector((state) => state.singleItemDetails.item);

  if (!singleItemDetails) {
    return null; // Handle the case when data is not available
  }

  const {
    feedbackScore,
    popularity,
    feedbackratingstar,
    topratedseller,
    storename,
    storeurl,
  } = singleItemDetails;

  const getFeedbackStars = (feedbackScore, color) => {
    // Choose the right icon and color based on the feedback score
    const style = { color: color }; // Use the color from the feedbackratingstar
    const icon = feedbackScore >= 10000 ? <Star style={style} /> : <StarBorder style={style} />;
    return icon;
  };

  const getTopRatedIcon = (topRated) => {
    if (topRated) {
      return <AiFillCheckCircle color="green" />;
    }
    return <AiOutlineCloseCircle color="red" />;
  };



  return (
    <div className='container'>
    <div className='row justify-content-center'>
    <div className='col-lg-11 col-md-3'>
    <Table striped hover variant="dark" className="text-white mx-2">
      <tbody>
        {/* Store name to be the first row and in the center */}
        {storename && (
          <tr>
            <td className='text-center' colSpan={2}>
              <h4>{storename}</h4>
            </td>
          </tr>
        )}
        {/* Store URL to be the second row and in the center */}
        {feedbackScore && (
          <tr>
            <td className='text-start'>Feedback Score</td>
            <td className='text-start'>
              {feedbackScore} 
            </td>
          </tr>
        )}
        {popularity !== undefined && (
          <tr>
            <td className='text-start'>Popularity</td>
            <td className='text-start'>
            <div style={{ width: 40, height: 40 }}> {/* Increase the size of the container */}
            <CircularProgressbar
              value={popularity}
              text={popularity}
              styles={{
                root: { fill: 'green' }, // Set the bar color to green
                text: { fill: 'white', fontSize: '30px' }, // Set the text color to white and increase font size
                path: { stroke: 'green' }, // Set the path color to green
                trail: { stroke: 'eaeaea' }, // Set the trail color
              }}
            />
          </div>
            </td>
          </tr>
        )}
        {feedbackratingstar && feedbackScore && (
          <tr>
            <td className='text-start'>Feedback Rating Star</td>
            <td className='text-start'>
              {getFeedbackStars(feedbackScore, feedbackratingstar)}
            </td>
          </tr>
        )}
        {topratedseller !== undefined && (
          <tr>
            <td className='text-start'>Top Rated</td>
            <td className='text-start'>
              {topratedseller ? (
                <CheckIcon style={{ color: 'green' }} />
              ) : (
                <CancelIcon style={{ color: 'red' }} />
              )}
            </td>
          </tr>
        )}
        {storename && (
          <tr>
            <td className='text-start'>Store Name</td>
            <td className='text-start'>{storename}</td>
          </tr>
        )}
        {storeurl && (
          <tr>
            <td className='text-start'>Buy Product At</td>
            <td className='text-start'>
              <a href={storeurl} target="_blank" rel="noopener noreferrer">
                Store
              </a>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
    </div>
    </div>
    </div>
  );
};

export default Seller;
