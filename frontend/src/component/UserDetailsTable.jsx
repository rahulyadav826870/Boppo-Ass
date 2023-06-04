import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Text,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Icon,
  Button,
  Flex,
  FormLabel,
  Input,
  useDisclosure,
  Tbody,
  Tr,
  Td,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

const initalData = {
  first: "",
  last: "",
  email: "",
  phoneNo: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function UserDetailsTable({
  _id,
  first,
  last,
  email,
  phoneNo,
  dob,
  address,
  city,
  state,
  pincode,
  getData,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [loading,setLoading] =useState(false)

  const [editUserId, setEditUserId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const toast = useToast();

  const [formData, setFormData] = useState(initalData);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailBlur = () => {
    const emailValid = validateEmail(formData.email);
    setErrors({
      ...errors,
      email: emailValid ? "" : "Invalid email address",
    });
  };

  const validatePhoneNumber = (phoneNo) => {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNo)) {
      return "Invalid phone number. Please enter a 10-digit number.";
    }
    if (/[^\d]/.test(phoneNo)) {
      return "Phone number should only contain digits.";
    }
    return "";
  };

  const handlePhoneBlur = () => {
    const phoneValid = validatePhoneNumber(formData.phoneNo);
    setErrors({
      ...errors,
      phoneNo: phoneValid,
    });
  };

  const handleDOBInput = (e) => {
    const enteredDOB = e.target.value;
    const currentDate = new Date().toISOString().split("T")[0];

    if (enteredDOB > currentDate) {
      e.target.value = currentDate;

      setFormData({ ...formData, dob: currentDate });
    } else {
      setFormData({ ...formData, dob: enteredDOB });
    }
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };
  const handlePincodeBlur = () => {
    const pincode = validatePincode(formData.pincode);
    setErrors({ ...errors, pincode: pincode ? "" : "Enter only 6 Digits" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Check if any required fields are empty
    const requiredFields = [
      "first",
      "last",
      "email",
      "phoneNo",
      "dob",
      "pincode",
      "city",
      "state",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      const errorMessages = emptyFields.reduce((errors, field) => {
        return { ...errors, [field]: "This field is required." };
      }, {});

      setErrors(errorMessages);
      return;
    } else {
      setErrors({});
    }
    let formErrors = {};

    // Perform form validation
    if (!validateEmail(formData.email)) {
      formErrors.email = "Invalid email address";
    }
    const validatePhoneNumber1 = (phoneNo) => {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phoneNo);
    };
    if (!validatePhoneNumber1(formData.phoneNo)) {
      formErrors.phoneNo = "Invalid phone number";
    }

    if (!validatePincode(formData.pincode)) {
      formErrors.pincode = "Invalid pincode";
    }

    // Set the validation errors
    setErrors(formErrors);
    setButtonDisabled(true);
    if (Object.keys(formErrors).length === 0) {
      // Perform form submission logic

      if (editUserId) {
        // Updating an existing user
        setLoading(true)
        axios
          .put(`https://boppoapi.onrender.com/user/update/${editUserId}`, formData)
          .then((res) => {
            // console.log(res.data.msg);
            toast({
              title: `${res.data.msg}`,
              status: "success",
              duration: 2000,
              isClosable: true,
           
            });
            setEditUserId(null); // Reset editUserId after successful update
            getData();
            onClose();
            setLoading(false)
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // Adding a new user
        axios
          .post("https://boppoapi.onrender.com/user/register", formData)
          .then((res) => {
            // console.log(res.data.msg);
            toast({
              title: `${res.data.msg}`,
              status: "success",
              duration: 2000,
              isClosable: true,
         
            });
            onClose();
            getData();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const handleDelete = (id) => {
    setLoading(true)
    return axios.delete(`https://boppoapi.onrender.com/user/delete/${id}`)
      .then((res) => {
        // console.log(res.data.msg);
        toast({
          title: `${res.data.msg}`,
          status: "success",
          colorScheme: "red",
          duration: 2000,
          isClosable: true,
 
        });
        setLoading(false)
        getData();
      });
  };

  useEffect(() => {
    if (editUserId) {
      axios
        .get(`https://boppoapi.onrender.com/user/${editUserId}`)
        .then((res) => {
          const userData = res.data;
          setFormData(userData); // Set the fetched user data in the form
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [editUserId]);

  return (
    <>
      <Tbody>
        <Tr>
          <Td>{first + " " + last}</Td>
          <Td display={{ base: "none", md: "table-cell" }}>{email}</Td>
          <Td>{phoneNo}</Td>
          <Td display={{ base: "none", md: "none", lg: "table-cell" }}>
            {dob}
          </Td>
          <Td display={{ base: "none", md: "none", lg: "table-cell" }}>
            {city + "," + " " + state}
          </Td>
          <Td display={{ base: "none", md: "table-cell" }}>{pincode}</Td>
          <Td px={{ base: "0px", md: "5px", lg: "20px" }}>
            <Flex justifyContent={"space-evenly"}>
              <Button
                onClick={() => {
                  setEditUserId(_id);
                  onOpen();
                }}
                padding={{ base: 2, md: 4 }}
              >
                <Icon as={FiEdit} color="green.500" />
              </Button>
              <Button
                padding={{ base: 2, md: 4 }}
                onClick={() => handleDelete(_id)}
              >
               {loading ?  <Spinner
                thickness="3px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#f7cb93"
                size="md"
              /> :  <Icon as={MdDeleteForever} color="red.500" />}
              </Button>
            </Flex>
          </Td>
        </Tr>
      </Tbody>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editUserId ? "Edit User" : "Create User"}</ModalHeader>
          <ModalCloseButton />
          <form action="">
            <ModalBody pb={6}>
              <Flex justifyContent={"space-between"}>
                <FormControl pr={"2%"}>
                  <FormLabel>
                    First name{" "}
                    <Icon p={"2%"} as={AiFillStar} color="red.500" ml={1} />
                  </FormLabel>
                  <Input
                    name="first"
                    value={formData.first}
                    onChange={handleChange}
                    placeholder="First name"
                    isRequired={true}
                  />
                  <Text className="error" color="red.500">
                    {errors.first}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>
                    Last name{" "}
                    <Icon as={AiFillStar} p={"2%"} color="red.500" ml={1} />
                  </FormLabel>
                  <Input
                    name="last"
                    value={formData.last}
                    onChange={handleChange}
                    placeholder="Last name"
                    isRequired={true}
                  />
                  <Text className="error" color="red.500">
                    {errors.last}
                  </Text>
                </FormControl>
              </Flex>

              <FormControl mt={4}>
                <FormLabel>
                  Email <Icon as={AiFillStar} p={"1%"} color="red.500" ml={1} />
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  onBlur={handleEmailBlur}
                  isInvalid={!!errors.email}
                  isRequired={true}
                />
                <Text className="error" color="red.500">
                  {errors.email}
                </Text>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>
                  Phone Number{" "}
                  <Icon as={AiFillStar} p={"1%"} color="red.500" ml={1} />
                </FormLabel>
                <Input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  onBlur={handlePhoneBlur}
                  isRequired={true}
                  isInvalid={!!errors.email}
                />
                <Text className="error" color="red.500">
                  {errors.phoneNo}
                </Text>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>
                  DOB <Icon as={AiFillStar} p={"1%"} color="red.500" ml={1} />
                </FormLabel>
                <Input
                  name="dob"
                  value={formData.dob}
                  onInput={handleDOBInput}
                  onChange={handleChange}
                  type="date"
                  isRequired={true}
                />
                <Text className="error" color="red.500">
                  {errors.dob}
                </Text>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  onChange={handleChange}
                  value={formData.address}
                  placeholder="Address"
                />
              </FormControl>

              <Flex justifyContent={"space-between"}>
                <FormControl mt={4} pr="5%">
                  <FormLabel>
                    City{" "}
                    <Icon as={AiFillStar} p={"2%"} color="red.500" ml={1} />
                  </FormLabel>
                  <Input
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                    isRequired={true}
                    placeholder="City"
                  />
                  <Text className="error" color="red.500">
                    {errors.city}
                  </Text>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>
                    State{" "}
                    <Icon as={AiFillStar} p={"2%"} color="red.500" ml={1} />
                  </FormLabel>
                  <Input
                    name="state"
                    onChange={handleChange}
                    value={formData.state}
                    isRequired={true}
                    placeholder="State"
                  />
                  <Text className="error" color="red.500">
                    {errors.state}
                  </Text>
                </FormControl>
              </Flex>
              <FormControl mt={4}>
                <FormLabel>
                  Pincode{" "}
                  <Icon as={AiFillStar} p={"1%"} color="red.500" ml={1} />
                </FormLabel>
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  onBlur={handlePincodeBlur}
                  placeholder="Pincode"
                  isInvalid={!!errors.pincode}
                />
                <Text className="error" color="red.500">
                  {errors.pincode}
                </Text>
              </FormControl>
            </ModalBody>
          </form>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} mr={3} disabled={buttonDisabled}>
            {loading ? (
              <Spinner
                thickness="3px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#f7cb93"
                size="md"
              />
            ) : (
              editUserId ? "Save Changes" : "Create"
            )}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  );
}
