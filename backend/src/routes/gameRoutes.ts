import { Router } from 'express';
import { gameController } from '../controllers/gameController';

const router = Router();

// GET /api/games/search?q=searchTerm&platform=optional
router.get('/search', gameController.searchGames);

// GET /api/games/library
router.get('/library', gameController.getUserLibrary);

// POST /api/games/library
router.post('/library', gameController.addGameToLibrary);

// DELETE /api/games/library/:entryId
router.delete('/library/:entryId', gameController.removeGameFromLibrary);

export { router as gameRoutes };