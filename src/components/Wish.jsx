import { useCallback, useEffect, useRef } from 'react';
import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { actions, getState } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';
import { announce } from '../lib/announce.js';
import { wishState } from '../lib/wishState.js';
import { cardContent } from '../lib/cardActions.js';
import { useWishVersionState } from './wishHooks.js';
import WishForm from './WishForm.jsx';
import DeskScene from './DeskScene.jsx';
import CardStage from './CardStage.jsx';
import { WishRow } from './RowFragment.jsx';

// The wish step: a quiet writing desk at night, one paper to write on, then the card.
export default function Wish() {
  const st = useWishVersionState();
  const W = copy.wish, stageRef = useRef(null);
  const make = useCallback(() => {
    const c = cardContent();
    wishState.set({ made: true, seed: wishState.makeSeedFrom(c) });
    announce(W.micro.ready.replace(/<\/?hi>/g, ''));
    setTimeout(() => { const e = document.querySelector('.stage-wrap'); e && e.focus({ preventScroll: false }); }, 60);
  }, []);
  const edit = () => { wishState.set({ made: false }); setTimeout(() => document.getElementById('wish-text')?.focus(), 40); };
  const again = () => { actions.clearWish(); wishState.set({ made: false }); setTimeout(() => document.getElementById('wish-text')?.focus(), 40); };
  return (
    <section id="wish" className="sec" aria-labelledby="wish-h">
      <DeskScene />
      <div className="paper">
        <p className="kicker">{W.kicker}</p>
        <h2 id="wish-h" tabIndex={-1}>{rich(W.heading)}</h2>
        {W.lines.map((l, i) => <p key={i}>{rich(l)}</p>)}
        <p className="en">{W.english}</p>
        <WishForm onMake={make} />
      </div>
      {st.made && <CardStage onEdit={edit} onAgain={again} />}
      <WishRow />
    </section>
  );
}
