import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { registerUser } from "../../services/authService";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterModal({ open, onClose, onLogin }: RegisterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Mobile number is required";
    } else if (!/^5[024568]\d{7}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid UAE mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(
        firstName,
        lastName,
        email,
        `+971${phoneNumber}`,
        password,
      );

      setSnackbar({
        open: true,
        message: "Account created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: any) {
      const message =
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.detail ||
        "Registration failed. Please try again.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            onClose();
          }
        }}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
            },
          },
        }}
      >
        <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "common.white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <PersonIcon />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              Create your account and start shopping with us.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            {/* Name */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                label="First Name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                fullWidth
              />

              <TextField
                label="Last Name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                fullWidth
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />

            <TextField
              label="Mobile Number"
              value={phoneNumber}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                if (value.length <= 9) {
                  setPhoneNumber(value);
                }
              }}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber || "Example: 50 123 4567"}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+971</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password || "Use at least 8 characters"}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((previous) => !previous)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Actions */}
          <Box
            sx={{
              mt: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              <Button variant="text" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleRegister}
                disabled={isSubmitting}
                sx={{
                  minWidth: 120,
                }}
              >
                {isSubmitting ? "Creating..." : "Register"}
              </Button>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={onLogin}
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Login
                </Box>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Registration Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default RegisterModal;
