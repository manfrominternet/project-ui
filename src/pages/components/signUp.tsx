import Link from 'next/link';
import React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import styles from "@/styles/Home.module.css";
import router from 'next/router';

const Button = styled.button<{disabled: boolean}>`
  height: 30px;
  width: 70px;
  background-color: white;
  color: black;
  opacity: ${props => props.disabled ? 0.5 : 1};
  margin-top: 10px;
`;
const SignUp = () => {
  const [validated, setValidated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const confirmationError = useRef<HTMLParagraphElement | null>(null);
  const progressBar = useRef<HTMLDivElement | null>(null);
  const [accountExists, setAccountExists] = useState<boolean>(false);
  // const registerAction = () => ;
  const fetchUsers = useCallback(async (firstName: string, lastName: string, email: string, password: string, movies: string[]) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, movies }),
      });
      console.log(response);
      if(response.status === 409) {
        alert("user already exist, change email")
        setAccountExists(p => !p);
      }
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      if(response.status === 201) router.push('/login')
      //the one below doent work
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (password !== confirmation) {
      if (confirmationError.current) confirmationError.current.style.display = 'block';
    } else {
      if (confirmationError.current) confirmationError.current.style.display = 'none';
    }

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      fetchUsers(firstName, lastName, email, password, []);
    }

    setValidated(true);
  };
  const handlePasswordChange = (password: string) => {
    setPassword(password);
    const letterMatch = (password.match(/[a-zA-Z]/g) || []).length;
    const numberMatch = (password.match(/[0-9]/g) || []).length;
    const specialMatch = (password.match(/[#?!@$%^&*-]/g) || []).length;

    const strength = letterMatch + numberMatch * 2 + specialMatch * 3;
    if (progressBar.current) progressBar.current.style.width = `${strength * 3}%`;
      let color = "red";
    if (strength > 10) {
      color = 'orange';
    }
    if (strength > 26) {
      color = 'green';
    }
    if (progressBar.current) progressBar.current.style.backgroundColor = color;
  };

  return (
    <>
    <Link href={"/"} className = {styles.backToMainPage}>
      Back to Main Page
    </Link>
    <div className='form-wrapper'>
      {accountExists ?? <div>
          Account Exists!
        </div>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>
          Register
        </h2>
        <Container fluid>
          <Row>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <Form.Group>
                <FloatingLabel controlId='firstnamLabel' label='First name'>
                  <Form.Control
                    type='text'
                    placeholder='First name'
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FloatingLabel>
                <Form.Control.Feedback type='invalid'>
                  Do not leave empty
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='lastnameLabel' label='Last name'>
                <Form.Control
                  type='text'
                  placeholder='Last name'
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FloatingLabel>
            </Col>
          </Row>

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
              <Form.Text className='text-muted'>
                We'll (hopefully) never share your email with anyone else.
              </Form.Text>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <FloatingLabel controlId='passwordLabel' label='Password'>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  required
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
              </FloatingLabel>
              <div
                style={{
                  height: '24px',
                  marginTop: '5px',
                  backgroundColor: 'hsl(0, 0%, 74%)',
                  borderRadius: '5px',
                }}
              >
                <div
                  ref={progressBar}
                  style={{
                    height: '100%',
                    borderRadius: '5px',
                    maxWidth: '100%',
                  }}
                ></div>
              </div>
              <Form.Text className='text-muted'>
               Just make it looong!
              </Form.Text>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicConfirmation'>
              <FloatingLabel controlId='confirmationLabel' label='Confirmation'>
                <Form.Control
                  type='password'
                  placeholder='Repeat password'
                  required
                  onChange={(e) => setConfirmation(e.target.value)}
                />
              </FloatingLabel>
              <p
                style={{ color: 'red', display: 'none' }}
                ref={confirmationError}
              >
                Passwords are not the same
              </p>
            </Form.Group>
          </Row>
          <Button disabled={firstName.length == 0 && lastName.length == 0  || ((confirmation.localeCompare(password) != 0 || password.length == 0)) || (progressBar.current && progressBar.current.style.backgroundColor == "red")}>
            Register
          </Button>
        </Container>
      </Form>
    </div>
    </>
  );
};

export default SignUp;