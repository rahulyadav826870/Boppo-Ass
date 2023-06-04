import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useDisclosure,
  Text,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import UserDetailsTable from "./UserDetailsTable";
import {
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  useToast,
} from "@chakra-ui/react";

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

export default function UserDetails() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const toast = useToast();

  const [formData, setFormData] = useState(initalData);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [length, setLength] = useState(0);

  const [loading, setLoading] = useState(false);

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
    // return phoneRegex.test(phoneNo);
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
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const postUserData = (data) => {
    return axios
      .post("https://boppoapi.onrender.com/user/register", data)
      .then((res) => {
        // console.log(res.data.msg);

        toast({
          title: `${res.data.msg}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        if (res.data.msg !== "User already exists.") {
          setFormData(initalData);
        }
        getData();
        setLoading(false);
      });
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
      // Update errors state to display error messages for empty fields
      const errorMessages = emptyFields.reduce((errors, field) => {
        return { ...errors, [field]: "This field is required." };
      }, {});

      setErrors(errorMessages);
      return;
    }
    {
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
    setLoading(true);
    if (Object.keys(formErrors).length === 0) {
      // Perform form submission logic
      // console.log("formData: ", formData);
      postUserData(formData);
    }
  };

  const getData = () => {
    return axios.get("https://boppoapi.onrender.com/user").then((res) => {
      // console.log(res.data)
      setData(res.data);
      setLength(res.data.length);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Flex justifyContent={"space-between"} mx={"10%"} my={"2%"}>
        <Heading>All Users</Heading>
        <Button colorScheme="cyan" onClick={onOpen}>
          Add User
        </Button>
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Detalis</ModalHeader>
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
                  placeholder="create-email@example.com"
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
                  placeholder="10 Digit phone Number"
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
                  placeholder="6 Digit Pincode"
                  isInvalid={!!errors.pincode}
                />
                <Text className="error" color="red.500">
                  {errors.pincode}
                </Text>
              </FormControl>
            </ModalBody>
          </form>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
              {loading ? (
                <Spinner
                  thickness="3px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="#f7cb93"
                  size="md"
                />
              ) : (
                "Create"
              )}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th pl={{ base: "-10%" }}>Name</Th>
              <Th display={{ base: "none", md: "table-cell" }}>Email</Th>
              <Th>Phone Number</Th>
              <Th display={{ base: "none", md: "none", lg: "table-cell" }}>
                DOB
              </Th>
              <Th display={{ base: "none", md: "none", lg: "table-cell" }}>
                City/state
              </Th>
              <Th display={{ base: "none", md: "table-cell" }}>Pincode</Th>
              <Th pl={{ base: "0px", md: "20px" }}>Action</Th>
            </Tr>
          </Thead>
          <Text m={2} ml={4}>
            {" "}
            {length === 0 ? "No User" : "Total User : " + length}
          </Text>
          {length > 0 &&
            data?.map((el) => {
              return (
                <UserDetailsTable key={el._id} {...el} getData={getData} />
              );
            })}
        </Table>
      </TableContainer>
    </>
  );
}
