import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch,RootState } from "./store";



export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// useAppDispatch = useDispatch + type
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector
// useAppSelector = useSelector + type