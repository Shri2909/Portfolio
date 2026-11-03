import { useEffect, useState } from 'react';
import { wishState } from '../lib/wishState.js';
export const useWishVersionState = () => { const [s, set] = useState(wishState.get()); useEffect(() => wishState.subscribe(() => set(wishState.get())), []); return s; };
