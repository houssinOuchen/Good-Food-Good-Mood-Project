import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

const Home = () => {
  const { user } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const ingredients = input.split(',').map(i => i.trim());
    try {
      setAiLoading(true);
      const res = await axios.post('/api/ai/predict', { ingredients }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert('AI prediction failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
          <div
              className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-20">
              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div
                      className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    Trusted by 10,000+ fitness enthusiasts
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                    Fuel Your
                    <span
                        className="block bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Fitness Journey
                  </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                    Discover scientifically-crafted recipes designed by nutrition experts and fitness professionals.
                    Transform your kitchen into a performance center.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {!user ? (
                      <>
                        <Link
                            to="/register"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Start Free Today
                          <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                        </Link>
                        <Link
                            to="/recipes"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300"
                        >
                          Explore Recipes
                        </Link>
                      </>
                  ) : (
                      <>
                        <Link
                            to="/recipes/add"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Share Your Recipe
                          <i className="fas fa-plus ml-2 group-hover:rotate-90 transition-transform duration-300"></i>
                        </Link>
                        <Link
                            to="/recipes"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300"
                        >
                          Browse Collection
                        </Link>
                      </>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">2.5K+</div>
                    <div className="text-sm text-slate-600 font-medium">Recipes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">10K+</div>
                    <div className="text-sm text-slate-600 font-medium">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">4.9★</div>
                    <div className="text-sm text-slate-600 font-medium">Rating</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                {/* Background decorative elements */}
                <div
                    className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl opacity-20 z-0"></div>
                <div
                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl opacity-20 z-0"></div>

                {/* Main image */}
                <div className="relative z-10">
                  <img
                      src="/images/1000_F.jpg?height=600&width=500"
                      alt="Healthy meal preparation"
                      className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                </div>

                {/* Floating Cards - Higher z-index */}
                <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-fire-alt text-emerald-600"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">450 kcal</div>
                      <div className="text-sm text-slate-500">Per serving</div>
                    </div>
                  </div>
                </div>

                <div
                    className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fas fa-clock text-blue-600"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">15 min</div>
                      <div className="text-sm text-slate-500">Prep time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Generator Section */}
        {user && (
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
                    <i className="fas fa-robot text-2xl text-white"></i>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">AI-Powered Recipe Creation</h2>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    Transform your available ingredients into personalized, nutrition-optimized recipes using our
                    advanced
                    AI technology
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-8 lg:p-12">
                      <div className="space-y-6">
                        <div className="relative">
                      <textarea
                          placeholder="List your ingredients: chicken breast, quinoa, spinach, avocado, cherry tomatoes..."
                          className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-200 placeholder-slate-400"
                          rows={4}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                      />
                          <div className="absolute bottom-4 right-4 text-sm text-slate-400">{input.length}/500</div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={aiLoading || !input.trim()}
                            className="w-full lg:w-auto mx-auto flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                        >
                          {aiLoading ? (
                              <>
                                <div
                                    className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                                Creating Your Recipe...
                              </>
                          ) : (
                              <>
                                <i className="fas fa-magic mr-3"></i>
                                Generate Recipe
                              </>
                          )}
                        </button>
                      </div>

                      {result && (
                          <div
                              className="mt-12 p-8 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200">
                            <div className="text-center mb-8">
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">{result.name}</h3>
                              <p className="text-slate-600">Customized for your ingredients</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                                  <div
                                      className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                    <i className="fas fa-shopping-basket text-emerald-600 text-sm"></i>
                                  </div>
                                  Ingredients
                                </h4>
                                <ul className="space-y-3">
                                  {result.ingredients.map((ing, index) => (
                                      <li
                                          key={index}
                                          className="flex items-center text-slate-700 bg-white rounded-lg p-3 shadow-sm"
                                      >
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                                        {ing}
                                      </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <i className="fas fa-list-ol text-blue-600 text-sm"></i>
                                  </div>
                                  Instructions
                                </h4>
                                <ol className="space-y-4">
                                  {result.steps.map((step, index) => (
                                      <li key={index} className="flex bg-white rounded-lg p-3 shadow-sm">
                                <span
                                    className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                  {index + 1}
                                </span>
                                        <span className="text-slate-700">{step}</span>
                                      </li>
                                  ))}
                                </ol>
                              </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                              <button
                                  className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200">
                                <i className="fas fa-save mr-2"></i>
                                Save to My Recipes
                              </button>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
        )}

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Why Professionals Choose Us</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Built for serious athletes, nutritionists, and fitness enthusiasts who demand excellence in every meal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group relative">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div
                    className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
                  <div
                      className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-dumbbell text-2xl text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Performance Nutrition</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Scientifically formulated recipes optimized for pre-workout, post-workout, and recovery phases
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div
                    className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                  <div
                      className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-chart-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Macro Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Precise nutritional data with macro breakdowns to help you hit your daily targets consistently
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div
                    className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
                  <div
                      className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-users text-2xl text-purple-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Expert Community</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Connect with certified nutritionists, trainers, and elite athletes sharing proven strategies
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div
                    className="relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                  <div
                      className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-mobile-alt text-2xl text-orange-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Integration</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Seamlessly sync with fitness trackers and meal planning apps for a complete nutrition ecosystem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Trusted by Champions</h2>
              <p className="text-xl text-slate-600">See what fitness professionals are saying about our platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <div className="flex items-center mb-6">
                  <div
                      className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-slate-900">Sarah Chen</div>
                    <div className="text-sm text-slate-500">Certified Nutritionist</div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  "The precision of nutritional data and recipe quality is unmatched. I recommend this to all my
                  clients."
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <div className="flex items-center mb-6">
                  <div
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-slate-900">Mike Rodriguez</div>
                    <div className="text-sm text-slate-500">Personal Trainer</div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  "Game-changer for meal prep. My clients love the variety and see real results with these recipes."
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <div className="flex items-center mb-6">
                  <div
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-slate-900">Alex Thompson</div>
                    <div className="text-sm text-slate-500">Competitive Athlete</div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  "Finally, a platform that understands the nutritional needs of serious athletes. Absolutely
                  essential."
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Nutrition?</h2>
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
                Join thousands of fitness professionals and athletes who trust our platform for their nutritional
                success
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {!user ? (
                    <>
                      <Link
                          to="/register"
                          className="group inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-900 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Start Your Free Trial
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                      </Link>
                      <Link
                          to="/recipes"
                          className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white border-2 border-slate-600 rounded-2xl hover:border-slate-400 transition-all duration-300"
                      >
                        Explore Recipes
                      </Link>
                    </>
                ) : (
                    <Link
                        to="/recipes/add"
                        className="group inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-900 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Share Your First Recipe
                      <i className="fas fa-plus ml-2 group-hover:rotate-90 transition-transform duration-300"></i>
                    </Link>
                )}
              </div>

              <div className="mt-12 flex justify-center items-center space-x-8 text-slate-400">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt mr-2"></i>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-mobile-alt mr-2"></i>
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-headset mr-2"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Home; 