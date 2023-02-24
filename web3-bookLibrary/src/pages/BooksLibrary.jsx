import Book from "./Book";
import { useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import bookABI from '../abi/Book.json';
import { ethers } from 'ethers';

const BooksLibrary = () => {
    const { data: signer } = useSigner();
    const contractAddress = '0x638Ef690c16cfb09C0a048CB0B6f8bDcc9afB4C8';

    const [contractData, setContractData] = useState([]);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingSubmit(true);

            if (signer) {

                const bookContract = new ethers.Contract(contractAddress, bookABI.abi, signer);
                const count = await bookContract.getNumberOfBooks();
                const result = [];
                for (let index = 0; index < count; index++) {
                    const bookKey = await bookContract.bookKeys(index);

                    const book = await bookContract.books(bookKey);

                    result.push({
                        name: book.name,
                        copies: book.copies
                    });
                }

                setContractData(result);
            }
            setIsLoadingSubmit(false);
        }

        fetchData();


    }, [signer, contractAddress]);

    return (
        <div className=" mt-3 ml-3">
            {isLoadingSubmit ? (
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
            ) : (
                <div className="row d-flex d-wrap">
                    <div className="card-deck d-flex flex-wrap justify-content-center">
                        {contractData.map(book => (
                            <Book name={book.name} copies={book.copies.toString()}></Book>
                        ))}
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default BooksLibrary;