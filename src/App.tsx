import { Client } from 'boardgame.io/react';
import { Hanamikoji } from './game/Game';

const App = Client({ game: Hanamikoji });

export default App;
