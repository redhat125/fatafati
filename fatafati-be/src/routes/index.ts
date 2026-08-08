import { Router } from 'express';
import { listSeries, getSeriesById, getStoryGraph } from '../controllers/seriesController';
import { getEpisodeById, choosePath } from '../controllers/episodeController';
import { getComments, createComment, voteComment } from '../controllers/commentController';
import { getJourney, updateJourney } from '../controllers/journeyController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Series
router.get('/series', listSeries);
router.get('/series/:id', getSeriesById);
router.get('/series/:id/tree', getStoryGraph);

// Episodes
router.get('/episodes/:id', getEpisodeById);
router.post('/episodes/choose', choosePath);

// Comments / Community Voice
router.get('/episodes/:episodeId/comments', getComments);
router.post('/episodes/:episodeId/comments', createComment);
router.post('/comments/:commentId/vote', voteComment);

// Journeys
router.get('/journeys/:seriesId', getJourney);
router.post('/journeys', updateJourney);

export default router;
