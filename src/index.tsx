import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<h1>hello world {process.env.REACT_APP_VERSION}</h1>);
