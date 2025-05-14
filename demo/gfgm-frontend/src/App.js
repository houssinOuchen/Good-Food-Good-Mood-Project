import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import MyRecipes from './pages/MyRecipes';
import PrivateRoute from './Components/PrivateRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/recipes" element={<RecipeList />} />
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                            <Route
                                path="/recipes/add"
                                element={
                                    <PrivateRoute>
                                        <AddRecipe />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/recipes/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <EditRecipe />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/my-recipes"
                                element={
                                    <PrivateRoute>
                                        <MyRecipes />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;