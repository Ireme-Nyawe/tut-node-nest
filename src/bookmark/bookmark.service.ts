import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService){}
    async getBookMarks(userId:number){
        const bookmarks = await this.prisma.bookmark.findMany({where:{userId:userId}})
    }
    getBookMarkById(userId:number,bookmarkId:number){}
    createBookMark(userId:number,dto:CreateBookmarkDto){}
    editBookMark(userId:number,dto:EditBookmarkDto){}
    deleteBookMark(userId:number,bookmarkId:number){}
}
