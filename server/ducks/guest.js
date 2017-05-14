/* eslint no-eval:0 */
export const EMIT_GUEST_ACCESS_ENABLE = 'EMIT_GUEST_ACCESS_ENABLE';
export const EMIT_GUEST_ACCESS_DISABLE = 'EMIT_GUEST_ACCESS_DISABLE';

const guestReducer = (state) => ({
  [EMIT_GUEST_ACCESS_ENABLE]: () => ({
    ...state,
    guestEnabled: true
  }),

  [EMIT_GUEST_ACCESS_DISABLE]: () => ({
    ...state,
    guestEnabled: false
  })
});

export default guestReducer;
