import axios from "axios";

const API_URL = "http://localhost:8080/api/";

const api = axios.create({
    baseURL: API_URL
});


/*
 * Add authentication headers to every request
 */
api.interceptors.request.use(
    (config) => {

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (token) {
            config.headers["Authorization"] =
                `Bearer ${token}`;
        }

        if (userId) {
            config.headers["X-User-ID"] =
                userId;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
 * ==========================================
 * ACTIVITY APIs
 * ==========================================
 */


/*
 * Get all activities
 */
export const getActivities = () => {
    return api.get("/activities");
};


/*
 * Add new activity
 */
export const addActivity = (activity) => {
    return api.post("/activities", activity);
};


/*
 * Get one activity
 */
export const getActivityDetail = (id) => {
    return api.get(`/activities/${id}`);
};


/*
 * ==========================================
 * AI RECOMMENDATION APIs
 * ==========================================
 */


/*
 * Get recommendation for an activity
 *
 * This endpoint can return:
 *
 * 200 -> recommendation is ready
 *
 * 202 -> recommendation is still being generated
 */
export const getActivityRecommendation = (activityId) => {
    return api.get(
        `/recommendations/activity/${activityId}`
    );
};


export default api;