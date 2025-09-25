// frontend-client/src/components/Authentication/Signup.js

import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import API from "../../api";
import { useNavigate } from "react-router-dom"; // Changed this line

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const navigate = useNavigate(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [password, setPassword] = useState('');
    const [picture, setpicture] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
            return; // Added setLoading(false) here to ensure loading state resets
        }
        console.log(name, email, password, picture);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            // const { data } = await axios.post(
            const { data } = await API.post(
                "/api/user",
                {
                    name,
                    email,
                    password,
                    picture,
                },
                config
            );
            // console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats"); 
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message, // Fallback to a general error message
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
        }
        
    };

    const postDetails = (pictures) => {
        setLoading(true);
        if (pictures === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false); // Added this to reset loading state
            return;
        }
        console.log(pictures);
        if (pictures.type === "image/jpeg" || pictures.type === "image/png") {
            const data = new FormData();
            data.append("file", pictures);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "ddxwgqd7m");
            fetch("https://api.cloudinary.com/v1_1/ddxwgqd7m/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setpicture(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Image upload failed!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
            return;
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="picture">
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
