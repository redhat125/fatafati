"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesQuerySchema = exports.UpdateJourneySchema = exports.VoteCommentSchema = exports.CreateCommentSchema = void 0;
const zod_1 = require("zod");
exports.CreateCommentSchema = zod_1.z.object({
    episodeId: zod_1.z.string().min(1, 'Episode ID is required'),
    sessionId: zod_1.z.string().min(1, 'Session ID is required'),
    authorName: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(30, 'Name cannot exceed 30 characters').default('Anonymous Creator'),
    text: zod_1.z.string().trim().min(5, 'Your idea must be at least 5 characters').max(280, 'Your idea cannot exceed 280 characters'),
});
exports.VoteCommentSchema = zod_1.z.object({
    sessionId: zod_1.z.string().min(1, 'Session ID is required'),
    voteType: zod_1.z.enum(['up', 'down']),
});
exports.UpdateJourneySchema = zod_1.z.object({
    sessionId: zod_1.z.string().min(1, 'Session ID is required'),
    seriesId: zod_1.z.string().min(1, 'Series ID is required'),
    episodeId: zod_1.z.string().min(1, 'Episode ID is required'),
});
exports.SeriesQuerySchema = zod_1.z.object({
    genre: zod_1.z.enum(['all', 'sci-fi', 'horror', 'cyberpunk', 'thriller', 'space', 'mystery', 'fantasy', 'reality-show', 'anime', 'comedy', 'drama']).optional().default('all'),
    sort: zod_1.z.enum(['trending', 'newest', 'most_branched', 'top_rated']).optional().default('trending'),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=story.js.map