import React, { useState, useEffect, useCallback } from 'react';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import bookABI from '../abi/Book.json';

const AddBook = () => {
    const { data: signer } = useSigner();

    const contractAddress = '0x5F949F02BBA6cA61039B699Db5d5bC08207A0BA2';

    // Contract states
    const [contract, setContract] = useState();

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [formSubmitError, setFormSubmitError] = useState('');

    const handleSubmitButtonClick = async (e) => {
        setIsLoadingSubmit(true);
        setFormSubmitError('');

        const { name, copies } = e.target;

        try {
            const tx = await contract.addBook(name.value, copies.value);
            await tx.wait();

        } catch (e) {
            setFormSubmitError(e.reason);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    useEffect(() => {
        if (signer) {
            const bookContract = new ethers.Contract(contractAddress, bookABI.abi, signer);

            setContract(bookContract);
        }
    }, [signer]);

    return (
        <div className="container my-5 my-lg-10">
            <div className="row">
                <div className="col-6 offset-3">
                    {formSubmitError ? (
                        <div className="alert alert-danger mb-4">{formSubmitError}</div>
                    ) : null}
                    {isLoadingSubmit ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-3"
                                role="status"
                                aria-hidden="true"
                            ></span>{' '}
                            <span>Loading...</span>
                        </>
                    ) :
                        (
                            <form onSubmit={handleSubmitButtonClick} className="card mt-2">
                                <h2 className="heading-medium text-center">Add Book</h2>
                                <span className="text-center">If the book already exist only the copies will be added</span>
                                <div className="card-body">
                                    <div className="mt-4">
                                        <p className="text-small text-bold">Book Title:</p>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-small text-bold">Copies of that book:</p>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="copies"
                                        />
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-around">
                                    <button type="submit" className="btn btn-primary">Submit</button>

                                </div>
                            </form>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AddBook;