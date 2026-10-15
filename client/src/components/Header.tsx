import { useState } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";

function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <AnnouncementBar onSignUp={() => setRegisterOpen(true)} />

      <Navbar onLogin={() => setLoginOpen(true)} />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}

export default Header;
