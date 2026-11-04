// How many project lamps there are, and which internal slot the honest (proposed, not run) lamp uses.
// Three lamps (Certgen, Blitz, Vigil) light one from another; the fourth lamp, The Handover Test, never lights. Its internal slot stays 6
// (DOM id #lamp-6, flame personality 6, registry key 6) so every stage, light and flame module keeps working; the page calls it Lamp 4.
export const LAMPS = 3;
export const HONEST = 6;
export const LAMP_IDS = [1, 2, 3];
// Tone (0 to 6) drives the sky, windows, rangoli and lanterns. With three lamps the tone steps 0, 2, 4, 5 (5 = all lit, dusk-gold); 6 = the visitor's lamp.
export const TONE_OF = [0, 2, 4, 5];
// Each lamp draws these rangoli layers (the rangoli has five layers).
export const RANGOLI_LAYERS = { 1: [0, 1], 2: [2, 3], 3: [4] };
