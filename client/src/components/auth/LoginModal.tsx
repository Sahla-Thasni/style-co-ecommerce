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

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login } from "../../redux/auth/authSlice";
import { syncCart } from "../../services/cartService";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
  onLoginSuccess?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginModal({
  open,
  onClose,
  onRegister,
  onLoginSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setErrors({});
      setShowPassword(false);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        login({
          email,
          password,
        }),
      ).unwrap();

      // Sync guest cart with the user's backend cart
      await syncCart(cartItems);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
        onLoginSuccess?.();
      }, 800);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail || "Invalid email or password.";

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
          if (reason === "backdropClick") {
            return;
          }

          onClose();
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            px: { xs: 2, sm: 4 },
            py: 3,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
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
              }}
            >
              Welcome Back
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Login to continue shopping with us.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                if (errors.email) {
                  setErrors((previous) => ({
                    ...previous,
                    email: undefined,
                  }));
                }
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
              autoComplete="email"
              fullWidth
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
              autoComplete="new-password"
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
          </Box>

          {/* Actions */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={isSubmitting}
              sx={{
                py: 1.3,
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                mt: 1,
              }}
            >
              Cancel
            </Button>

            {/* Sign Up Link */}
            <Box
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Box
                  component="span"
                  onClick={onRegister}
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign Up
                </Box>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Login Snackbar */}
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
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginModal;
