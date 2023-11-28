import { Test, TestingModule } from '@nestjs/testing';
import { LolController } from './lol.controller';
import { LolService } from './lol.service';

describe('LolController', () => {
  let lolController: LolController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LolController],
      providers: [LolService],
    }).compile();

    lolController = app.get<LolController>(LolController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(lolController.getMatches('LegitKorea', 'NA1')).toBe(
  //       'Hello World!',
  //     );
  //   });
  // });
});
