import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient, goerli } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Election from '../pages/Election';
import BooksLibrary from '../pages/BooksLibrary';
import AddBook from '../pages/AddBook';
import MyBooks from '../pages/MyBooks';
import MessageSigningExample from '../pages/MessageSigningExample'
import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  const { provider } = configureChains([sepolia], [publicProvider()]);

  const client = createClient({
    provider,
    autoConnect: true,
  });

  return (
    <BrowserRouter>
      <WagmiConfig client={client}>
        <div className="wrapper">
          <Header />
          <div className="main">
            <Routes>
              <Route path="/" element={<BooksLibrary />} />
              <Route path='/addBook' element={<AddBook />}></Route>
              <Route path='/myBooks' element={<MyBooks />}></Route>
              <Route path='/ele' element={<Election />}></Route>
              <Route path='/sign' element={<MessageSigningExample />}></Route>

            </Routes>
          </div>
          <Footer />
        </div>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
