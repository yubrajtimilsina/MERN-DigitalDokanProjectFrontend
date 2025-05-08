import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/type";
import { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isVisible: boolean; 
  user: {
    id: string;
    username: string;
  };
}

export interface INewReview {
  rating: number;
  comment: string;
  productId: string;
}

interface IReviewState {
  reviews: IReview[];
  status: Status;
  avgRating: number;
}

const initialState: IReviewState = {
  reviews: [],
  status: Status.IDLE,
  avgRating: 0,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews(state: IReviewState, action: PayloadAction<IReview[]>) {
      state.reviews = action.payload;
      // Calculate average rating
      if (state.reviews.length > 0) {
        const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0);
        state.avgRating = sum / state.reviews.length;
      } else {
        state.avgRating = 0;
      }
    },
    setStatus(state: IReviewState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    addReview(state: IReviewState, action: PayloadAction<IReview>) {
      state.reviews.push(action.payload);
      // Recalculate average rating
      const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0);
      state.avgRating = sum / state.reviews.length;
    },
    removeReview(state: IReviewState, action: PayloadAction<string>) {
      state.reviews = state.reviews.filter(review => review.id !== action.payload);
      // Recalculate average rating
      if (state.reviews.length > 0) {
        const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0);
        state.avgRating = sum / state.reviews.length;
      } else {
        state.avgRating = 0;
      }
    },
  },
});

export const { setReviews, setStatus, addReview, removeReview } = reviewSlice.actions;
export default reviewSlice.reducer;

export function fetchProductReviews(productId: string) {
  return async function fetchProductReviewsThunk(dispatch: AppDispatch) {
    try {
      dispatch(setStatus(Status.LOADING));
      const response = await APIWITHTOKEN.get(`/review/product/${productId}`);
      if (response.status === 200) {
        dispatch(setReviews(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function submitReview(reviewData: INewReview) {
  return async function submitReviewThunk(dispatch: AppDispatch) {
    try {
      dispatch(setStatus(Status.LOADING));
      const response = await APIWITHTOKEN.post("/review", reviewData);
      if (response.status === 200 || response.status === 201) {
        dispatch(addReview(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
        return true;
      } else {
        dispatch(setStatus(Status.ERROR));
        return false;
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      return false;
    }
  };
}

export function deleteReview(reviewId: string) {
  return async function deleteReviewThunk(dispatch: AppDispatch) {
    try {
      dispatch(setStatus(Status.LOADING));
      const response = await APIWITHTOKEN.delete(`/review/${reviewId}`);
      if (response.status === 200) {
        dispatch(removeReview(reviewId));
        dispatch(setStatus(Status.SUCCESS));
        return true;
      } else {
        dispatch(setStatus(Status.ERROR));
        return false;
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
      return false;
    }
  };
}

export function getUserReviews() {
  return async function getUserReviewsThunk(dispatch: AppDispatch) {
    try {
      dispatch(setStatus(Status.LOADING));
      const response = await APIWITHTOKEN.get('/review/my-reviews');
      if (response.status === 200) {
        dispatch(setReviews(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

