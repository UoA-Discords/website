/* eslint-disable testing-library/prefer-screen-queries */
import { CssBaseline } from '@mui/material';
import { render } from '@testing-library/react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';

test(`renders the home page`, () => {
    const { getAllByText } = render(
        <Provider store={store}>
            <CookiesProvider>
                <CssBaseline />
                <App />
            </CookiesProvider>
        </Provider>,
    );

    expect(getAllByText(/uoa discords/i).length > 0).toBe(true);
});
