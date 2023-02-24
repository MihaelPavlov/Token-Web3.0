import React from 'react';
import { useConnect, useAccount, useBalance } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { sepolia } from 'wagmi/chains';

import { truncate } from '../../utils';

import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const md5 = require('md5');

function Header() {
  const connector = new MetaMaskConnector({
    chains: [sepolia],
  });

  const { isConnected, address } = useAccount();
  const { connect, isLoading } = useConnect({
    connector,
  });

  const { data } = useBalance({
    address,
  });

  const handleConnectButtonClick = async () => {
    await connect();
  };

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="container d-flex justify-content-around align-item-center">
          <a href="/">
            <img
              src="https://limeacademy.tech/wp-content/uploads/2021/08/limeacademy_logo.svg"
              alt=""
            />
          </a>

          {
            isConnected ?
              <div className='d-flex align-items-center'>
                <Link to="/" className='btn btn-warning mx-5'>View all books</Link>
                <Link to="/addBook" className='btn btn-warning mx-5'>Add New Book</Link>
                <Link to="/myBooks" className='btn btn-warning mx-5'>My Books</Link>
                <Link to="/sign" className='btn btn-warning mx-5'>Sign</Link>

              </div>
              : ""
          }
          <div className="d-flex">

            {isLoading ? (
              <span>Loading...</span>
            ) : isConnected ? (
              <>
                <div className="d-flex align-items-center justify-content-end">
                  <img
                    className="img-profile me-3"
                    src={`https://www.gravatar.com/avatar/${md5(address)}/?d=identicon`}
                    alt=""
                  />
                  <span>{truncate(address, 6)}</span>
                  <span className="mx-3">|</span>
                  <p>
                    <span className="fw-bold">Balance: </span>
                    <span>{Number(data && data.formatted).toFixed(3)} ETH</span>
                  </p>
                </div>
              </>
            ) : (
              <Button onClick={handleConnectButtonClick}>Connect Metamask</Button>
            )}
          </div>

        </div>
      </div>
    </div >
  );
}

export default Header;
