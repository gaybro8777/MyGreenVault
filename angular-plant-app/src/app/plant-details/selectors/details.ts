import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as DetailsState, getPlantState } from '../reducers';
import { State } from '../../reducers';

export const getSelected = createSelector(getPlantState, (plants: any) => plants.details.selected);

export const getDetails = createSelector(getPlantState, getSelected, (plants: any, selected: string) => {
  if (!plants || !selected) {
    return;
  }
  return plants.details[selected];
});
