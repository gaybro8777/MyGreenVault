import * as fromRoot from '../../reducers';
import * as fromActions from '../actions/details.actions';

export interface PlantDetailsState {}

export interface State {
  selected: string;
  selectedWeek: string;
  weekIds: string[];
}

export const initialState: State = {
  selected: null,
  selectedWeek: null,
  weekIds: []
};

export function reducer(state = initialState, action: fromActions.All): State {
  switch (action.type) {
    case fromActions.ActionTypes.DetailsLoaded: {
      const plantId = action.payload.details._id;

      return {
        ...state,
        selected: plantId
      };
    }
    case fromActions.ActionTypes.SelectPlantWeek: {
      const selectedWeekId = action.payload;

      return {
        ...state,
        selectedWeek: selectedWeekId
      };
    }
    case fromActions.ActionTypes.PlantWeeksLoaded: {
      return {
        ...state,
        weekIds: action.payload.map(week => week._id)
      };
    }
    case fromActions.ActionTypes.PlantWeeksLoadFailed:
    case fromActions.ActionTypes.LoadPlantWeeks: {
      return {
        ...state,
        weekIds: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getDetailsState = (state: State) => state;
