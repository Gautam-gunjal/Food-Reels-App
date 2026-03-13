import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/generals/Home';
import Profile from '../pages/food-partner/profile';
import CreateFood from '../pages/auth/CreateFood'
import Saved from '../pages/generals/Saved';

const AppRoutes = ()=>{
    return(
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister/>}/>
                <Route path="/user/login" element={<UserLogin/>}/>
                <Route path="/food-partner/register" element={<FoodPartnerRegister/>}/>
                <Route path="/food-partner/login" element={<FoodPartnerLogin/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/Createfood" element= {<CreateFood/>}/>
                <Route path="/saved" element={<Saved/>} />
                <Route path="/food-partner/:id" element= {<Profile/>}></Route>
            </Routes>
        </Router>
    ) 
}

export default AppRoutes;