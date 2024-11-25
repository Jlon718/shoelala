import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, Typography, Card, CardMedia, CardContent, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    password: ""
  });
  const [avatarPreview, setAvatarPreview] = useState("/path-to-default-image.jpg");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/v1/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch profile:', errorData.message);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            address: data.user.address,
            avatar: data.user.avatar.url,
          });
          setAvatarPreview(data.user.avatar.url);
        } else {
          console.error('Error fetching profile:', data.message);
          alert("Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('address', profile.address);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const response = await fetch('http://localhost:4001/api/v1/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f9f9f9" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Typography variant="h4" fontWeight="bold">
            {profile.name}
          </Typography>
          <Button variant="contained" color="primary">
            Hi, {profile.name}
          </Button>
        </div>

        {/* Profile Content */}
        <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
          {/* Profile Images */}
          <div style={{ flex: 1 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={avatarPreview}
                alt="Main photo"
              />
            </Card>
          </div>

          {/* About Us */}
          <div style={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  About Me
                </Typography>
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Name:</strong> {profile.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Email:</strong> {profile.email}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Phone:</strong> {profile.phone}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Address:</strong> {profile.address}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div style={{ marginTop: "40px" }}>
          <Typography variant="h5" fontWeight="bold">
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
            <Button type="submit" variant="contained" color="primary">
              Update Profile
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;