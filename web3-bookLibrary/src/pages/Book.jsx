import { useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import bookABI from '../abi/Book.json';
import { ethers } from 'ethers';

const Book = ({ name, copies }) => {

    const { data: signer } = useSigner();
    const contractAddress = '0x638Ef690c16cfb09C0a048CB0B6f8bDcc9afB4C8';

    const [contract, setContract] = new useState();
    const [formSubmitError, setFormSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (signer) {
                const bookContract = new ethers.Contract(contractAddress, bookABI.abi, signer);
                setContract(bookContract);
            }
        }

        fetchData();

    }, [signer, contractAddress]);

    const borrowBookClickHandler = async () => {
        setIsLoading(true);
        try {
            const tx = await contract.borrowBook(name);

            await tx.wait();
        } catch (e) {
            setFormSubmitError(e.reason);
        } finally {
            setIsLoading(false);
        }
    }

    const returnBookClickHandler = async () => {
        setIsLoading(true);

        try {
            const tx = await contract.returnBook(name);

            await tx.wait();
        } catch (e) {
            setFormSubmitError(e.reason);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {isLoading ? (
                <div className="mt-5 d-flex justify-content-center">
                    <>
                        <span
                            className="spinner-border me-5"
                            role="status"
                            aria-hidden="true"
                        ></span>{' '}
                        <span>Loading...</span>
                    </>
                </div>
            ) : null}
            {formSubmitError ? (
                <div className="alert alert-danger mb-4">{formSubmitError}</div>
            ) : null}
            <div key={name} className="card m-5">
                <div className="card-body">
                    <h4 className="card-title text-center">{name}</h4>
                    <p className="text-center">Copies: {copies}</p>
                </div>
                <div className="card-footer">
                    <a onClick={borrowBookClickHandler} className="btn btn-success mx-4"> Borrow</a>
                    <a onClick={returnBookClickHandler} className="btn btn-danger mx-4">Return</a>
                </div>

            </div>

        </div>
    );

}

export default Book;