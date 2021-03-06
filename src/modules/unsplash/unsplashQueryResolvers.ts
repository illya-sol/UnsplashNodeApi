import { Arg, Authorized, Query, Resolver } from "type-graphql";
import Unsplash, { toJson } from 'unsplash-js';
import { env } from '../../env.config';
import { unsplashInput, unsplashSearchInput } from './inputs/unsplashInputs';
import { unsplashOutput } from './inputs/unsplashOutput';

global.fetch = require('node-fetch')

const unsplash = new Unsplash({
    accessKey: env.uAccess,
    secret: env.uSecret
})

@Resolver()
class ListPhotosResolver {
    @Authorized()
    @Query(() => [unsplashOutput], { nullable: true })
    async listPhotos(
        @Arg("data") { page, perPage, orderBy }: unsplashInput
    ): Promise<[unsplashOutput] | null> {
        return new Promise((res, rej) => {
            unsplash.photos.listPhotos(page, perPage, orderBy).then(toJson).then(json => {
                res(json as [unsplashOutput])
            }).then(err => {
                rej(err)
            })
        })
    }
}

@Resolver()
export class SearchPhotoResolver {
    @Authorized()
    @Query(() => [unsplashOutput], { nullable: true })
    async searchPhotos(
        @Arg("data") { page, keyword, perPage }: unsplashSearchInput
    ): Promise<[unsplashOutput] | null> {
        return new Promise((res, rej) => {
            unsplash.search.photos(keyword, page, perPage).then(toJson).then(json => {
                res(json.results as [unsplashOutput])
            }).then(err => {
                rej(err)
            })
        })
    }
}

export const unsplashMutationResolvers = [ListPhotosResolver, SearchPhotoResolver] as const