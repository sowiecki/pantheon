import { EMIT_RESOLVE_QUEUED_EVENTS } from 'ducks/occurrences';

const resolveQueuedEvents = (store, action, next) => {
  const state = { ...store.getState().meta };
  console.log(state.queuedEvents)
  const queuedEvents = state.queuedEvents.map((queuedEvent) => {
    const statesWaitingOn = Object.keys(queuedEvent.waitFor);

    const eventResolutions = statesWaitingOn.map((stateWaitingOn) => {
      const shouldResolve = state[stateWaitingOn] === queuedEvent.waitFor[stateWaitingOn];

      // Finally dispatch the action and begin clean up
      if (shouldResolve) {
        delete queuedEvent.waitFor;
        store.dispatch(queuedEvent);
      }

      return stateWaitingOn;
    });

    const eventResolved = eventResolutions.reduce((a, b) => a && b);

    return eventResolved && queuedEvent;
  }).filter((event) => !!event.waitFor);

  // Refresh queued events sans those that were just dispatched
  next({
    type: EMIT_RESOLVE_QUEUED_EVENTS,
    queuedEvents
  });
};

export default resolveQueuedEvents;
