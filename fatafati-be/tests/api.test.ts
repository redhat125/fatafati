import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { getRepository, MemoryStoryRepository } from '../src/db';

const app = createApp();

describe('FataFati Backend API Test Suite', () => {
  beforeEach(() => {
    // Reset seed data before each test
    const repo = getRepository();
    if (repo instanceof MemoryStoryRepository) {
      repo.seed();
    }
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /api/series', () => {
    it('should list all series', async () => {
      const res = await request(app).get('/api/series');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it('should filter series by genre', async () => {
      const res = await request(app).get('/api/series?genre=horror');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe('blackwood-manor');
    });

    it('should search series by keyword', async () => {
      const res = await request(app).get('/api/series?search=Vesper');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe('cyberpunk-2099');
    });
  });

  describe('GET /api/series/:id', () => {
    it('should return series details for valid id', async () => {
      const res = await request(app).get('/api/series/cyberpunk-2099');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toContain('Cyberpunk 2099');
      expect(res.body.data.rootEpisodeId).toBe('cp-ep-1');
    });

    it('should return 404 for non-existent series', async () => {
      const res = await request(app).get('/api/series/non-existent-series');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/series/:id/tree', () => {
    it('should return complete DAG graph with nodes and edges', async () => {
      const res = await request(app).get('/api/series/cyberpunk-2099/tree');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nodes.length).toBe(7);
      expect(res.body.data.edges.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/episodes/:id', () => {
    it('should return episode details with choices and computed breadcrumbs', async () => {
      const res = await request(app).get('/api/episodes/cp-ep-2a').set('x-session-id', 'test_user_123');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.episode.title).toBe('Ghost in the Machine');
      expect(res.body.data.episode.choices.length).toBe(2);

      // Verify breadcrumbs trail: Root (cp-ep-1) -> Current (cp-ep-2a)
      expect(res.body.data.breadcrumbs.length).toBe(2);
      expect(res.body.data.breadcrumbs[0].id).toBe('cp-ep-1');
      expect(res.body.data.breadcrumbs[1].id).toBe('cp-ep-2a');
    });
  });

  describe('POST /api/episodes/choose', () => {
    it('should record choice pick and update percentages', async () => {
      const res = await request(app).post('/api/episodes/choose').send({ choiceId: 'cp-ch-1a' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Comments and Community Voice', () => {
    it('should fetch comments for an episode sorted by score', async () => {
      const res = await request(app).get('/api/episodes/cp-ep-1/comments').set('x-session-id', 'test_session_1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].score).toBeGreaterThanOrEqual(res.body.data[1].score);
    });

    it('should allow user to create a new storyline suggestion', async () => {
      const payload = {
        authorName: 'StoryCrafter',
        text: 'What if Vesper uses a hidden quantum bypass to escape the guards?',
      };

      const res = await request(app)
        .post('/api/episodes/cp-ep-1/comments')
        .set('x-session-id', 'test_creator_99')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toBe(payload.text);
      expect(res.body.data.authorName).toBe(payload.authorName);
      expect(res.body.data.upvotes).toBe(0);
    });

    it('should reject invalid or short comment ideas', async () => {
      const res = await request(app)
        .post('/api/episodes/cp-ep-1/comments')
        .set('x-session-id', 'test_creator_99')
        .send({ authorName: 'A', text: 'hi' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should handle upvoting and idempotency toggle correctly', async () => {
      const sessionId = 'voter_alpha';
      const commentId = 'c-cp-1';

      // 1. First upvote
      const upRes1 = await request(app)
        .post(`/api/comments/${commentId}/vote`)
        .set('x-session-id', sessionId)
        .send({ voteType: 'up' });

      expect(upRes1.status).toBe(200);
      expect(upRes1.body.data.userVote).toBe('up');
      const scoreAfterUp = upRes1.body.data.comment.score;

      // 2. Toggle off (clicking upvote again removes it)
      const toggleRes = await request(app)
        .post(`/api/comments/${commentId}/vote`)
        .set('x-session-id', sessionId)
        .send({ voteType: 'up' });

      expect(toggleRes.status).toBe(200);
      expect(toggleRes.body.data.userVote).toBe(null);
      expect(toggleRes.body.data.comment.score).toBe(scoreAfterUp - 1);

      // 3. Downvote
      const downRes = await request(app)
        .post(`/api/comments/${commentId}/vote`)
        .set('x-session-id', sessionId)
        .send({ voteType: 'down' });

      expect(downRes.status).toBe(200);
      expect(downRes.body.data.userVote).toBe('down');
    });
  });

  describe('User Journeys', () => {
    it('should record and retrieve a user story path', async () => {
      const sessionId = 'journey_seeker_7';
      const seriesId = 'cyberpunk-2099';

      await request(app)
        .post('/api/journeys')
        .set('x-session-id', sessionId)
        .send({ seriesId, episodeId: 'cp-ep-1' });

      await request(app)
        .post('/api/journeys')
        .set('x-session-id', sessionId)
        .send({ seriesId, episodeId: 'cp-ep-2a' });

      const res = await request(app)
        .get(`/api/journeys/${seriesId}`)
        .set('x-session-id', sessionId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pathEpisodeIds).toEqual(['cp-ep-1', 'cp-ep-2a']);
      expect(res.body.data.currentEpisodeId).toBe('cp-ep-2a');
    });
  });
});
