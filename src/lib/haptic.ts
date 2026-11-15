/* HAPTICS. A touch you can feel on a phone that offers it: a tap when a
   card is graded, a short pattern when a card is held or a question is
   right. Nothing on a device without it. */

function can(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export const Haptic = {
  tap() { if (can()) navigator.vibrate(8); },
  good() { if (can()) navigator.vibrate([10, 30, 14]); },
  held() { if (can()) navigator.vibrate([18, 40, 18, 40, 28]); },
};
