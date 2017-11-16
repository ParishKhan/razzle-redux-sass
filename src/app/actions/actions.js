import "isomorphic-fetch";

const requestNews = () => ({ type: "FETCH_NEWS_REQUEST" });
const receivedNews = news => ({ type: "FETCH_NEWS_SUCCESS", payload: news });
const newsError = () => ({ type: "FETCH_NEWS_FAILURE" });

// Async Actions
export const fetchNews = () => (dispatch, getState) => {
  dispatch(requestNews());
  return fetch("http://localhost:3000/api/news")
    .then(response => response.json())
    .then(news => dispatch(receivedNews(news)))
    .catch(err => dispatch(newsError(err)));
};