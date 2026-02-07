/* Voice style for koeiromap Free v1 limitations */
type ReducedTalkStyle = "talk" | "happy" | "sad";

/**
 * Limit voice style parameters for koeiromap Free v1
 */
export const reduceTalkStyle = (talkStyle: string): ReducedTalkStyle => {
  if (talkStyle == "talk" || talkStyle == "happy" || talkStyle == "sad") {
    return talkStyle;
  }

  return "talk";
};
