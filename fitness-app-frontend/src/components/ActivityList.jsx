import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
  getActivities,
  deleteActivity,
} from "../services/api";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  /*
   * Fetch activities
   */
  useEffect(() => {
    getActivities()
      .then((res) => {
        setActivities(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching activities:",
          err
        );
      });
  }, []);

  /*
   * Delete activity
   */
  const handleDelete = async (e, activityId) => {
    // Prevent Card onClick from firing
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(activityId);

      await deleteActivity(activityId);

      // Remove deleted activity from UI
      setActivities((prevActivities) =>
        prevActivities.filter(
          (activity) => activity.id !== activityId
        )
      );

    } catch (error) {
      console.error(
        "Error deleting activity:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to delete activity. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * No activities
   */
  if (activities.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          No activities logged yet — add one above to
          get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{ mt: 1 }}
    >
      {activities.map((activity) => (
        <Grid
          key={activity.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Card
            sx={{
              cursor: "pointer",
              transition:
                "transform 0.15s ease, box-shadow 0.15s ease",

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 4px 12px rgba(22,33,29,0.08)",
              },
            }}
            onClick={() =>
              navigate(
                `/activities/${activity.id}`
              )
            }
          >
            <CardContent>
              <Typography variant="h6">
                {activity.type}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mt: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Duration
                  </Typography>

                  <Typography
                    color="secondary.main"
                    fontWeight={700}
                  >
                    {activity.duration}m
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Calories
                  </Typography>

                  <Typography
                    color="secondary.main"
                    fontWeight={700}
                  >
                    {activity.caloriesBurned}
                  </Typography>
                </Box>
              </Box>

              {/* Delete button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{
                  mt: 2,
                }}
                onClick={(e) =>
                  handleDelete(
                    e,
                    activity.id
                  )
                }
                disabled={
                  deletingId === activity.id
                }
              >
                {deletingId === activity.id
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;