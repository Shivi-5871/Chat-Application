// //DATABASE WALA TRY KIYA THA
// import { Badge, Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, effect, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
// import React, { useState } from 'react';
// import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
// import { ChatState } from '../../Context/ChatProvider';
// import ProfileModal from './ProfileModal';
// import { useNavigate } from 'react-router-dom';
// import { useDisclosure } from '@chakra-ui/hooks';
// import axios from 'axios';
// import ChatLoading from '../ChatLoading';
// import UserListItem from '../UserAvatar/UserListItem';
// import { getSender } from '../../config/ChatLogics';

// const SideDrawer = () => {
//     const toast = useToast();
//     const navigate = useNavigate();
//     const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
//     const { isOpen, onOpen, onClose } = useDisclosure();

//     const [search, setSearch] = useState("");
//     const [searchResult, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [loadingChat, setLoadingChat] = useState(false);

//     const logoutHandler = () => {
//         localStorage.removeItem("userInfo");
//         navigate("/");
//     };

//     const handleSearch = async () => {
//         if (!search) {
//             toast({
//                 title: "Please Enter a User to Search",
//                 status: "warning",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top-right",
//             });
//             return;
//         }

//         try {
//             setLoading(true);
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             };
//             const { data } = await axios.get(`/api/user?search=${search}`, config);
//             setSearchResults(data);
//             setLoading(false);
//         } catch (error) {
//             toast({
//                 title: "Error Occurred!",
//                 description: error.response.data.message,
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top-right",
//             });
//             setLoading(false);
//         }
//     };

//     const accessChat = async (userId) => {
//         try {
//             setLoadingChat(true); // Start loading state
//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             };
//             const { data } = await axios.post(`/api/chat`, { userId }, config);

//             // Check if the chat already exists in the state
//             if (!chats.find((c) => c._id === data._id)) {
//                 setChats([...chats, data]); // Add new chat to the state
//                 await storeNotification(data); // Store notification for new chat
//             }

//             setLoadingChat(false); // End loading state
//             setSelectedChat(data); // Set the selected chat
//             onClose(); // Close the drawer

//         } catch (error) {
//             toast({
//                 title: "Error Occurred!",
//                 description: error.response?.data?.message || "An error occurred. Please try again.",
//                 status: "error",
//                 duration: 5000,
//                 isClosable: true,
//                 position: "top-right",
//             });
//         }
//     };

//     const storeNotification = async (chat) => {
//         try {
//             const notificationData = {
//                 userId: user._id,
//                 message: `New message in ${chat.chatName || 'chat'}`,
//                 chatId: chat._id,
//             };
//             await axios.post('/api/notifications', notificationData); // Store the notification in the database
//             setNotification((prev) => [...prev, { chat, _id: Date.now() }]); // Update local state
//         } catch (error) {
//             console.error("Error storing notification:", error);
//         }
//     };

//     return (
//         <>
//             <Box 
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 bg="white"
//                 w="100%"
//                 p="5px 10px 5px 10px"
//                 borderWidth="5px"
//             >
//                 <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
//                     <Button variant='ghost' onClick={onOpen}>
//                         <i className="fas fa-search"></i>
//                         <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
//                     </Button>
//                 </Tooltip>

//                 <Text fontSize="2xl" fontFamily="Work sans">
//                     Chat Application
//                 </Text>

//                 <Menu>
//                     <MenuButton p={1}>
//                         <Badge
//                             count={notification.length}
//                             effect={effect.SCALE}
//                         />
//                         <BellIcon fontSize="2xl" m={1} />
//                     </MenuButton>
//                     <MenuList pl={2}>
//                         {!notification.length && "No New Messages"}
//                         {notification.map((notif) => (
//                             <MenuItem
//                                 key={notif._id}
//                                 onClick={() => {
//                                     setSelectedChat(notif.chat);
//                                     setNotification(notification.filter((n) => n !== notif));
//                                 }}
//                             >
//                                 {notif.chat.isGroupChat
//                                     ? `New Message in ${notif.chat.chatName}`
//                                     : `New Message from ${getSender(user, notif.chat.users)}`}
//                             </MenuItem>
//                         ))}
//                     </MenuList>
//                 </Menu>

//                 <Menu>
//                     <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
//                         <Avatar
//                             size="sm"
//                             cursor="pointer"
//                             name={user.name}
//                             src={user.picture}
//                         />
//                     </MenuButton>
//                     <MenuList>
//                         <ProfileModal user={user}>
//                             <MenuItem>My Profile</MenuItem>{" "}
//                         </ProfileModal>
//                         <MenuDivider />
//                         <MenuItem onClick={logoutHandler}>Logout</MenuItem>
//                     </MenuList>
//                 </Menu>
//             </Box>

//             <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
//                 <DrawerOverlay />
//                 <DrawerContent>
//                     <DrawerHeader borderBottomWidth="1px">Search Users </DrawerHeader>

