import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { setCredentials } from "./store/authSlice";

import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

import theme from "./theme";

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box
      component="section"
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <ActivityForm
        onActivityAdded={() => setRefreshKey((k) => k + 1)}
      />

      <ActivityList key={refreshKey} />
    </Box>
  );
};

function App() {
  const {
    token,
    tokenData,
    logIn,
    logOut,
    loginInProgress,
    error,
  } = useContext(AuthContext);

  const dispatch = useDispatch();

  /*
   * Store OAuth token in Redux
   */
  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          token,
          user: tokenData,
        })
      );
    }
  }, [token, tokenData, dispatch]);

  /*
   * Show OAuth error in console as well
   */
  useEffect(() => {
    if (error) {
      console.error("OAuth Error:", error);
    }
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
              }}
            >
              Pulse
            </Typography>

            {token && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => logOut()}
              >
                Log out
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {!token ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              gap: 2,
              px: 2,
            }}
          >
            <Typography variant="h5">
              Welcome to Pulse
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
            >
              Log in to track activity and get AI-driven feedback.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => logIn()}
              disabled={loginInProgress}
            >
              {loginInProgress
                ? "Redirecting..."
                : "Log in"}
            </Button>

            {error && (
              <Typography
                color="error"
                sx={{
                  maxWidth: 500,
                  textAlign: "center",
                }}
              >
                OAuth Error:{" "}
                {error.message || String(error)}
              </Typography>
            )}
          </Box>
        ) : (
          <Routes>
            <Route
              path="/activities"
              element={<ActivitiesPage />}
            />

            <Route
              path="/activities/:id"
              element={<ActivityDetail />}
            />

            <Route
              path="/"
              element={
                <Navigate
                  to="/activities"
                  replace
                />
              }
            />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;