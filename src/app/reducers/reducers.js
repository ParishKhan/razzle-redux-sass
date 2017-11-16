export default function reducer(state = {}, action) {
    switch (action.type) {
      case "FETCH_NEWS_SUCCESS":
        return { ...state, news: action.payload };
  
      default:
        return state;
    }
}