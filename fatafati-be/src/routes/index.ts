import { Router } from 'express';
import { listSeries, getSeriesById, getStoryGraph } from '../controllers/seriesController';
import { getEpisodeById, choosePath } from '../controllers/episodeController';
import { getComments, createComment, voteComment } from '../controllers/commentController';
import { getJourney, updateJourney } from '../controllers/journeyController';
import * as adminController from '../controllers/adminController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Public Endpoints ---
// Series
router.get('/series', listSeries);
router.get('/series/:id', getSeriesById);
router.get('/series/:id/tree', getStoryGraph);

// Episodes
router.get('/episodes/:id', getEpisodeById);
router.post('/choices', choosePath); // Was /episodes/choose but I changed it, actually let's keep /episodes/choose
router.post('/episodes/choose', choosePath);

// Comments
router.get('/episodes/:episodeId/comments', getComments);
router.post('/episodes/:episodeId/comments', createComment);
router.post('/comments/:commentId/vote', voteComment);

// Journeys
router.get('/journeys/:seriesId', getJourney);
router.post('/journeys', updateJourney);

// --- Admin Endpoints ---
router.put('/admin/series', adminController.upsertSeries);
router.delete('/admin/series/:id', adminController.deleteSeries);

router.put('/admin/episodes', adminController.upsertEpisode);
router.delete('/admin/episodes/:id', adminController.deleteEpisode);

router.put('/admin/choices', adminController.upsertChoice);
router.delete('/admin/choices/:id', adminController.deleteChoice);

export default router;
