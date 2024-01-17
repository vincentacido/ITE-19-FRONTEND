import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

export default function Login({ handleLogin, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username && !password) {
      setError("Username and password are required.");
      return;
    }

    if (!username) {
      setError("Please enter your username");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const configuration = {
      method: "post",
      url: "http://localhost:8000/api/login",
      data: {
        username,
        password,
      },
    };

    axios(configuration)
      .then((result) => {
        handleLogin(result.data.token);
        history.push("/vehicle-list");
      })
      .catch((error) => {
        setError("Invalid username or password."); // Handle specific errors from the API if needed
      });
  };

  return (
    <div className="login-register-form">
      <div className="login-register-box">
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Login
          </Button>
        </Form>

        <div className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register now!</Link>
        </div>
      </div>
    </div>
  );
}