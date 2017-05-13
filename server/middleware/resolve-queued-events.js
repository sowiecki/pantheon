import { cloneDeep } from 'lodash';

import { EMIT_SAVE_QUEUED_EVENTS } from 'ducks/occurrences';
import store from 'store';

const resolveQueuedEvents = async (action) => {
  const state = cloneDeep(store.getState().meta);

  const queuedEvents = state.queuedEvents.concat(action.event);

  const unresolvedEvents = queuedEvents.map((queuedEvent) => {
    const conditions = Object.keys(queuedEvent.conditions);

    const conditionValidations = conditions.map((condition) => {
      const conditionsMet = state[condition] === queuedEvent.conditions[condition];

      return conditionsMet;
    });

    const allConditionsMet = !conditionValidations.includes(false);

    if (allConditionsMet) {
      store.dispatch(queuedEvent);
      queuedEvent.resolved = true;
    }

    return queuedEvent;
  }).filter(({ resolved }) => !resolved);

  // Refresh queued events sans those that were just dispatched
  store.dispatch({
    type: EMIT_SAVE_QUEUED_EVENTS,
    queuedEvents: unresolvedEvents
  });
};

export default resolveQueuedEvents;
