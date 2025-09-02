import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { editUserDto } from 'src/user/dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = (await moduleRef).createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vava@pr.abc',
      password: 'vava',
    };
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({password:dto.password})
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({email:dto.email})
          .expectStatus(400);
      });


      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({password:dto.password})
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({email:dto.email})
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores("user_token","access_token")
      });
    });
  });
  describe('Users', () => {
    describe('Get Me', () => {
      it("should get me",()=>{
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{user_token}',})
          .expectStatus(200)
      })
    });

    describe('Edit User', () => {
      let dto:Partial<editUserDto>={
        email:"vava@pr.abc",
        firstName:"Vava",
      }
      it("should edit me",()=>{
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{user_token}',})
          .expectStatus(200)
      })
    });
  });
  describe('BookMark', () => {
    describe('Get Bookmarks', () => {
      it("should get bookmarks",()=>{
        return pactum
        .spec()
        .patch('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{user_token}',})
        .expectStatus(200)
        .inspect()
      }
      )
    });
    describe('Create Bookmark', () => {});
    describe('Edit Boookmark by Id', () => {});
    describe('Delete Bookmark by Id', () => {});
  });

  it.todo(' should pass test');
});
