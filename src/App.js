import './App.css';
import Routing from './Routing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import LoaderHelper from './Utils/Loading/LoaderHelper';
import Loading from './Utils/Loading';

function App() {
  return (
    <BrowserRouter>
      <Routing />
      <Loading ref={ref => LoaderHelper.setLoader(ref)} />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
