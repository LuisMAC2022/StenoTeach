import { getDomRefs } from '../ui/dom-refs.js';
import { initialState } from '../domain/model.js';
import { wireEvents } from './wire-events.js';

wireEvents(getDomRefs(), initialState);
