import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

// Sample data for the cards


export default function Home() {
    const [articles, setArticles] = React.useState([]); // State to hold articles
  const [loading, setLoading] = React.useState(true); // State to manage loading state
  const [error, setError] = React.useState(null);
   // Fetch articles from the API
   React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-articles`); // Adjust the API endpoint as necessary
        setArticles(response.data); // Set the articles state with the fetched data
        console.log(response.data)
      } catch (err) {
        setError(err.message); // Set error state if there's an error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchArticles();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error message
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: "center" }}>
      {articles.map((article) => (
        <Card key={article._id} sx={{ maxWidth: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {article.name.charAt(0)} {/* Display the first letter of the name */}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={article.name} // Use description as the title
            subheader={new Date(article.createdAt).toLocaleDateString()} // Format the date
          />
          <CardMedia
            component="img"
            height="194"
            image={`http://localhost:5000/${article.image.replace(/\\/g, '/')}`}
            alt={article.image}
          />
          <CardContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {article.description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
