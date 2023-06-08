'use client';
import app from '@/store/features/app';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AppLoading () {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(app.actions.startLoading());

    return () => {
      dispatch(app.actions.stopLoading());
    };
  }, []);
  return null;
}