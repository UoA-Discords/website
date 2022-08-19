/* eslint-disable testing-library/prefer-screen-queries */
import { render } from '@testing-library/react';
import App from './App';

test(`renders the home page`, () => {
    const { getAllByText } = render(<App />);

    expect(getAllByText(/uoa discords/i).length > 0).toBe(true);
});
