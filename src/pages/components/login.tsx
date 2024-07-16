import Link from 'next/link';
import React, { useState, useCallback, useContext } from 'react';
import { Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import styles from "@/styles/Home.module.css";
import { useRouter } from 'next/router'
import { LoginContext, LoginUpdateContext } from '../_app';

const Button = styled.button<{ disabled: boolean }>`
  height: 30px;
  width: 70px;
  background-color: white;
  color: black;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  margin-top: 10px;
  cursor: pointer;
  content: "35$";
`;

const Login = () => {
  const [validated, setValidated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accountNotFound, setAccountNotFound] = useState<boolean>(false);
  const router = useRouter();
  const contextFunctions = useContext(LoginUpdateContext); 
  console.log(contextFunctions);

  const loginAction = (user: any) => {
    localStorage.setItem('userStorage', JSON.stringify({logged: true, username: user.firstName, boughtMovies: user.movies, email: user.email}));
    contextFunctions.login(user.email);
    contextFunctions.setName(user.firstName);
    contextFunctions.loadMovies(user.movies);
    router.push('/movies')
  };
  const fetchUsers = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        setAccountNotFound(true);
      } else if (response.status === 201) {
        const res = await response.json();
        loginAction(res.data);
      } else if (response.status === 500){
        alert("Wrong email or password");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      fetchUsers(email, password);
    }

    setValidated(true);
  };

  return (
    <>
    <Link href={"/"} className = {styles.backToMainPage}>
      Back to Main Page
    </Link>
    <div className='form-wrapper'>
      {accountNotFound && <div>Account not found!</div>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>
          Log in
        </h2>
        <Container fluid>
          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='emailLabel' label='Enter email'>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FloatingLabel>
              <Form.Control.Feedback type='invalid'>
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <FloatingLabel controlId='passwordLabel' label='Password'>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FloatingLabel>
              <Form.Control.Feedback type='invalid'>
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button disabled={email.length === 0 || password.length === 0} onClick={() => fetchUsers(email, password)}>
            Log In
          </Button>
        </Container>
      </Form>
    </div>
    </>
  );
};

export default Login;
