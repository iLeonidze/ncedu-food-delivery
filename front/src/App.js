import useToken from "./hooks/useToken";
import useProfile from "./hooks/useProfile";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from 'antd';

import './App.css';
import Auth from "./api/Auth";
import HeaderCustom from "./components/HeaderCustom";
import FooterCustom from "./components/FooterCustom";
import Home from "./components/Home";
import LoginForm from './components/LoginForm'
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import RegistrationForm from "./components/RegistrationForm";
import OrderHistory from "./components/orderComponents/OrderHistory";
import OrderDetails from "./components/orderComponents/OrderDetails";
import SessionDetails from "./components/deliverySessionComponents/SessionDetails";
import History from "./components/deliverySessionComponents/History";

function App() {
  const { token, setToken } = useToken();
  const auth = new Auth(token, setToken);
  const { profile, setProfile } = useProfile();
  return (
    <Layout className="App" style={{minHeight: "100vh"}}>
       <Router>
        <HeaderCustom auth={auth} profile={profile}/>
          <Routes>
            <Route
              path="/"
              element={<Home auth={auth}/>}
            />
            <Route
              path="/profile"
              element={<Profile auth={auth} profile={profile} setProfile={setProfile}/>}
            />
            <Route
                path="/profile/orderHistory"
              >
                <Route index={true} element={<OrderHistory auth={auth}/>}/>
                <Route index={false} path=':orderId' element={<OrderDetails auth={auth} />}/>
            </Route>
                          
            <Route
              path="/signin"
              element={<LoginForm auth={auth} profile={profile} setProfile={setProfile}/>}
            />
            <Route
              path="/signup"
              element={<RegistrationForm />}
            />
            <Route
              path="/signout"
              element={<Logout auth={auth}/>}
            />

            <>
              {profile?.role === 'COURIER' ? 
                <Route 
                  path="/deliverySessions"
                >
                  <Route index={true} element={<History auth={auth} />}/>
                  <Route index={false} path=':sessionId' element={<SessionDetails auth={auth} />}/>
                </Route> : <></>
               }
            </>
            
            <Route path="*" element={<NotFound/>} />
          </Routes>
        <FooterCustom />
      </Router>
    </Layout>
  );
}

export default App;