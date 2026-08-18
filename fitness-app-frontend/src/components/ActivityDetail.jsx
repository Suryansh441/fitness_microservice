import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getActivityDetail,
  getActivityRecommendation
} from '../services/api';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Typography,
  CircularProgress
} from '@mui/material';

/**
 * Parses inline string sections (e.g., "Overall: ... Pace: ...") for the Analysis section.
 */
const parseAnalysisText = (text) => {
  if (!text) return [];

  const keywords = ['Overall:', 'Pace:', 'Heart Rate:', 'Calories:'];
  const regex = new RegExp(`(${keywords.join('|')})`, 'g');

  const parts = text.split(regex).filter(Boolean);
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    if (keywords.includes(parts[i])) {
      const label = parts[i].replace(':', '').trim();
      const content = parts[i + 1] ? parts[i + 1].trim() : '';
      result.push({ label, content });
      i++;
    } else {
      result.push({ label: null, content: parts[i].trim() });
    }
  }

  return result;
};

/**
 * Component to format array items (e.g., "Intensity Modulation: To improve...")
 * dynamically bolding any prefix before a colon.
 */
const FormattedListItem = ({ text }) => {
  if (!text) return null;

  const colonIndex = text.indexOf(':');

  if (colonIndex !== -1) {
    const label = text.substring(0, colonIndex).trim();
    const content = text.substring(colonIndex + 1).trim();

    return (
      <Typography paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
        <strong>{label}:</strong> {content}
      </Typography>
    );
  }

  return (
    <Typography paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
      {text}
    </Typography>
  );
};

const ActivityDetail = () => {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    let active = true;
    let intervalId = null;

    const fetchActivity = async () => {
      try {
        const response = await getActivityDetail(id);
        if (!active) return;
        setActivity(response.data);
        setActivityError(null);
      } catch (error) {
        console.error('Error loading activity:', error);
        if (active) setActivityError(error);
      }
    };

    const fetchRecommendation = async () => {
      try {
        const response = await getActivityRecommendation(id);
        if (!active) return;

        if (response.status === 200) {
          setRecommendation(response.data);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (error) {
        console.log('AI recommendation is still being generated...');
      }
    };

    fetchActivity();
    fetchRecommendation();

    intervalId = setInterval(fetchRecommendation, 3000);

    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [id]);

  if (!activity) {
    if (activityError) {
      return (
        <Typography color="error" sx={{ p: 2 }}>
          Couldn't load this activity. Try again.
        </Typography>
      );
    }

    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Skeleton variant="rounded" height={140} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={220} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: {
          xs: 2,
          sm: 3
        }
      }}
    >
      {/* =========================
          ACTIVITY DETAILS
          ========================= */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Chip
            label={activity.type}
            color="secondary"
            size="small"
            sx={{ mb: 1 }}
          />

          <Typography variant="h5" gutterBottom>
            Activity details
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 4,
              fontFamily: '"Space Grotesk", sans-serif'
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="h6">{activity.duration} min</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Calories
              </Typography>
              <Typography variant="h6">{activity.caloriesBurned}</Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 1
            }}
          >
            {new Date(activity.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* =========================
          AI RECOMMENDATION
          ========================= */}
      {!recommendation ? (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 5
              }}
            >
              <CircularProgress size={40} sx={{ mb: 2 }} />

              <Typography variant="h6" gutterBottom>
                Generating AI Recommendation
              </Typography>

              <Typography color="text.secondary" align="center">
                Your activity has been saved.
                <br />
                Our AI is analyzing your workout.
                <br />
                This may take a few seconds.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              AI Recommendation
            </Typography>

            {/* =========================
                ANALYSIS
                ========================= */}
            <Typography variant="h6" gutterBottom>
              Analysis
            </Typography>

            {parseAnalysisText(recommendation.recommendation).map((item, index) => (
              <Typography key={index} paragraph sx={{ mb: 2, lineHeight: 1.7 }}>
                {item.label ? (
                  <>
                    <strong>{item.label}:</strong> {item.content}
                  </>
                ) : (
                  item.content
                )}
              </Typography>
            ))}

            <Divider sx={{ my: 2.5 }} />

            {/* =========================
                IMPROVEMENTS
                ========================= */}
            <Typography variant="h6" gutterBottom>
              Improvements
            </Typography>

            {recommendation.improvements?.length > 0 ? (
              recommendation.improvements.map((improvement, index) => (
                <FormattedListItem key={index} text={improvement} />
              ))
            ) : (
              <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
                No specific improvements provided.
              </Typography>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* =========================
                SUGGESTIONS
                ========================= */}
            <Typography variant="h6" gutterBottom>
              Suggestions
            </Typography>

            {recommendation.suggestions?.length > 0 ? (
              recommendation.suggestions.map((suggestion, index) => (
                <FormattedListItem key={index} text={suggestion} />
              ))
            ) : (
              <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
                No specific suggestions provided.
              </Typography>
            )}

            <Divider sx={{ my: 2.5 }} />

            {/* =========================
                SAFETY
                ========================= */}
            <Typography variant="h6" gutterBottom>
              Safety Guidelines
            </Typography>

            {recommendation.safety?.length > 0 ? (
              recommendation.safety.map((tip, index) => (
                <FormattedListItem key={index} text={tip} />
              ))
            ) : (
              <Typography color="text.secondary" paragraph sx={{ mb: 2 }}>
                Follow general safety guidelines.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;