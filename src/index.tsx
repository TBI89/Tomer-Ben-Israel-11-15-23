import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import './index.css';
import reportWebVitals from './reportWebVitals';
import interceptors from './Utils/Interceptors';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

interceptors.create();

root.render(
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
);

reportWebVitals();
