import { SerieProps } from "./serie";

export interface ChapterProps {
    chapterId: number;
    chapterNumber: number;
    chapterTitle: string;
    chapterSerieId: number;
    chapterPages: ChapterPagesProps[] | string;
    chapterCreatedAt: string;
    chapterUpdatedAt: string;
    chapterSerie?: SerieProps;
    chapterSerieFolder?: string;
}

export interface ChapterPagesProps {
    filename: string;
    mimetype: string;
    path: string;
    pageUrl: string;
}