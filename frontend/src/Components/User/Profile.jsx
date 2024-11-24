import React, { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, Button, Typography, Card, CardMedia, CardContent, TextField } from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    password: ""
  });

  useEffect(() => {
    // const fetchProfile = async () => {
    //   try {
    //     const response = await fetch('http://localhost:4001/api/v1/profile', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       }
    //     });

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     if (data.success) {
    //       setProfile({
    //         name: data.user.name,
    //         email: data.user.email,
    //         phone: data.user.phone,
    //         address: data.user.address,
    //         avatar: data.user.avatar,
    //         password: "" // Do not set the password
    //       });
    //     } else {
    //       alert("Failed to fetch profile.");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching profile:", error);
    //     alert("Failed to fetch profile.");
    //   }
    // };

    // fetchProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4001/api/v1/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
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
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <div style={{ padding: "20px" }}>
          <Typography variant="h5" fontWeight="bold">
            MY PROFILE
          </Typography>
        </div>
        <List>
          {["My Profile", "My Orders", "My Reviews"].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Profile Section */}
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
        <Typography variant="subtitle1" color="textSecondary">
          Founding member | 10+ nights booked and hosted | Their home is a popular pick
        </Typography>

        {/* Profile Content */}
        <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
          {/* Profile Images */}
          <div style={{ flex: 1 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={profile.avatar || "/path-to-default-image.jpg"}
                alt="Main photo"
              />
            </Card>
          </div>

          {/* About Us */}
          <div style={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  About us
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: "10px" }}>
                  Live in SF, work remotely, but love Palm Springs! Parents to 2 young kiddos.
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
            <TextField
              label="Password"
              name="password"
              type="password"
              value={profile.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
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