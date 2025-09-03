import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateBookmarkDto } from './dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { BookmarkService } from './bookmark.service';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService:BookmarkService){}
    @Get()
    getAllBookmark(@GetUser('id') userId:number){
return this.bookmarkService.getBookMarks(userId)
    }
    @Get(':id')
    getBoookmarkById(@GetUser('id') userId:number,
    @Param('id',ParseIntPipe) bookMarkId:number){
        return this.bookmarkService.getBookMarkById(userId,bookMarkId)
    }
    @Post()
    createBookmark(@GetUser('id') userId:number ,@Body() dto:CreateBookmarkDto){
        return this.bookmarkService.createBookMark(userId,dto)
    }
    @Patch(':id')
    editBookMark(@GetUser('id') userId:number,@Param('id',ParseIntPipe) bookMarkId:number,@Body() dto:EditBookmarkDto){
        return this.bookmarkService.editBookMark(bookMarkId,userId,dto)
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteBookMark(@GetUser('id') userId:number,@Param('id',ParseIntPipe) bookMarkId:number){
        return this.bookmarkService.deleteBookMark(userId,bookMarkId)
    }

}
