
import { Header } from "./components/Header/Header";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Seasons } from "./components/Seasons/Seasons";
import { Route, Routes } from 'react-router-dom';
import { Home } from "./components/Home/Home";
import {Suspense, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {PrivateRoute}  from "./components/common/PrivateRoute";
import { Profile } from "./components/Profile/Profile";
import { ProductDetails } from "./components/Products/ProductDetails/ProductDetails";
import { ProductsList } from "./components/Products/ProductsList/ProductsList";
import { ProductsContext } from "./contexts/ProductsContext";
import { AuthContext } from "./contexts/AuthContext";
import { FactContext } from "./contexts/FactContext";
import * as productService from './services/productsService'
import * as factService from './services/factService'
import { Logout } from "./components/Logout/Logout";
import { useLocalStorage } from "./services/useLocalStorage";
import { NotFound } from "./components/NotFound/NotFound";
import { Footer } from "./components/Footer/Footer";
import { FactDetails } from "./components/Facts/FactDetails/FactDetails";
import { CreateFact } from "./components/Create/CreateFact/CreateFact";
import { EditProduct } from "./components/Edit/EditProduct/EditProduct";
import { EditFact } from "./components/Edit/EditFact/EditFact";
import './App.css'
import { CreateProduct } from "./components/Create/CreateProduct/CreateProduct";


function App() {
  const [seasonProducts, setSeasonProducts] = useState([]);
  const [facts, setFacts] = useState([]);
  const [user, setUser] = useLocalStorage('user', {})
  const [isPending, setIsPending] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
      productService.getAll()
        .then(data => {
          !data.message && setSeasonProducts(Object.values(data))
        }).catch(err => console.log(err))
 },[]);
 
 useEffect(() => {
  factService.getAll()
    .then(data => {
      !data.message && setFacts(Object.values(data))
    }).catch(err => console.log(err))
},[]);

  const userLogin = (user) => {
    setUser(user)
  }


  const userLogout = () => {
    setUser({})
  }
  const addNewProductHandler = (newProduct) => {
      setSeasonProducts(state => [...state, newProduct]);
      navigate(`/catalog/${newProduct.season}`)
  }
  const editProduct = (prodId, prodData) => {
    setSeasonProducts(state => state.map(x => x._id === prodId ? prodData : x))
    navigate(`/catalog/${prodData.season}/${prodId}`)
  }
  const deleteProduct = (prodId, season) => {
    setSeasonProducts(oldState => oldState.filter(x => x._id !== prodId))
    navigate(`/catalog/${season}`)
} 


const addNewFactHandler = (fact) => {
  setFacts(state => [...state, fact]);
  const currentProd = (seasonProducts.filter(x=> x.name === fact.product)) 
  navigate(`/catalog/${currentProd[0].season}/${currentProd[0]._id}`)
}
const editFact = (factId, factData, season, prodId) => {
  setFacts(oldState => oldState.map(x => x._id === factId ? factData : x))
  navigate(`catalog/${season}/${prodId}/fact/${factId}`)
}

const deleteFact = (factId, season, prodId) => {
  setFacts(oldState => oldState.filter(x => x._id !== factId))
  console.log(`prodId to redirect ${prodId}`);
  navigate(`/catalog/${season}/${prodId}`)
}


  const productContextValue = { seasonProducts, addNewProductHandler, editProduct, deleteProduct, isPending};
  const authContextValue = { user, userLogin, userLogout};
  const factContextValue = { facts, deleteFact, addNewFactHandler, editFact }

  return (
  <ProductsContext.Provider value={productContextValue}>
  <AuthContext.Provider value={authContextValue}>
  <FactContext.Provider value={factContextValue}>
  <Header />
    <div className="root">

  
      <Routes>
          <Route path = '/' element={<Home />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/create/product' element={<PrivateRoute><CreateProduct /></PrivateRoute>}  />
          <Route path='/catalog/:season/:prodId/create' element={<PrivateRoute><CreateFact /></PrivateRoute>}  />
          <Route path='/catalog' element={<Seasons/>}/>
          <Route path='/catalog/:season' element = {<ProductsList/>} />
          <Route path='/catalog/:season/:prodId' element = {<ProductDetails/>} />
          <Route path='/catalog/:season/:prodId/edit' element = {<PrivateRoute><EditProduct /></PrivateRoute>} />
          <Route path='/catalog/:season/:prodId/fact/:factId' element = {<FactDetails />} />
          <Route path='/catalog/:season/:prodId/fact/:factId/edit' element = {<EditFact />} />
          <Route path='/profil' element = {<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path='/logout' element= {<PrivateRoute><Logout /></PrivateRoute>}/>
          <Route path="*" element= {<NotFound />} />
      </Routes>
    <Footer />

    </div>

  </FactContext.Provider>
  </AuthContext.Provider>
  </ProductsContext.Provider>
  );
}

export default App;


