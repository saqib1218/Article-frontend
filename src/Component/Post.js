import { Button, Grid, Typography } from '@mui/material'
import React,{useState} from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ImageUploading from 'react-images-uploading';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import AlertDialogSlide from './DialogBox';
import success from '../images/tick.jpg'
import wrong from '../images/false.jpg'
const Post = () => {
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogImage, setDialogImage] = useState('');
    const handleClickOpen = () => {
      setDialogOpen(true);
    };
  
    const handleClose = () => {
        setDialogOpen(false);
        setDescription(''); // Clear the description input
        setImages([]); // Clear the images array
        setDialogImage('');
      };
    
  const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const handleSubmit = async (e) => {
    const formData = new FormData();
    e.preventDefault();
    formData.append('description', description);
    if (images.length > 0) {
        formData.append('image', images[0].file); // Assuming single image upload
    }
    
    const token = localStorage.getItem('jwtToken'); 
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/article`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`, // Use Bearer token for authorization
            },
        });
        console.log(response.data); // Handle success response
        setDialogMessage('Article uploaded successfully!'); // Set success message
        handleClickOpen(); // Open dialog
        setDialogImage(success);
    } catch (error) {
        console.error('Error uploading article:', error); // Handle error response
        setDialogMessage('Data not saved.'); // Set error message
        handleClickOpen(); // Open dialog
        setDialogImage(wrong);
    }
};

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('description', description);
//     if (images.length > 0) {
//         formData.append('image', images[0].file); // Assuming single image upload
//     }
//     const token = localStorage.getItem('jwtToken'); 
//     try {
//         const response = await axios.post(    `${process.env.REACT_APP_API_URL}/article`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Authorization': `Bearer ${token}`, // Replace with your actual token
//             },
//         });
//         console.log(response.data); // Handle success response
//     } catch (error) {
//         console.error('Error uploading article:', error); // Handle error response
//     }
// };
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        display:"flex",
        flexDirection:"column",
        
        ...theme.typography.body2,
        padding: theme.spacing(6),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      }));
  return (
   <Grid container sx={{display:"flex",justifyContent:"center",marginTop:14}}>
    <Grid item md={5} sm={5}>
<Item>
    <Typography variant='h4'sx={{marginBottom:5}}>
        Post The Article
        </Typography> 
     <TextField
      
          label="Description"
          multiline
          maxRows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
           variant="outlined"
            fullWidth
        />
  <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
        
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper"
          >
              {imageList.length === 0 && (
            <button
            //   style={isDragging ? { color: 'red' } : undefined}
            style={{marginTop:6,marginBottom:20,  border: '2px dotted grey', // Set border style
                height: 60, // Ensure full height
                width: '100%',borderRadius:8,}}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            )}
         
            
            {imageList.map((image, index) => (
              <div key={index} className="image-item" style={{display:"flex",justifyContent:"space-around",marginTop:6, marginBottom:20, border: '2px dotted grey', // Set border style
                
                width: '100%',borderRadius:8,}}>
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper"style={{display:"flex",alignItems:"center",gap:6}}>
                    <DeleteForeverIcon color='secondary' sx={{cursor:"pointer"}} onClick={() => onImageRemove(index)} />
                   <CloudUploadIcon color='primary' sx={{cursor:"pointer"}} onClick={() => onImageUpdate(index)} />
                 
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      <Button  variant="contained"onClick={handleSubmit}   >Submit</Button>
      <AlertDialogSlide 
        open={dialogOpen} 
        handleClose={handleClose} 
        message={dialogMessage} 
        imageUrl={dialogImage}
      />
</Item>
</Grid>
   </Grid>
  )
}

export default Post