import { TagProps } from "./tag";

export interface SerieProps {
    serieId?: number;
    serieTitle: string;
    serieTitleAlter: string;
    serieSlug: string;
    serieSinopse: string;
    serieThumbnail: string | File;
    serieRelease: number;
    serieStatus: string;
    serieType: string;
    serieFolder: string;
    serieTags: string;
    serieAuthors?: TagProps[];
    serieArtists?: TagProps[];
    serieGenres?: TagProps[];
}