import { render } from '@testing-library/react'
import Register from '../src/pages/register'
import Login from '../src/pages/login'
import Index from '../src/pages/index'
import Movies from '../src/pages/movies'
import MyLibrary from '../src/pages/myLibrary'
import { useRouter } from 'next/router';
// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(), // Mock the useRouter hook
}));

describe('Component Snapshot Tests', () => {
  // Define a mock implementation of useRouter before each test
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),    // Mock push method
      replace: jest.fn(), // Mock replace method
      back: jest.fn(),    // Mock back method
    }));
  });

  // Define the test cases
  const testCases = [
    { name: 'register', component: <Register /> },
    { name: 'login', component: <Login /> },
    { name: 'homepage', component: <Index /> },
    { name: 'movies', component: <Movies /> },
    { name: 'myLibrary', component: <MyLibrary /> },
  ];

  // Iterate over each test case
  testCases.forEach(({ name, component }) => {
    it(`renders ${name} unchanged`, () => {
      const { container } = render(component);
      expect(container).toMatchSnapshot();
    });
  });
});
