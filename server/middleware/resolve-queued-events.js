import { cloneDeep } from 'lodash';

import { EMIT_SAVE_QUEUED_EVENTS } from 'ducks/occurrences';
import store from 'store';
import { sleep } from 'utils';

const resolveQueuedEvents = async (action) => {
  const state = cloneDeep(store.getState().meta);

  const queuedEvents = state.queuedEvents.concat(action.event);

  const unresolvedEvents = queuedEvents.map((queuedEvent) => {
    if (!queuedEvent) return queuedEvent;

    const conditions = Object.keys(queuedEvent.conditions);

    const conditionValidations = conditions.map((condition) => {
      const conditionsMet = state[condition] === queuedEvent.conditions[condition];

      return conditionsMet;
    });

    const allConditionsMet = !conditionValidations.includes(false);

    if (allConditionsMet) {
      const fireEvent = async () => {
        await sleep(queuedEvent.delay);
        store.dispatch(queuedEvent);
        queuedEvent.resolved = true;
      };

      fireEvent();
    }

    return queuedEvent;
  }).filter((event) => event && !event.resolved);

  // Refresh queued events sans those that were just dispatched
  store.dispatch({
    type: EMIT_SAVE_QUEUED_EVENTS,
    queuedEvents: unresolvedEvents
  });
};

export default resolveQueuedEvents;
