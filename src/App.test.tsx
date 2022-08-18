import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test(`renders the home page`, () => {
    const { getByText } = render(<App />);

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText(/uoa discords/i)).toBeInTheDocument();
});
