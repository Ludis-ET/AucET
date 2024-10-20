import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import "./index.css";
import { AuthProvider, PaymentProvider } from "./Context/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PaymentProvider>
        <Router>
          <Toaster />
          <App />
        </Router>
      </PaymentProvider>
    </AuthProvider>
  </StrictMode>
);
