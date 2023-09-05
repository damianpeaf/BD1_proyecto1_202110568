import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ModelService } from './model/model.service';

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

  @Get('cargartabtemp')
  cargartabtemp() {
    return this.modelService.cargarTablaTemporal();
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
    return this.modelService.cargarModelo();
  }
}
