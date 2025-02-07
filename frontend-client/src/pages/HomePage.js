import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();  // Replaced useHistory with useNavigate

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));  // Use JSON.parse

      if (user) {
          navigate("/chats");  // Use navigate instead of history.push
      }
  }, [navigate]);

    return (
        <Container maxW="xl" centerContent>
          <Box
            display="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
          >
            <Text fontSize="4xl" fontFamily="Work sans">
              Chat Application
            </Text>
          </Box>
          <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      );
}

export default HomePage
