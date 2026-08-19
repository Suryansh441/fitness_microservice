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

import WebsiteBackground from "./images/WebsiteBackground.png";


/*
 * ==========================================
 * ACTIVITIES PAGE
 * ==========================================
 */

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

        backgroundColor: "#ffffff",

        minHeight: "calc(100vh - 65px)",
      }}
    >
      <ActivityForm
        onActivityAdded={() =>
          setRefreshKey((k) => k + 1)
        }
      />

      <ActivityList key={refreshKey} />
    </Box>
  );
};


/*
 * ==========================================
 * MAIN APP
 * ==========================================
 */

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
   * Store OAuth credentials
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
   * OAuth error logging
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

        {!token ? (

          /*
           * ====================================
           * LOGIN PAGE
           * ====================================
           */

          <Box
            sx={{
              position: "relative",

              width: "100vw",

              height: "100vh",

              overflow: "hidden",

              /*
               * FULL BACKGROUND IMAGE
               */
              backgroundImage:
                `url(${WebsiteBackground})`,

              backgroundSize: "cover",

              backgroundPosition: "center center",

              backgroundRepeat: "no-repeat",
            }}
          >

            {/* ==================================
                DARK OVERLAY
            ================================== */}

            <Box
              sx={{
                position: "absolute",

                inset: 0,

                background:
                  "rgba(0,0,0,0.15)",

                zIndex: 0,
              }}
            />


            {/* ==================================
                HEADER
            ================================== */}

            <AppBar
              position="absolute"

              elevation={0}

              sx={{
                top: 0,

                left: 0,

                right: 0,

                backgroundColor:
                  "rgba(0,0,0,0.10)",

                backdropFilter:
                  "blur(2px)",

                WebkitBackdropFilter:
                  "blur(2px)",

                borderBottom:
                  "1px solid rgba(255,255,255,0.20)",

                zIndex: 10,
              }}
            >

              <Toolbar>

                <Typography
                  variant="h6"
                  sx={{
                    flexGrow: 1,

                    fontWeight: 800,

                    color: "#ffffff",

                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.45)",
                  }}
                >
                  Pulse
                </Typography>

              </Toolbar>

            </AppBar>


            {/* ==================================
                LOGIN CONTENT
            ================================== */}

            <Box
              sx={{
                position: "relative",

                zIndex: 2,

                width: "100%",

                height: "100%",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                px: 2,

                pt: 8,
              }}
            >


              {/* ==================================
                  COMPLETELY TRANSPARENT BOX
              ================================== */}

              <Box
                sx={{
                  width: "100%",

                  maxWidth: 500,

                  textAlign: "center",

                  backgroundColor:
                    "transparent",

                  border: "none",

                  boxShadow: "none",

                  backdropFilter: "none",

                  WebkitBackdropFilter: "none",

                  p: {
                    xs: 2,

                    sm: 4,
                  },
                }}
              >


                {/* ==================================
                    TITLE
                ================================== */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "4rem",

                      sm: "6rem",
                    },

                    fontWeight: 900,

                    letterSpacing: "-4px",

                    color: "#ffffff",

                    lineHeight: 1,

                    mb: 2,

                    textShadow:
                      "0 4px 20px rgba(0,0,0,0.55)",
                  }}
                >
                  Pulse
                </Typography>


                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "1rem",

                      sm: "1.15rem",
                    },

                    fontWeight: 500,

                    lineHeight: 1.7,

                    color:
                      "rgba(255,255,255,0.95)",

                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.55)",

                    mb: 3,
                  }}
                >
                  Track your activities.
                  <br />

                  Understand your performance.
                  <br />

                  Get AI-powered feedback.
                </Typography>


                {/* ==================================
                    ACTIVITY TAGS
                ================================== */}

                <Box
                  sx={{
                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    flexWrap: "wrap",

                    gap: 1,

                    mb: 4,
                  }}
                >

                  {[
                    "Running",
                    "Walking",
                    "Cycling",
                    "Swimming",
                    "Weight Training",
                    "Yoga",
                    "HIIT",
                    "Cardio",
                    "Stretching",
                  ].map((activity) => (

                    <Box
                      key={activity}
                      sx={{
                        px: 1.5,

                        py: 0.7,

                        borderRadius: 20,

                        backgroundColor:
                          "rgba(255,255,255,0.10)",

                        border:
                          "1px solid rgba(255,255,255,0.35)",

                        color: "#ffffff",

                        fontSize:
                          "0.78rem",

                        fontWeight: 600,

                        backdropFilter:
                          "blur(2px)",

                        WebkitBackdropFilter:
                          "blur(2px)",

                        textShadow:
                          "0 1px 5px rgba(0,0,0,0.5)",
                      }}
                    >
                      {activity}
                    </Box>

                  ))}

                </Box>


                {/* ==================================
                    LOGIN BUTTON
                ================================== */}

                <Button
                  variant="contained"

                  size="large"

                  onClick={() => logIn()}

                  disabled={loginInProgress}

                  sx={{
                    minWidth: 230,

                    px: 5,

                    py: 1.5,

                    borderRadius: 3,

                    fontSize: "1rem",

                    fontWeight: 700,

                    textTransform: "none",

                    backgroundColor:
                      "rgba(255,255,255,0.90)",

                    color: "#16211d",

                    boxShadow:
                      "0 8px 30px rgba(0,0,0,0.30)",

                    "&:hover": {
                      backgroundColor:
                        "#ffffff",

                      transform:
                        "translateY(-2px)",

                      boxShadow:
                        "0 12px 35px rgba(0,0,0,0.40)",
                    },

                    transition:
                      "all 0.2s ease",
                  }}
                >

                  {loginInProgress
                    ? "Redirecting..."
                    : "Log in to Pulse"}

                </Button>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                  <Typography
                    sx={{
                      mt: 2,

                      color: "#ffffff",

                      fontSize:
                        "0.85rem",

                      textShadow:
                        "0 2px 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    OAuth Error:{" "}
                    {error.message ||
                      String(error)}
                  </Typography>

                )}

              </Box>

            </Box>

          </Box>

        ) : (

          /*
           * ====================================
           * AUTHENTICATED APPLICATION
           * ====================================
           */

          <>

            <AppBar
              position="static"
              color="inherit"
              elevation={0}
              sx={{
                borderBottom:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >

              <Toolbar>

                <Typography
                  variant="h6"
                  sx={{
                    flexGrow: 1,

                    fontWeight: 700,
                  }}
                >
                  Pulse
                </Typography>


                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => logOut()}
                >
                  Log out
                </Button>

              </Toolbar>

            </AppBar>


            <Routes>

              <Route
                path="/activities"
                element={
                  <ActivitiesPage />
                }
              />

              <Route
                path="/activities/:id"
                element={
                  <ActivityDetail />
                }
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

          </>

        )}

      </Router>

    </ThemeProvider>
  );
}

export default App;