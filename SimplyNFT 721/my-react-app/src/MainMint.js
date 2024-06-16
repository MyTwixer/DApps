import {useState} from 'react';
import {Box, Button, Flex, Input, Text} from "@chakra-ui/react";
import SimplyToken from './SimplyNFT.json';

const SimpleTokenAddress = "0x8Bd2082f0339b19F059BDF85B0906b2DA2F1C439";
const {ethers} = require("ethers");
const {toBigInt} = require("ethers");

const MainMint = ({accounts, setAccounts}) => {
    const [mintAmount, setMintAccount] = useState(1);
    const isConnected = Boolean(accounts[0]);
    const AMOUNT = ethers.parseEther((0.02 * mintAmount).toString())

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const singer = await provider.getSigner();
            const contract = new ethers.Contract(
                SimpleTokenAddress,
                SimplyToken.abi,
                singer
            );
            try {
                const response = await contract.mint(toBigInt(mintAmount), {
                    value: AMOUNT,
                    gasLimit: 1 * 10 ** 7,
                });
                console.log(`Response: ${response}`)
            } catch(err) {
                console.log(`Error: ${err}`)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAccount(mintAmount - 1);          
    }
    const handleIncrement = () => {
        if (mintAmount >= 3) return;
        setMintAccount(mintAmount + 1);          
    }
    return (
        <Flex justify='center' aling='center' paddingBottom='150px' height='100vh' marginTop='150px'>
            <Box width='650px'>
                <div>
                    <Text fontSize='48px' textShadow='0 5px #000000'>SimplyToken</Text>
                    <Text fontSize='30px' fontFamily='VT323' letterSpacing='-5.5%' textShadow='0 2px 2px #000000'>It`s just a sipmly nft for me, not for you. Get out from here bitch...</Text>
                </div>
            {isConnected ? (
                <div>
                    <Flex justify='center' aling='center'>
                        <Button
                            width='100px'
                            backgroundColor='#D6517D'
                            borderRadius='5px'
                            boxShadow='o 8px 8px 7px #0F0F0F'
                            color='white'
                            cursor='pointer'
                            fontFamily='inherit'
                            fontSize='larger'
                            padding='15px'
                            marginTop='10px'
                            onClick={handleDecrement}>-</Button>
                              <Input
                                type='number'
                                value={mintAmount}
                                readOnly
                                width='200px'
                                height='65px'
                                fontSize='xx-large'
                                textAlign='center'
                                padding='19px'
                                marginTop='10px'
                                ></Input>
                        <Button     
                            width='100px'                   
                            backgroundColor='#D6517D'
                            borderRadius='5px'
                            boxShadow='o 8px 8px 7px #0F0F0F'
                            color='white'
                            cursor='pointer'
                            fontFamily='inherit'
                            padding='15px'
                            marginTop='10px'
                            fontSize='larger'
                            onClick={handleIncrement}>+</Button>
                    </Flex>

                    <Button     
                            width='150px'                   
                            backgroundColor='#D6517D'
                            borderRadius='5px'
                            boxShadow='o 8px 8px 7px #0F0F0F'
                            color='white'
                            cursor='pointer'
                            fontFamily='inherit'
                            padding='15px'
                            marginTop='10px'
                            fontSize='larger'
                            onClick={handleMint}
                                >Mint</Button>
                </div>
            ) : (
                <Text
                color='#D6517D'
                marginTop='70px'
                fontFamily='VT323'
                letterSpacing='-5.5%'
                textShadow='1px 5px #000000'
                >You must be connected to Mint.</Text>
            )}
            </Box>
        </Flex>
    )
}

export default MainMint;
