import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookMarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId: userId },
    });
    return bookmarks;
  }
  async getBookMarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId: userId },
    });
  }
  async createBookMark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }
  async editBookMark(bookmarkId, userId: number, dto: EditBookmarkDto) {
    // check the bookmark and ownership
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('access to bookmark denied!');
    return await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }
  async deleteBookMark(userId: number, bookmarkId: number) {
    // check the bookmark and ownership
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('access to bookmark denied!');
    return await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }
}
