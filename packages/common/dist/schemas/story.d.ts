import { z } from 'zod';
export declare const CreateCommentSchema: z.ZodObject<{
    episodeId: z.ZodString;
    sessionId: z.ZodString;
    authorName: z.ZodDefault<z.ZodString>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    episodeId: string;
    sessionId: string;
    authorName: string;
    text: string;
}, {
    episodeId: string;
    sessionId: string;
    text: string;
    authorName?: string | undefined;
}>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export declare const VoteCommentSchema: z.ZodObject<{
    sessionId: z.ZodString;
    voteType: z.ZodEnum<["up", "down"]>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    voteType: "up" | "down";
}, {
    sessionId: string;
    voteType: "up" | "down";
}>;
export type VoteCommentInput = z.infer<typeof VoteCommentSchema>;
export declare const UpdateJourneySchema: z.ZodObject<{
    sessionId: z.ZodString;
    seriesId: z.ZodString;
    episodeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    episodeId: string;
    sessionId: string;
    seriesId: string;
}, {
    episodeId: string;
    sessionId: string;
    seriesId: string;
}>;
export type UpdateJourneyInput = z.infer<typeof UpdateJourneySchema>;
export declare const SeriesQuerySchema: z.ZodObject<{
    genre: z.ZodDefault<z.ZodOptional<z.ZodEnum<["all", "sci-fi", "horror", "cyberpunk", "thriller", "space", "mystery", "fantasy", "reality-show", "anime", "comedy", "drama"]>>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<["trending", "newest", "most_branched", "top_rated"]>>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort: "trending" | "newest" | "most_branched" | "top_rated";
    genre: "all" | "sci-fi" | "horror" | "cyberpunk" | "thriller" | "space" | "mystery" | "fantasy" | "reality-show" | "anime" | "comedy" | "drama";
    search?: string | undefined;
}, {
    sort?: "trending" | "newest" | "most_branched" | "top_rated" | undefined;
    genre?: "all" | "sci-fi" | "horror" | "cyberpunk" | "thriller" | "space" | "mystery" | "fantasy" | "reality-show" | "anime" | "comedy" | "drama" | undefined;
    search?: string | undefined;
}>;
export type SeriesQueryInput = z.infer<typeof SeriesQuerySchema>;
//# sourceMappingURL=story.d.ts.map