//                     <DrawerBody>
//                         <Box>
//                             <Input
//                                 placeholder="Search Users"
//                                 m={1}
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                             <Button onClick={handleSearch}> Go </Button>
//                         </Box>
//                         {loading ? (
//                             <ChatLoading />
//                         ) : (
//                             <>
//                                 {searchResult?.map((user) => (
//                                     <UserListItem
//                                         key={user._id}
//                                         user={user}
//                                         handleFunction={() => accessChat(user._id)} 
//                                     />
//                                 ))}
//                                 {loadingChat && <Spinner size="lg" color="blue.500" ml="auto" display="block" />}
//                             </>
//                         )}
//                     </DrawerBody>
//                 </DrawerContent>
//             </Drawer>
//         </>
//     )
// }

// export default SideDrawer;

























import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast, Badge } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      navigate("/");
  };

  const handleSearch = async () => {
      if (!search) {
          toast({
              title: "Please Enter a User to Search",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top-right",
          });
          return;
      }

      try {
          setLoading(true);
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`,
              },
          };
          const { data } = await axios.get(`/api/user?search=${search}`, config);
          setSearchResults(data);
          setLoading(false);
      } catch (error) {
          toast({
              title: "Error Occurred!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
          });
          setLoading(false);
      }
  };

  const accessChat = async (userId) => {
      try {
          setLoadingChat(true); // Start loading state
          const config = {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
              },
          };
          const { data } = await axios.post(`/api/chat`, { userId }, config);

          // Check if the chat already exists in the state
          if (!chats.find((c) => c._id === data._id)) {
              setChats([...chats, data]); // Add new chat to the state
              await storeNotification(data); // Store notification for new chat
          }
          setNotification((prev) => prev.filter((n) => n.chat._id !== data._id));
          setLoadingChat(false); // End loading state
          setSelectedChat(data); // Set the selected chat
          onClose(); // Close the drawer

      } catch (error) {
          toast({
              title: "Error Occurred!",
              description: error.response?.data?.message || "An error occurred. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
          });
      }
  };

  const storeNotification = async (chat) => {
      try {
          const notificationData = {
              userId: user._id,
              message: `New message in ${chat.chatName || 'chat'}`,
              chatId: chat._id,
          };
          await axios.post('/api/notifications', notificationData); // Store the notification in the database
          setNotification((prev) => [...prev, { chat, _id: Date.now() }]); // Update local state
      } catch (error) {
          console.error("Error storing notification:", error);
      }
  };

  return (
      <>
          <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bg="white"
              w="100%"
              p="5px 10px 5px 10px"
              borderWidth="5px"
          >
              <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                  <Button variant='ghost' onClick={onOpen}>
                      <i className="fas fa-search"></i>
                      <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                  </Button>
              </Tooltip>

              <Text fontSize="2xl" fontFamily="Work sans">
                  Chat Application
              </Text>

              <Menu>
                  <MenuButton p={1}>
                      <Badge colorScheme="red" borderRadius="full" px={2} variant="solid">
                          {notification.length}
                      </Badge>
                      <BellIcon fontSize="2xl" m={1} />
                  </MenuButton>
                  <MenuList pl={2}>
                      {!notification.length && "No New Messages"}
                      {notification.map((notif) => (
                          <MenuItem
                              key={notif._id}
                              onClick={() => {
                                  setSelectedChat(notif.chat);
                                  setNotification(notification.filter((n) => n !== notif));
                                  // setNotification((prev) => prev.filter((n) => n._id !== notif._id));
                              }}
                          >
                              {notif.chat.isGroupChat
                                  ? `New Message in ${notif.chat.chatName}`
                                  : `New Message from ${getSender(user, notif.chat.users)}`}
                          </MenuItem>
                      ))}
                  </MenuList>
              </Menu>

              <Menu>
                  <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                      <Avatar
                          size="sm"
                          cursor="pointer"
                          name={user.name}
                          src={user.picture}
                      />
                  </MenuButton>
                  <MenuList>
                      <ProfileModal user={user}>
                          <MenuItem>My Profile</MenuItem>
                      </ProfileModal>
                      <MenuDivider />
                      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
              </Menu>
          </Box>

          <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                  <DrawerHeader borderBottomWidth="1px">Search Users </DrawerHeader>

                  <DrawerBody>
                      <Box>
                          <Input
                              placeholder="Search Users"
                              m={1}
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                          />
                          <Button onClick={handleSearch}> Go </Button>
                      </Box>
                      {loading ? (
                          <ChatLoading />
                      ) : (
                          <>
                              {searchResult?.map((user) => (
                                  <UserListItem
                                      key={user._id}
                                      user={user}
                                      handleFunction={() => accessChat(user._id)}
                                  />
                              ))}
                              {loadingChat && <Spinner size="lg" color="blue.500" ml="auto" display="block" />}
                          </>
                      )}
                  </DrawerBody>
              </DrawerContent>
          </Drawer>
      </>
  );
}

export default SideDrawer;
