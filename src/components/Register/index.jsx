import {
  Button,
  Modal,
  Checkbox,
  FormControlLabel,
  TextField,
  ThemeProvider,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import {
  BackgroundRegisterModal,
  ButtonContainer,
  CheckboxContainer,
  CheckboxErrorContainer,
  RegisterModalContainer,
  RegisterModalFooter,
  RegisterModalHeader,
  RegisterModalHeaderButton,
  RegisterModalHeaderText,
  StyledRegisterForm,
  StyledTextField,
  themeDate,
} from "./styles";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
function Register({
  registerModal,
  handleCloseRegisterModal,
  handleOpenModalLogin,
}) {
  const [imageUser, setImageUser] = useState([]);

  const [imageUserError, setImageUserError] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState("");

  const inputRef = useRef(null);

  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup
      .string()
      .required("Email is required.")
      .email("Email is not valid."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must have at least 6 characters."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords don't match.")
      .required("Please confirm your password."),
    acceptTerms: yup.boolean().isTrue("You must accept the terms of service."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onImageChange = (e) => {
    const [file] = e.target.files;

    if (file?.type === "image/png" || file?.type === "image/jpeg") {
      setImageUserError(false);
      setImageUser([URL.createObjectURL(file)]);
    } else {
      setImageUserError(true);
    }
  };

  const deleteImage = () => {
    inputRef.current.value = null;
    setImageUser([]);
  };

  const handleDateOfBirth = (newValue) => {
    console.log(newValue);
    setDateOfBirth(newValue);
  };

  const onSubmit = (data) => {
    console.log(data);

    const response = {
      name: data.name,
      email: data.email,
      password: data.password,
      dateOfBirth: dateOfBirth,
      profilePicture: imageUser,
    };

    //enviar response para API

    handleCloseRegisterModal();
  };

  return (
    <>
      <Modal open={registerModal} onClose={handleCloseRegisterModal}>
        <BackgroundRegisterModal>
          <RegisterModalContainer>
            <RegisterModalHeader>
              <RegisterModalHeaderButton>
                <Button
                  sx={{ minWidth: "5px" }}
                  onClick={handleCloseRegisterModal}
                  variant="text"
                  color="secondary"
                >
                  X
                </Button>
              </RegisterModalHeaderButton>
              <RegisterModalHeaderText>
                <p>Create account</p>
              </RegisterModalHeaderText>
            </RegisterModalHeader>
            <StyledRegisterForm id="form" onSubmit={handleSubmit(onSubmit)}>
              <StyledTextField
                error={errors.name?.message}
                helperText={errors.name?.message}
                {...register("name")}
                label="Name"
                placeholder="Please enter your full name"
                variant="outlined"
                color="secondary"
              />
              <StyledTextField
                error={errors.email?.message}
                helperText={errors.email?.message}
                {...register("email")}
                label="Email"
                placeholder="Please enter your email"
                variant="outlined"
                color="secondary"
              />
              <StyledTextField
                error={errors.password?.message}
                helperText={errors.password?.message}
                {...register("password")}
                color="secondary"
                type="password"
                label="Password"
                placeholder="Please enter your password"
                variant="outlined"
              />
              <StyledTextField
                error={errors.confirmPassword?.message}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                color="secondary"
                type="password"
                label="Confirm Password"
                placeholder="Please confirm your password"
                variant="outlined"
              />
              <label className="dateOfBirth">Your date of birth</label>
              <ThemeProvider theme={themeDate}>
                <LocalizationProvider
                  color="primary"
                  dateAdapter={AdapterDateFns}
                >
                  <MobileDatePicker
                    color="primary"
                    placeholder="Your date of birth"
                    inputFormat="dd/MM/yyyy"
                    value={dateOfBirth}
                    onChange={handleDateOfBirth}
                    renderInput={(params) => <StyledTextField {...params} />}
                  />
                </LocalizationProvider>
              </ThemeProvider>
              <Button
                variant="outlined"
                component="label"
                color="secondary"
                sx={{ textTransform: "capitalize", width: "100%" }}
              >
                Upload a Profile Picture
                <input
                  type="file"
                  onChange={onImageChange}
                  hidden
                  ref={inputRef}
                />
              </Button>
              {imageUser?.map((element, index) => {
                return (
                  <div key={index} className="userImageDiv">
                    <button onClick={deleteImage}>X</button>
                    <img src={element} alt={"User Pic"} />
                  </div>
                );
              })}
              {imageUserError && (
                <span className="imageError">
                  Please upload a png or jpeg file.
                </span>
              )}
            </StyledRegisterForm>
            <CheckboxContainer>
              <FormControlLabel
                label="I accept the Terms of Service"
                control={
                  <Checkbox
                    {...register("acceptTerms")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                  />
                }
              />
            </CheckboxContainer>
            <CheckboxErrorContainer>
              {errors.acceptTerms && <span>{errors.acceptTerms.message}</span>}
            </CheckboxErrorContainer>
            <ButtonContainer>
              <Button form="form" type="submit" variant="contained">
                Create account
              </Button>
            </ButtonContainer>
            <RegisterModalFooter>
              <div>
                <p>Already have an account? </p>
                <button
                  className="loginButton"
                  onClick={() => {
                    handleOpenModalLogin();
                    handleCloseRegisterModal();
                  }}
                >
                  Sign In
                </button>
              </div>
            </RegisterModalFooter>
          </RegisterModalContainer>
        </BackgroundRegisterModal>
      </Modal>
    </>
  );
}

export default Register;
