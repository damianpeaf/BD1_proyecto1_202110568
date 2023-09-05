import {
  Controller,
  Get,
  UseInterceptors,
  UploadedFiles,
  Post,
  ParseFilePipe,
  FileTypeValidator,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ModelService } from './model/model.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidNamePipe } from './files/files.pipe';
import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly modelService: ModelService,
  ) {}

  @Get('consulta1')
  consulta1() {
    return this.appService.getPresidenciables();
  }

  @Get('consulta2')
  consulta2() {
    return this.appService.getDiputados();
  }

  @Get('consulta3')
  consulta3() {
    return this.appService.getAlcaldes();
  }

  @Get('consulta4')
  consulta4() {
    return this.appService.getCandidatosPorPartido();
  }

  @Get('consulta5')
  consulta5() {
    return this.appService.getVotosPorDepartamento();
  }

  @Get('consulta6')
  consulta6() {
    return this.appService.getVotosNulos();
  }

  @Get('consulta7')
  consulta7() {
    return this.appService.getTop10Edades();
  }

  @Get('consulta8')
  consulta8() {
    return this.appService.getTop10Presidenciables();
  }

  @Get('consulta9')
  consulta9() {
    return this.appService.getTop5Mesas();
  }

  @Get('consulta10')
  consulta10() {
    return this.appService.getTop5HoraConcurrida();
  }

  @Get('consulta11')
  consulta11() {
    return this.appService.getVotosPorGenero();
  }

  @Get('eliminartabtemp')
  eliminartabtemp() {
    return this.modelService.eliminarTablaTemporal();
  }

  @Post('cargartabtemp')
  @UseInterceptors(
    FilesInterceptor('files', 7, {
      storage: memoryStorage(),
    }),
  )
  @UsePipes(
    new ValidNamePipe([
      'candidatos.csv',
      'cargos.csv',
      'ciudadanos.csv',
      'departamentos.csv',
      'mesas.csv',
      'partidos.csv',
      'votaciones.csv',
    ]),
  )
  cargartabtemp(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    this.modelService.cargarTablaTemporal(files);
  }

  @Get('eliminarmodelo')
  eliminarmodelo() {
    return this.modelService.eliminarModelo();
  }

  @Get('crearmodelo')
  crearmodelo() {
    return this.modelService.crearModelo();
  }

  @Get('cargarmodelo')
  cargarmodelo() {
    try {
      return this.modelService.cargarModelo();
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }
}
