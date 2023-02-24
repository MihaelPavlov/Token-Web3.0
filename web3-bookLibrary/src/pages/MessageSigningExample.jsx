import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import bookABI from '../abi/Book.json';
import { Contract } from '@ethersproject/contracts';
import { utils } from 'ethers';

const MessageSigningExample = () => {
    const { library } = useWeb3React();
    const [message, setMessage] = useState("");
    const [signature, setSignature] = useState({ v: '', r: '', s: '' });
    const [signer, setSigner] = useState('');

    const signMessage = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const messageHash = utils.keccak256(utils.toUtf8Bytes(message));

            const { v, r, s } = await provider.getSigner().signMessage(messageHash);
            // sign the message with the signer
            console.log(v, r, s);
            // set the signature state
            setSignature({ v, r, s });
        } catch (error) {
            console.log("Error signing message:", error);
        }
    };

    useEffect(() => {

    }, [signature])

    const verifySignature = async () => {
        const contractAddress = '0x638Ef690c16cfb09C0a048CB0B6f8bDcc9afB4C8'; // replace with the address of your deployed contract
        const contract = new Contract(contractAddress, bookABI.abi, library.getSigner());
        const result = await contract.sign(utils.arrayify(message), signature.v, signature.r, signature.s);
        setSigner(result);
    };

    return (
        <div className="m-5">
            <h1>Digital Signature Example</h1>
            <p>Enter a message to sign:</p>
            <input value={message} onChange={(event) => setMessage(event.target.value)} />
            <br />
            <button onClick={signMessage}>Sign Message</button>
            <br />
            <br />
            {signature.v && (
                <>
                    <p>Signature:</p>
                    <p>v: {signature.v}</p>
                    <p>r: {signature.r}</p>
                    <p>s: {signature.s}</p>
                    <br />
                    <button onClick={verifySignature}>Verify Signature</button>
                </>
            )}
            {signer && (
                <>
                    <p>Signer Address: {signer}</p>
                </>
            )}
        </div>
    );
}

export default MessageSigningExample;